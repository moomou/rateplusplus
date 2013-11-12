var App = App || {};

/*
    Constants for App
*/
App.TWITTER_LINK= "https://twitter.com/share?";
App.API_SERVER = 'http://api.cloverite.com/';
App.API_VERSION = 'v0/';

App.AE_H_URL = App.API_VERSION + 'ae/tag';
App.AE_C_URL = App.API_VERSION + 'ae/cat';

App.POSITIVE = "positive";
App.NEGATIVE = "negative";

App.SEARCH_ENTITY  = 'entitySearch';
App.SPECIFIC_ENTITY = 'specificEntity';
App.SPECIFIC_RANKING = 'specificRanking';

/*
    Individual Component
*/
App.AdModel = Backbone.Model.extend({
	urlRoot: App.API_VERSION + 'ad/',
    defaults: {
        redirectURL: '',
        imageURL: '',
    },
    parse: function(response) {
        console.log('Get Ad');
        return response;
    },
});

App.EntityModel = Backbone.Model.extend({
	urlRoot: App.API_SERVER + App.API_VERSION + 'entity/',
    defaults: {
        //DOM
        editable: true,
        //Backend
    	id: undefined,
        name: 'New Entity',
        private: false,
        imgURL: '',
        description: 'Add Short Description',
        tags: [''],
    },
    initialize: function() {
        this.set('domId', _.uniqueId('domId'));
    },
});

App.EntityAttributeModel = Backbone.Model.extend({
    urlRoot: function() {
        return [App.API_SERVER,
            App.API_VERSION,
            'entity/',
            this.get('entity') + '/',
            'attribute/'].join("");
    },
    defaults: {
        // DOM
        editable: false,
        // BACKEND
    	id: undefined,      // unique attr id
        entity: undefined,  // unique entity id
        type: undefined,    // type of attr data
        tone: App.POSITIVE,
        name: 'New Attribute',
        upVote: 0,
        downVote: 0,
        // link data
        srcURL: undefined,
        description: undefined,
        // LOCAL
        voteCount: 0,
        voted: false,
    },
    //Builtin Function
    initialize: function() {
        var rating = this.getRating();
        var that = this;

        var getToneIcon = function(tone) {
            if (tone !== App.POSITIVE) {
                return 'black-heart';
            }
            return 'red-heart';
        };

        this.set('rating', rating);
        this.set('upVotePer100', rating);

        if (!rating) {
            this.set('downVotePer100', 0);
        }
        else {
            this.set('downVotePer100', 100 - rating);
        }

        this.set('TONE_ICON', getToneIcon(this.get('tone')));

        this.on('change:tone', function(e) {
            this.set('TONE_ICON', getToneIcon(this.get('tone')));
        });
    },
    parse: function(response) {
        return response;
    },
    //Custom Func
    getRating: function() {
        this.set('voteCount', this.get('upVote') + this.get('downVote'));

        var rating = this.get('upVote')/(this.get('voteCount') || 1);
        rating = this.get('voteCount') ? (rating*100).toFixed(0) : 0;
        return rating;
    },
    enqueuVote: function(voteType, view) {
        var that = this;
        var voteURL = this.url()+"/vote";

        this.set('voted', true);

        if (this.isNew()) {
            this.set('editable', false);
            this.updateVoteCount(voteType, view);
            this.save({}, {
                success: function(model, response) {
                },
            });
            return;
        }

        $.ajax({
            type: "POST",
            url: voteURL,
            data: {tone: voteType},
        })
        .done(function(res) {
            if (!res.error) {
                that.updateVoteCount(voteType, view);
            }
        })
        .fail(function(msg) {
            //this.set('voted', false);
        });
    },
    updateVoteCount: function(voteType, view) {
        if (voteType === App.POSITIVE) {
            this.set('upVote', this.get('upVote')+1);
        }
        else {
            this.set('downVote', this.get('downVote')+1);
        }

        var rating = this.getRating();

        this.set('rating', rating);
        this.set('upVotePer100', rating);
        this.set('downVotePer100', 100-rating);

        view.render();
    },
});

App.CommentModel = Backbone.Model.extend({
    urlRoot: function() {
        return [App.API_SERVER,
            App.API_VERSION,
            'entity/',
            this.get('entity') + '/',
            'comment/'].join("");
    },
    defaults: {
        // required
    	id: undefined,
        // Required
        entity: undefined,
        username: 'Anonymous',
        // Server side
        comment: '',
        location: '',
        createdAt: '',
        modifiedAt: '',
        private: false
    },
    //Builtin Function
    initialize: function() {
    },
    parse: function(response) {
        return response;
    },
});

App.ProfileRowModel = Backbone.Model.extend({
    urlRoot: function() {
        return [App.API_SERVER,
            App.API_VERSION,
            'user/',
            this.get('user') + '/',
            this.get('resourceType')].join("");
    },
    defaults: {
        // required
    	id: undefined,
        to: undefined,
        from: undefined,

        // Required
        user: undefined,
        resourceType: undefined
    }
});

