// Page level views
App.DetailEntityPageView = Backbone.View.extend({
    detailTemplate: Handlebars.templates.detail_summary,
    initialize: function(settings) {
        settings = settings || {};

        if (!settings.id) {
            debugger;
            this.collection = null;
            this.editing = true;
            this.render();
        } else {
            this.collection =
                new App.SummaryCardCollection(App.SPECIFIC_ENTITY, settings.id);
            this.collection.on('reset', this.render, this);
        }

        this.colManager = App.ColManager;
    },
    render: function() {
        if (this.collection) {
            var item = _(this.collection.models).first();
        } else {
            var item = new App.SummaryCardModel();
        }

        this.renderMain(item);
        this.renderData(item);
    },
    renderMain: function(item) {
        var isPrivate = item.get('private'),
            templateValues = item.toJSON();

        templateValues.editing = this.editing;
        $('#main-summary').html(this.detailTemplate(templateValues));

        //App.DetailPage.privacyIcon
        //    .attr('class', isPrivate ? "fa fa-lock" : "fa fa-globe")
        //    .attr('title', isPrivate ? "Private" : "Public")
        //    .tooltip();
    },
    renderData: function(item) {
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
    }
});

App.PageView = Backbone.View.extend({
    initialize: function(settings) {
        settings = settings || {};

        this.renderMode = settings.renderMode || 'default';
        this._filter = function(e) {
            return true;
        };

        if (settings.renderMode != "card" && settings.id) { //specific entity
            new App.DetailEntityPageView(settings);
        } else {
            if (settings.renderMode == "card") {
                new App.PinCardCollectionView(settings);
            }
            else { // default is tabular
                new App.TableCardCollectionView(settings);
            }
        }
    },
});

App.GraphView = Backbone.View.extend({
    initialize: function(settings) {
        this.collection = new App.LinkCollection();
        this._filter = function(e) {
            return true;
        };

        this.domContainer = settings.domContainer;
        this.collection.fetch({data: $.param({leftId: App.leftId, rightId: App.rightId})});
        this.collection.on('reset', this.render, this);
    },
    filter: function(func) {
        if (!func) {
            this._filter = function(e) {
                return true;
            }
        }
        else {
            this._filter = func;
        }
    },
    render: function() {
        var that = this,
            filteredList = _.filter(this.collection.models, this._filter);

        console.log('In LinkCollectionView');
        _.each(filteredList, function(item) {
            that.renderLink(item);
        }, this);
    },
    renderLink: function(item) {
        var linkView = new App.LinkView({
            model: item
        });

        this.domContainer.append(linkView.render().el);
    },
});
