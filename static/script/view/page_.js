// Page level views
App.DetailEntityPageView = Backbone.View.extend({
    detailTemplate: Handlebars.templates.detail_summary,
    el: '#main-summary',
    events: {
        'click .infoBar li': 'infoBarClickHandler',
        'click #change-image-btn': 'changeImage',
        'click #save-btn': 'saveEdit',
        'click #cancel-btn': 'cancelEdit',
    },
    // event handler
    infoBarClickHandler: function(e) {
        var eventSrc = e.target,
            eOrig = $(e.currentTarget),
            op = eOrig.attr('data-original-title');
        switch (op) {
            case "Edit": {
                this.editing = true;
                this.render();
            }
        }
    },
    changeImage: function(e) {
        var model = this.model;

        $('#imageChangeModal').modal();
        $('#imageURLSaveBtn').click(function() {
            var imgUrl = $('#imageURLInput').val();
            model.set('imgURL', imgUrl);
            $('#profile-img').attr('style', 'background-image: url("' + imgUrl + '")');
        });
    },
    saveEdit: function(e) {
        var model = this.model,
            tags = _($('#tag').val().split('#')).map(function(tag) {
                return tag.replace(',', '').trim();
            });

        model.set('name', $('#name').val() || '');
        model.set('description', $('#description').val() || '');
        model.set('private', false);
        model.set('imgURL', $('#imageURLInput').val());
        model.set('tags', tags);

        this.editing = false;
        this.model.on('change', this.render, this);

        model.save();
    },
    cancelEdit: function(e) {
        this.editing = false;
        this.render({changed: {}});
    },
    initialize: function(settings) {
        settings = settings || {};

        if (!settings.id) {
            this.model = new App.SummaryCardModel();
            this.editing = true;
            this.render();
        } else {
            this.model = new App.SummaryCardModel({id: settings.id});
            //new App.SummaryCardCollection(App.SPECIFIC_ENTITY, settings.id);
            this.model.on('change', this.render, this);
            this.model.fetch();
        }
    },
    render: function(settings) {
        settings = settings || {};

        if (settings.changed) {
            this.renderMain(this.model, settings);
            if (settings.changed.data || settings.changed.attributes) {
                this.renderData(this.model, settings);
            }
        } else {
            this.renderMain(this.model, settings);
            this.renderData(this.model, settings);
        }

        this.$('.infoBar li').tooltip({placement: 'right'});

        // Manually attach a new event
        this.$('textarea:not([data-widearea])')
            .keyup(textAreaAdjust)
            .on('input propertychange', textAreaAdjust)
            .on('paste', function(e) {setTimeout(textAreaAdjust(e), 500);})
            .trigger('keyup');
    },
    renderMain: function(item, settings) {
        var isPrivate = item.get('private'),
            templateValues = item.toJSON();

        if (templateValues.description.trim() === "") {
            templateValues.description = "";
        }

        templateValues.editing = this.editing;
        templateValues.contributors =
            App.ContributorView.render(item.get('contributors'));

        this.$el.html(this.detailTemplate(templateValues));
        $('#imageURLInput').val(this.model.get('imgURL'));
    },
    renderData: function(item, settings) {
        if (this.editing) {
            return;
        }

        var dataContainer = App.ColManager.CardCol;
            renderSimpleCard = function(renderType, list) {
                _(list).each(function(__, ind) {
                    var simpleCard = new App.SimpleCard({
                        model: item,
                        renderType: renderType,
                        renderIndex: ind
                    });

                    dataContainer.next().append(simpleCard.render().el);
                });
            };

        renderSimpleCard('data', item.get('data'));
        renderSimpleCard('attributes', item.get('attributes'));
    },
});

App.SearchPageView = Backbone.View.extend({
    summaryTemplate: Handlebars.templates.sa_card_summary,
    rowTemplate: Handlebars.templates.sa_card_row,
    statTemplate: Handlebars.templates.stat_summary,
    el: '#search-result',
    events: {
        'click .info-card': 'renderQuickSummary',
    },
    renderQuickSummary: function(e) {
        var target = e.currentTarget;
        this._renderQuickSummary($(target).attr('data-index'));
    },
    initialize: function(settings) {
        settings = settings || {};

        this.collection =
            new App.SummaryCardCollection(App.SEARCH_ENTITY, settings.query)

        this.pageType = {'type': "search", 'value': settings.query};
        this.collection.on('reset', this.render, this);

        this.parentDOM = $('#top');
        this.quickSummaryCanvas = $('#quick-summary');
        this.quickSummaryCanvas.scrollToFixed({ marginTop: 25});
    },
    render: function() {
        // Didn't find anything
        if (this.collection.models.length == 0) {
            document.location.href = window.location.origin +
                "/entity/new?empty=true&searchterm=" +
                encodeURIComponent(App.GlobalWidget.searchInput.val());
        } else {
            var that = this,
                searchResults = [];
        
            _(this.collection.models).each(function(model, ind) {
                var row = that.rowTemplate(_.extend(model.toJSON(), {index: ind}));
                searchResults.push(row);
            });

            this.$el.html(searchResults.join("\n"));
            this._renderQuickSummary(0);
        }
    },
    _renderQuickSummary: function(index) {
        var quickSummaryModel = this.collection.models[index];
            templateValues = quickSummaryModel.toJSON(),
            that = this;

        templateValues.contributors =
            App.ContributorView.render(quickSummaryModel.get('contributors'));

        templateValues.summary = _(quickSummaryModel.get('summary'))
            .map(function(stat) {
                return that.statTemplate(stat);
            }).join("\n");

        this.quickSummaryCanvas.find('#block-container').html(this.summaryTemplate(templateValues));
    },
});