App.LinkModel = Backbone.Model.extend({
    urlRoot: App.API_VERSION + 'relation/',
    defaults: {
        editable: true,
        LtoR: "-> New Link",
        RtoL: "New Link <-",
    },
    initialize: function() {
    },
    parse: function(response) {
        console.log(response);
    },
});


/*
    Summary Model: EntityModel + Summary Stats + Attr; there is no SummaryModel in the server
*/
App.SummaryCardModel = Backbone.Model.extend({
	defaults: {
        editable: false,
        domId: undefined,
	},
	initialize: function(spec) {
        console.log('init SummaryCardModel');
        this.set('domId', _.uniqueId("domId"));

        if (this.isNew()) {
            this.set('editable', true);

            var newEntity = new App.EntityModel({editable: this.get('editable')});
            var newAttrCollection = new App.AttributeCollection();

            _.extend(this.attributes, newEntity.toJSON());

            this.set('hashTags', '');
            this.set('summary', this.getEntityStats(this.get('attributes')));
            this.set('entityModel', newEntity);
            this.set('attributeCollection', newAttrCollection);
        }

        this.on('entityModelUpdated', this.updateSummaryCard);
    },
    parse: function(response) {
        console.log("SummaryCardModel Parse");
        
        response['hashTags'] =
            this.cleanTags(response['tags']);
        response['summary'] =
            this.getEntityStats(response['attributes']);
        response['entityModel'] =
            new App.EntityModel(response);
        response['attributeCollection'] =
            new App.AttributeCollection(response['attributes'], response['id']);

        return response;
    },
    //event handler
    updateSummaryCard: function() {
        console.log('Calling SummaryModel update');
        var entityModel = this;
        var tags = this.cleanTags(entityModel.get('tags'));

        this.set('hashTags', tags['hashTags']);
        this.set('summary', this.getEntityStats(entityModel.get('attributes')));
    },
    //Custom Functions
    cleanTags: function(tags) {
        var hashTags = '';

        _.each(tags, function(tag) {
            if (tag.indexOf("__global__") >= 0) {
                return;
            }

            if (tag[0] == "#") {
                hashTags += '<li>'+tag.substr(1)+'</li>';
            }
            else {
                console.log("Tag without hash prefix!");
                hashTags += '<li>' + tag +'</li>';
            }
        });
    
        return hashTags;
    },
    updateEntityStats: function(attrs) {
        console.log('updateEntityStats');
        $.extend(this.get('summary'), this.getEntityStats(attrs));
    },
    getEntityStats: function(attrs) {
        console.log('GetEntityStats Called');
        var attrLength = attrs ? attrs.length : 0,
            posAttr = 0,
            negAttr = 0,
            totalVote = 0,
            avgScore = 0,
            upVote = 0;

        _.each(attrs, function(attr) {
            attr['voteCount'] = attr['upVote']+attr['downVote'];
            totalVote += attr['voteCount'];
        });

        if (totalVote !== 0) {
            _.each(attrs, function(attr) {
                var attrScore = attr['upVote']/(attr['voteCount'] || 1); //divide by totalCount unless 0
                avgScore += attrScore * (attr['voteCount']/(totalVote || 1)) * (attr['tone'] === App.NEGATIVE ? -1 : 1) ;

                upVote += attr['upVote'];

                if (attr['tone'] === App.POSITIVE) {
                    posAttr += 1;
                }
            });
        }

        avgScore *= 100;

        return {
            'totalVote': totalVote,
            'totalUpVote': upVote,
            'totalDownVote': totalVote - upVote,
            'totalPosAttr': posAttr,
            'totalNegAttr': attrLength - posAttr,
            'avgScore': avgScore ? avgScore.toFixed(0).toString() : '-',
            'totalAttribute': attrLength,
        };
    },
});

/*
    Collections
*/
App.LinkCollection = Backbone.Collection.extend({
    url: App.API_VERSION + 'relationlist/',
    model: App.LinkModel,
    parse: function(response) {
        return response.results;
    },
});

App.AttributeCollection = Backbone.Collection.extend({
    model: App.EntityAttributeModel,
    initialize: function(models, entity) {
        if (entity) {
            _.each(models, function(model) { model['entity'] = entity})
        }
    },
    comparator: function(m) {
        return -m.get('voteCount');
    },
});

