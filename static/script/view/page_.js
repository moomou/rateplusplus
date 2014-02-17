// Page level views
App.DetailEntityPageView = Backbone.View.extend({
    detailTemplate: Handlebars.templates.detail_summary,
    el: '#main-summary',
    events: {
        'click .infoBar li': 'infoBarClickHandler',
        'click #change-image-btn': 'changeImage',
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

        this.colManager = App.ColManager;
    },
    render: function(settings) {
        this.renderMain(this.model, settings);
        this.renderData(this.model, settings);

        this.$('.infoBar li').tooltip({placement: 'right'});

        $('textarea:not([data-widearea])')
            .keyup(textAreaAdjust)
            .on('input propertychange', textAreaAdjust)
            .on('paste', function(e) {setTimeout(textAreaAdjust(e), 500);});
    },
    renderMain: function(item, settings) {
        var isPrivate = item.get('private'),
            templateValues = item.toJSON();
        
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

        var colManager = this.colManager;
        var renderSimpleCard = function(renderType, list) {
            _(list).each(function(__, ind) {
                var simpleCard = new App.SimpleCard({
                    model: item,
                    renderType: renderType,
                    renderIndex: ind
                });

                colManager.CardCol.getNext().append(simpleCard.render().el);
            });
        };

        renderSimpleCard('data', item.get('data'));
        renderSimpleCard('attributes', item.get('attributes'));
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
    saveChange: function(e) {
        var model = this.model,
            tags = _($('#tag').val().split('#')).map(function(tag) {
                return tag.replace(',', '').trim();
            });

        model.set('name', $('#name').val() || '');
        model.set('description', $('#description').val() || '');
        model.set('private', false);
        model.set('imgURL', $('#imageURLInput').val());
        model.set('tags', tags);
        model.save();
    }
});

App.SearchPageView = Backbone.View.extend({
    summaryTemplate: Handlebars.templates.sa_card_summary,
    rowTemplate: Handlebars.templates.sa_card_row,
    statTemplate: Handlebars.templates.stat_summary,
    initialize: function(settings) {
        settings = settings || {};

        this.collection =
            new App.SummaryCardCollection(App.SEARCH_ENTITY, settings.query)

        this.pageType = {'type': "search", 'value': settings.query};
        this.collection.on('reset', this.render, this);

        this.parentDOM = $('#top');
        this.quickSummaryCavnas = $('#quick-summary');
        this.searchResultCanvas = $('#search-result');
    },
    _renderToPage: function(parentDOM) {
        parentDOM.hide();
        while (arguments > 2) {
            var _parent = arguments[0],
                _child = arguments[1],
                arguments = arguments.splice(2);
            _parent.addChild(_child);
        }
        parentDOM.show();
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

            _(this.collection.models).each(function(model) {
                var row = that.rowTemplate(model.toJSON());
                searchResults.push(row);
            });

            this.searchResultCanvas.html(searchResults.join("\n"));
            this.renderQuickSummary();
        }
    },
    renderQuickSummary: function() {
        var quickSummaryModel = _(this.collection.models).first();
            templateValues = quickSummaryModel.toJSON(),
            that = this;

        templateValues.contributors =
            App.ContributorView.render(quickSummaryModel.get('contributors'));

        templateValues.summary = _(quickSummaryModel.get('summary'))
            .map(function(stat) {
                return that.statTemplate(stat);
            }).join("\n");

        this.quickSummaryCavnas.html(this.summaryTemplate(templateValues));
    },
});
