// Page level views
//

INSTANT_MODE = "_instant_mode";
DATA_MODE    = "_data_mode";
SEARCH_MODE  = "_search_mode";

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
    summaryTemplate : Handlebars.templates.sa_card_summary,
    rowTemplate     : Handlebars.templates.sa_card_row,
    statTemplate    : Handlebars.templates.stat_summary,
    el              : '#search-result',
    events: {
        'click .info-card': 'expandSelected',
    },
    expandSelected: function(e) {
        var target = e.currentTarget;
        this.renderQuickSummary($(target).attr('data-index'));
    },
    detectSearchMode: function(inputQuery) {
        // currently 3 modes supported
        // 1. Instant Search
        // 2. Aggregate Data
        // 3. Everything

        var queryParts = decodeURI(inputQuery).split('#'),
            queryPartsLength = queryParts.length,
            result = {};

        if (queryPartsLength == 1) {
            result.subject = queryParts[0];
            result.mode    = INSTANT_MODE;
        } else if (queryPartsLength >= 2) {
            result.subject = queryParts[0];
            result.parts   = _.rest(queryParts);
            result.mode    = DATA_MODE;
        }

        return result;
    },
    initialize: function(settings) {
        settings = settings || {};

        this.collection =
            new App.SummaryCardCollection(App.SEARCH_ENTITY, settings.query)

        this.searchMode = this.detectSearchMode(settings.query);
        this.collection.on('reset', this.render, this);

        this.quickSummaryCanvas = $('#quick-summary');
        this.infoContainer      = $('#info-container');
        //this.quickSummaryCanvas.scrollToFixed({ marginTop: 25});
    },
    renderQuickSummary: function(index) {
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
    renderData: function(renderedData) {
    },
    render: function() {
        // Didn't find anything
        if (this.collection.models.length == 0) {
            document.location.href = window.location.origin +
                "/entity/new?empty=true&searchterm=" +
                encodeURIComponent(App.GlobalWidget.searchInput.val());
            return;
        }

        var that              = this,
            searchMode        = this.searchMode,
            searchResultLeft  = [],
            searchResultRight = [];
        
        switch (searchMode.mode) {
            case INSTANT_MODE: {
            }
            case DATA_MODE: {
                var regexMatches = _(searchMode.parts).map(function(part) {
                    return new RegexEx(part, 'g');
                });

                _(this.collection.models).each(function(model, ind) {
                    var filteredData = _(model.get('data')).filter(function(data) {
                        return _(regexMatches).find(function(regexMatch) {
                            return regexMatch.match(data);
                        });
                    }),
                    renderedData = _(filteredData).map(function(data) {
                        return App.ContentDataView.renderRow(data);
                    }),
                    row  = that.rowTemplate(_.extend(model.toJSON(), {index: ind}));

                    searchResultLeft.push(row);
                    searchResultRight = _(searchResultRight)
                        .union(renderedData);

                    if (renderData.length != 0) {
                        _(renderData.length - 1).times(function(e) {
                            searchResultLeft.push(that.rowTemplate({});
                        });
                    }
                });

                this.$el.html(searchResultLeft.join("\n"));
                this.infoContainer.html(renderedData);

                break;
            }
            default: {
                _(this.collection.models).each(function(model, ind) {
                    var row = that.rowTemplate(_.extend(model.toJSON(), {index: ind}));
                    searchResultLeft.push(row);
                });
                this.$el.html(searchResultLeft.join("\n"));
                this.renderQuickSummary(0);
            }
        }
    },
});