App.SummaryCardCollection = Backbone.Collection.extend({
	url: function() {
        return App.API_SERVER + App.API_VERSION + this.urlStub;
    },
    initialize: function(cardType, data) {
        if (cardType == App.SPECIFIC_RANKING) {
            this.urlStub = 'ranking/share/' + data;
            this.fetch();
        }
        else if (cardType == App.SPECIFIC_ENTITY) {
            this.urlStub = "entity/" + data;
            this.fetch();
        }
        else if (cardType == App.SEARCH_ENTITY) {
            this.urlStub = 'entity/search/';
            this.fetch({data: $.param({q: data})});
        }
    },
    model: App.SummaryCardModel,
    comparator: function(m) {
        var currentRankingInd = parseInt(sessionStorage.getItem("currentRankingInd")),
            allRankings = sessionStorage.getItem("allRankings") &&
            JSON.parse(sessionStorage.getItem("allRankings"));

        if (currentRankingInd >= 0 && allRankings && m.get('id')) {
            var currentRanking =
                currentRankingInd < allRankings.length && allRankings[currentRankingInd],
                rank = currentRanking.ranks.indexOf(m.get('id').toString());

            if (rank >= 0)
                return rank;
        }

        return -m.get('summary').totalVote + 999;
    },
    // Custom Func
    sortByX: function(option) {
        this.sortProp = option.prop;
        this.sortOrder= option.order;

        this.comparator = function(m) {
            if  (this.sortProp) {
                if (this.sortOrder == "asc") {//high to low
                    return m.get('summary')[this.sortProp];
                }
                return -m.get('summary')[this.sortProp];
            }
            else {
                return -m.get('summary').totalVote;
            }
        };

        this.sort();
    },
});

App.CommentCollection = Backbone.Collection.extend({
    url: function() {
        return [App.API_SERVER,
            App.API_VERSION,
            'entity/',
            this.entity + '/',
            'comment/'].join("");
    },
    model: App.CommentModel,
    initialize: function(settings) {
        this.entity = settings.entity;
    },
});

/*
    Utility Functions
*/
App.Utility = (function() {
    //private
    var toWords = function(text) {
        //Do any fancy cleanup and split to words
        //I'm just doing a simple split by spaces.
        return text.toLowerCase().split(/\s+/);
    };

    var partialMatch = function(original, fragment) {
        //get the words of each input string
        var origWords = toWords(original + ""), //force to string
        fragWords = toWords(fragment);

        //if all words in the fragment match any of the original words,
        //returns true, otherwise false
        return _.all(fragWords, function(frag) {
            return _.any(origWords, function(orig) {
                return orig && orig.indexOf(frag) >= 0;
            });
        });
    };

    var filterCollection = function(collection, filterValue) {
        if (filterValue === "") {
            return collection.toJSON();
        }
        return collection.filter(function(data) {
            return _.some(_.values(data.toJSON()), function(value) {
                return partialMatch(value, filterValue);
            });
        });
    };

    //public
    return {
        filterCollection: filterCollection
    };
})();

App.ColManager = (function() {
    //private
    var configCol = function(colRef) {
        return function() {
            return {
                ind: 0,
                cols: colRef,
                getNext: function () {
                    var curInd = this.ind;
                    this.ind = (this.ind + 1) % colRef.length;
                    return colRef[curInd];
                },
            };
        };
    };

    var cardCols = [$('#col1'), $('#col2'), $('#col3'), $('#col4')],
        cmtCols = [$('#cmt1'), $('#cmt2'), $('#cmt3')],
        getCardCol = configCol(cardCols),
        getCmtCol = configCol(cmtCols);

    return {
        getCardCol: getCardCol,
        getCmtCol: getCmtCol
    };
})();

App.ShowTrendyLink = function() {
    $.ajax({
        'url': App.API_VERSION+'tags/',
        'type': 'GET'
    })
    .done(function(tags) {
        var aTags = "";
        for (var ind in tags) {
            aTags += "<a href='/?q="+encodeURIComponent(tags[ind])+"'>"+tags[ind]+"</a> ";
        }
        App.MessageBox.fadeToggle();
        App.LinkBox.html(aTags);
    });
};

App.ConfigureTagit = function(option, that, editable) {
    var sourceURL = App.AE_H_URL;
        prefix = "#";

    return {
        autocomplete: {delay: 0, minLength: 2, source: sourceURL},
        afterTagAdded: function(event, ui) {
            var tags = that.entityView.model.get('tags');

            if (ui.tagLabel && tags.indexOf(prefix+ui.tagLabel) < 0) {
                var label = ui.tagLabel[0] == prefix ? ui.tagLabel : prefix + ui.tagLabel;
                tags.push(label);
                console.log("New Tags");
                console.log(tags);
            }
        },
        afterTagRemoved: function(event, ui) {
            var tags = that.entityView.model.get('tags');
            var label = ui.tagLabel[0] == prefix ? ui.tagLabel : prefix + ui.tagLabel;
            var ind = tags.indexOf(label);
            tags.splice(ind, 1);
            console.log(tags);
        },
        readOnly: !editable,
        onTagClicked: function(event, ui) {
            $('#searchInput').val(ui.tagLabel);
            $('#searchForm').submit();
        }
    }
};

App.CreateNewCard = function() {
    console.log("Creating new card")
    var newEntityRow = document.getElementById('dr1');

    // intentionally global to keep events
    newCard = new App.SummaryCardView({
        model: new App.SummaryCardModel({}),
        renderMode: "detail"});
    newEntityRow.appendChild(newCard.render().el);

    // manually activate edit mode
    newCard.model.set('editable',true);
    newCard.render(true);

    return newCard;
};
