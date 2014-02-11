// Page level views
App.DetailEntityPageView = Backbone.View.extend({
    detailTemplate: Handlebars.templates.detail_summary,
    initialize: function(settings) {
        settings = settings || {};

        if (!settings.id) {
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

App.SearchPageView = Backbone.View.extend({
    summaryTemplate: Handlebars.templates.sa_card_summary,
    rowTemplate: Handlebars.templates.sa_card_row,
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
                searchResults = [],
                quickSummary = this.summaryTemplate(
                    _(this.collection.models).first().toJSON());

            _(this.collection.models).each(function(model) {
                var row = that.rowTemplate(model.toJSON());
                searchResults.push(row);
            });

            this.searchResultCanvas.html(searchResults.join("\n"));
            this.quickSummaryCavnas.html(quickSummary);
        }
    },
});
