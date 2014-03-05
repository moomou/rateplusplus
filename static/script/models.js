var App = App || {};

/**
 * Constants for App */
App.DEBUG_MODE              = false;

App.TWITTER_LINK            = "https://twitter.com/share?";
App.API_SERVER              = 'http://api.cloverite.com:9000/';
App.API_VERSION             = 'v0/';

App.AE_H_URL                = App.API_VERSION + 'ae/tag';
App.AE_C_URL                = App.API_VERSION + 'ae/cat';

App.POSITIVE                = "positive";
App.NEGATIVE                = "negative";

App.SEARCH_ENTITY           = 'entitySearch';
App.SPECIFIC_ENTITY         = 'specificEntity';
App.SPECIFIC_RANKING        = 'specificRanking';

App.TypeIndex               = {
    attribute : "attribute",
    text      : "info",
    number    : "info",
    image     : "media",
    video     : "media"
};

App.CloverModel = Backbone.Model.extend({
    initialize: function() {
        console.log("this is clovermodel");
    },
    parse: function(response) {
        console.log("CloverModel parse");
        if ("success" in response) {
            if (response.success) {
                return response.payload;
            }
            else {
                console.log("server responded with error");
            }
        }
        else {
            return response;
        }
    }
});

App.CloverCollection = Backbone.Collection.extend({
    initialize: function() {
        console.log("this is clovercollection");
    },
    parse: function(response) {
        console.log("CloverModel parse");

        if ("success" in response) {
            if (response.success) {
                return response.payload;
            } else {
                console.log("server responded with error");
            }
        } else {
            return response;
        }
    }
});

/**
 * Individual Component */
App.EntityAttributeModel = App.CloverModel.extend({
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
    //Custom Func
    getRating: function() {
        this.set('voteCount', this.get('upVote') + this.get('downVote'));
        var rating = this.get('upVote') / (this.get('voteCount') || 1);
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
            this.set('upVote', this.get('upVote') + 1);
        } else {
            this.set('downVote', this.get('downVote') + 1);
        }

        var rating = this.getRating();

        this.set('rating', rating);
        this.set('upVotePer100', rating);
        this.set('downVotePer100', 100 - rating);

        view.render();
    },
});

App.SummaryCardModel = App.CloverModel.extend({
    urlRoot: App.API_SERVER + App.API_VERSION + 'entity/',
	defaults: {
        //DOM
        editable: true,
        //Backend
    	id: undefined,
        name: '',
        private: false,
        imgURL: '',
        description: '',
        tags: [''],
    },
	initialize: function(settings) {
        console.log('init SummaryCardModel');
        this.set('domId', _.uniqueId("domId"));

        if (this.isNew()) {
            this.set('editable', true);

            var newAttrCollection = new App.AttributeCollection();

            this.set('hashTags', '');
            this.set('summary', '');
            this.set('attributeCollection', newAttrCollection);
        }
    },
    parse: function(response) {
        console.log("SummaryCardModel Parse");
        response = App.CloverModel.prototype.parse.apply(this, arguments);

        response.uniqueId = response.uniqueId ||
            "#"+Math.floor(Math.random()*999999999).toString(16);

        response.hashTags = this.generateTags(response.tags);
        response.summary = this.summarize(response);
        response.srcUrl = window.location.origin + '/entity/' + response.id;
        response.attributeCollection =
            new App.AttributeCollection(response.attributes, response.id);

        return response;
    },
    // Event handler
    updateSummaryCard: function() {
        console.log('Calling SummaryModel update');
        var tags = this.generateTags(this.get('tags'));
        this.set('hashTags', tags['hashTags']);
        this.set('summary', this.getEntityStats(this.get('attributes')));
    },
    // Custom Functions
    summarize: function(data) {
        var summary = [];

        if (data.attributes) {
            summary.push({num: data.attributes.length, category: 'Attributes'});
        }
        if (data.data) {
            summary.push({num: (data.data && data.data.length) || 0, category: 'Data point'});
        }

        return summary;
    },
    generateTags: function(tags) {
        var hashTags = '',
            queryUrl = window.location.origin + '?q=';

        _.each(tags, function(tag) {
            if (tag.indexOf("__global__") >= 0) {
                return;
            }

            hashTags += '<li><a href="' + queryUrl +
                encodeURIComponent(tag) + '">' + tag + ' </a></li>';
        });

        return hashTags;
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
            attr.voteCount = attr.upVote + attr.downVote;
            totalVote += attr.voteCount;
        });

        if (totalVote !== 0) {
            _.each(attrs, function(attr) {
                var attrScore = attr.upVote / (attr.voteCount || 1); //divide by totalCount unless 0
                if (attr.tone == App.POSITIVE) {
                    posAttr += 1;
                }
                avgScore += attrScore * (attr.voteCount / (totalVote || 1));
                upVote += attr.upVote;
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
            'totalAttribute': attrLength
        };
    },
});

/**
 * Collections */
App.AttributeCollection = App.CloverCollection.extend({
    model: App.EntityAttributeModel,
    initialize: function(models, entity) {
        if (entity) {
            _.each(models, function(model) { model['entity'] = entity})
        }
    },
    comparator: function(m) {
        return -m.get('voteCount');
    }
});

App.SummaryCardCollection = App.CloverCollection.extend({
	url: function() {
        return App.API_SERVER + App.API_VERSION + this.urlStub;
    },
    model: App.SummaryCardModel,
    initialize: function(cardType, data) {
        this.cardType = cardType;

        if (cardType == App.SPECIFIC_RANKING) {
            this.urlStub = 'ranking/share/' + data;
            this.fetch();
        } else if (cardType == App.SPECIFIC_ENTITY) {
            this.urlStub = "entity/" + data;
            this.fetch();
        } else if (cardType == App.SEARCH_ENTITY) {
            this.urlStub = 'entity/search/';
            this.fetch({data: $.param({q: data})});
        }
    },
    parse: function(response) {
        response = App.CloverCollection.prototype.parse.apply(this, arguments);

        // write the ranking data to the local sessionStorage
        if (this.cardType == App.SPECIFIC_RANKING) {
            var ranksDetail = _.clone(response.ranksDetail);
            delete response.ranksDetail;
            sessionStorage.setItem("rankingView", JSON.stringify(response));
            return ranksDetail;
        }
        else {
            return response;
        }
    },
    comparator: function(m) {
        var rawRankingView = sessionStorage.getItem('rankingView'),
            rankingView = rawRankingView && JSON.parse(rawRankingView);

        if (rankingView && m.id) {
            var rank = rankingView.ranks.indexOf(m.get('id').toString());
            if (rank >= 0) {
                return rank;
            }
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

/**
 * Utility Functions */
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
        var ind = 0,
            cols = colRef;

        return {
            all: function() {
                return cols;
            },
            next: function () {
                var curInd = ind;
                ind = (ind + 1) % cols.length;
                return cols[curInd];
            }
        };
    };

    var cardCols = [$('#col1'), $('#col2'), $('#col3'), $('#col4')],
        cmtCols = [$('#cmt1'), $('#cmt2'), $('#cmt3')];

    return {
        CardCol: configCol(cardCols),
        CmtCol: configCol(cmtCols)
    };
})();
