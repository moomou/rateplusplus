// Page level views

App.DetailEntityPageView = Backbone.View.extend({
    initialize: function(settings) {
        settings = settings || {};

        if (!settings.id) {
            console.log("Must specify a single entity for detail");
            return;
        }

        this.collection = new App.SummaryCardCollection(App.SPECIFIC_ENTITY, settings.id);
        this.collection.on('reset', this.render, this);
    },
    render: function() {
        var item = _(this.collection.models).first();
        this.renderPage(item);
        this.renderEntity(item);
    },
    renderPage: function(item) {
        var isPrivate = item.get('private'),
            title = item.get('name');

        App.DetailPage.privacyIcon
            .attr('class', isPrivate ? "fa fa-lock" : "fa fa-globe")
            .attr('title', isPrivate ? "Private" : "Public")
            .tooltip();
        App.DetailPage.title
            .text(title);
        App.CommentContainer.show();
    },
    renderEntity: function(item) {
        var cardView = new App.SummaryCardView({
            model: item,
            renderMode: "detail"
        });

        document.getElementById('dr1').appendChild(cardView.render().el);
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
        }
        else {
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
