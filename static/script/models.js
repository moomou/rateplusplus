var App = App || {};

/*
    Constants for App
*/
App.API_SERVER = 'http://api.cloverite.com/';
App.API_VERSION = 'v0/';
App.AE_H_URL = App.API_VERSION + 'ae/tag';
App.AE_C_URL = App.API_VERSION + 'ae/cat';
App.POSITIVE = "positive";
App.NEGATIVE = "negative";

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

App.AdView = Backbone.View.extend({
    tagName: 'div',
    className: 'card',
    template: _.template(Template.sponsoredTemplate),
    initialize: function() {
       var that = this;

       this.model.on('sync', function(e) {
           that.render();
       });
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        App.Cols[2].prepend(this.el);
        return this;
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

App.EntityView = Backbone.View.extend({
    tagName: 'div',
    className: 'inner',
    events: {
        'click .editProfileBtn': 'editProfile',
    },
    template: _.template(Template.entityTemplate),
    render: function() {
        console.log('EntityView render');
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    initialize: function() {
    },
    //Event Handler
    editProfile: function(mode) {
        console.log('Editing Box');
        if (!this.model.get('editable')) {
            return;
        }

        var editBoxContainer = 'textareaContainer-' + this.model.get('domId');
        var editBoxId = 'editBox-' + this.model.get('domId');
        var $p = this.$('.description');
        var $textAreaContainer = this.$('#'+editBoxContainer);

        if (mode == 'edit') {
            wideArea('#'+editBoxContainer);
            var $textarea = $textAreaContainer.find('textarea');
            $textarea.text(($p.html()));
            $p.hide();
            $textAreaContainer.show();
        }
        else if (mode == 'save') {
            var $textarea = $textAreaContainer.find("textarea");
            var newTxt = $textarea.val();

            this.model.set('description', newTxt);
            $p.html(newTxt);

            $textAreaContainer.hide();
            $p.show();
        }
        else { //Cancel
            $p.html(this.model.get('description'));
            $textAreaContainer.hide();
            $p.show();
        }
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

App.AttributeView = Backbone.View.extend({
    template: _.template(Template.attributeRowTemplate),
    editTemplate: _.template(Template.attributeRowEditTemplate),
    tagName: 'tr',
    className: 'row',
    events: {
        'click .dropdown-menu': 'changeType',
        'click .closeBtn': 'removeAttr',
        'click .saveBtn': 'saveAttr',
        'click .voteBtn': 'attrVote',
        'click .tone': 'toneChange',
        'focusout .attrName': 'editName',
        'focusout .srcURL': 'editSrcURL',
    },
    initialize: function(inactive) {
        var that = this;
        console.log("AttrView init")
        this.model.on('sync', function(e) {
            that.render();
        });
    },
    render: function() {
        console.log('AttributeView Render');
        var dummyData = {
            labels : ["","","","","","",""],
             datasets : [
                {
                    fillColor : "#EE796C",
                    data : _(7).times(function(n) { return Math.round( Math.random() * 100);} )
                },
                {
                    fillColor : "#66EBA0",
                    data : _(7).times(function(n) { return Math.round( Math.random() * 100);} )
                }
            ]
        };

        if (this.model.isNew()) {
            this.$el.addClass('editHighlight focusOnHover');
            this.$el.html(this.editTemplate(this.model.toJSON()));
        }
        else {
            this.$el.removeClass('editHighlight focusOnHover');
            this.$el.html(this.template(this.model.toJSON()));
        }

        if (this.model.get('voted')) {
            this.$('.voteBtns').hide();
            this.$('.progress').fadeToggle();
            this.$('.vizGraph').removeClass('hidden');
            this.renderActivityGraph(this.$('.vizGraph'), dummyData);
        }

        return this;
    },
    // Custom Function
    renderActivityGraph: function(canvas, data) {
        canvas = canvas[0];

        var ctx = canvas.getContext('2d');

        new Chart(ctx).Bar(data, {
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 5,
            scaleLabel: '',
            scaleShowGridLines: false,
            barShowStroke: true,
            barStrokeWidth: 0,
            scaleShowLabels: false,
            barShowStroke: false,
            barDatasetSpacing : 1,
            barValueSpacing : 5,
            scaleShowGridLines: false,
            scaleGridLineColor: "white",
            scaleLineColor: "white",
            scaleLineWidth: 0});
    },
    //Event Handler
    attrVote: function(e) {
        e.preventDefault();
        console.log('attrVote called:');

        if ($(e.target).hasClass('upVote')) {
            this.model.enqueuVote(App.POSITIVE, this);
        }
        else {
            this.model.enqueuVote(App.NEGATIVE, this);
        }
    },
    changeType: function(e) {
        var attrType = e.target.attributes.data.textContent,
            iconClass ="<i class='icon-" + attrType + "'></i>";
        this.model.set('type', attrType);
        this.$('.typeIcon').html(iconClass);
    },
    editName: function(e) {
        console.log('editName called');
        var domRef = this.$('.attrName');
        this.model.set('name', domRef.text());
        console.log(this.model.get('name'));
    },
    editSrcURL: function(e) {
        this.model.set('srcURL', this.$(".srcURL").val());
    },
    removeAttr: function(e) {
        this.model.destroy();
        this.remove();
    },
    saveAttr: function(e) {
        console.log("save on AttributeView called");
        this.model.save();
    },
    toneChange: function(e) {
        var $i = this.$('.tone');

        if ($i.hasClass('black-heart')) {
            $i.removeClass('black-heart');
            $i.addClass('red-heart');
            this.model.set('tone', App.POSITIVE);
            this.$('.toneText').html('positive');
        }
        else {
            $i.removeClass('red-heart');
            $i.addClass('black-heart');
            this.model.set('tone', App.NEGATIVE);
            this.$('.toneText').html('negative');
        }
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

App.CommentView = Backbone.View.extend({
    template: _.template(Template.commentTemplate),
    tagName: 'div',
    className: 'card comment',
    initialize: function(setting) {
        this.voted = false;
    },
    events: {
        'mouseover': 'toggleCommentVoteMenu',
        'mouseout': 'toggleCommentVoteMenu',
        'click .btn': 'commentVote'
    },
    render: function() {
        console.log('Commentview Render');
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    //Event Handler
    toggleCommentVoteMenu: function(e) {
        var eventType = e.type,
            $btns = this.$('.btn');
            state = $btns.css('display');

        if (this.voted) {
            $btns.hide();
            return;
        }

        if (eventType === "mouseover" && state === "none") {
            $btns.show();
        }
        else if (eventType === "mouseout") {
            $btns.hide();
        }
    },
    commentVote: function(e) {
        var btn = $(e.target),
            voteType = "pos",
            that = this;

        if (this.voted) {
            return;
        }

        this.voted = true;

        if (btn.hasClass('cmtDownVote')) {
            voteType = "neg";
        }

        $.ajax({
            type: "POST",
            url: this.model.url() + "/vote/",
            data: {voteType: voteType},
        })
        .done(function(res) {
            if (!res.error) {
                that.$('.btn').fadeOut('fast');
            }
        })
        .fail(function(msg) {
            this.voted = false;
        });
    },
});

App.RowCommentView = Backbone.View.extend({
    template: _.template(Template.commentRowTemplate),
    className: 'row-fluid',
    initialize: function(setting) {
        this.commentView = setting.commentView;
    },
    render: function(side) {
        console.log('CommentRowView Render');
        this.$el.html(this.template());
        this.$('.' + side).append(this.commentView.render().el);
        return this;
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

App.ProfileRowView = Backbone.View.extend({
    template: _.template(Template.profileRowTemplate),
    tagName: 'tr',
    className: 'row',
    render: function() {
        console.log('proilfeRowView Render');
        this.$el.html(this.template(this.model));
        return this;
    },
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

App.LinkView = Backbone.View.extend({
    template: _.template(Template.linkTemplate),
    tagName: 'div',
    className: 'page-curl outer',
    initialize: function() {
    },
    events: {
        'click .close': 'saveCloseHandler',
        'click .link': 'updateLink',
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    //Event Handler
    updateLink: function(e) {
        if (this.model.get('editable')) {
            var domRef = $(e.target);
            var that = this;

            domRef.attr('contenteditable', true);
            domRef.focus();

            console.log(domRef.text());

            domRef.focusout(function() {
                that.model.set(domRef.data('link'), domRef.text());
                console.log(that.model.get('LtoR'));
                console.log(that.model.get('RtoL'));
            });
        }
    },
    saveCloseHandler: function(e) {
        var target = $(e.target);

        if (target.hasClass('icon-remove-sign')) {
            this.remove();
            this.model.destroy();
        }
        else { //save
            var relationship = this.$('.pull-left').text() + ":" + this.$('.pull-right').text();
            this.model.set("leftId", App.leftId);
            this.model.set("rightId", App.rightId);
            this.model.set("relationship", relationship);
            console.log(this.model.get('relationship'));
            this.model.save();
        }
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
            this.set('catTags', '');
            this.set('summary', this.getEntityStats(this.get('attributes')));
            this.set('entityModel', newEntity);
            this.set('attributeCollection', newAttrCollection);
        }

        this.on('entityModelUpdated', this.updateSummaryCard);
    },
	validate: function(attribs) {
	},
    parse: function(response) {
        console.log("SummaryCardModel Parse");
        var tags = this.getTags(response['tags']);

        response['hashTags'] = tags['hashTags'];
        response['catTags'] = tags['catTags'];

        response['summary'] = this.getEntityStats(response['attributes']);
        response['entityModel'] = new App.EntityModel(response);
        response['attributeCollection'] = new App.AttributeCollection(response['attributes'], response['id']);

        return response;
    },
    //event handler
    updateSummaryCard: function() {
        console.log('Calling SummaryModel update');
        var entityModel = this;
        var tags = this.getTags(entityModel.get('tags'));

        this.set('hashTags', tags['hashTags']);
        this.set('catTags', tags['catTags']);
        this.set('summary', this.getEntityStats(entityModel.get('attributes')));
    },
    //Custom Functions
    getTags: function(tags) {
        var hashTags = '';
        var catTags = '';

        _.each(tags, function(tag) {
            if (tag[0] == "#") {
                hashTags += '<li>'+tag.substr(1)+'</li>';
            }
            else if (tag[0] != "$") {
                hashTags += '<li>'+tag+'</li>';
            }
            else {
                catTags += '<li>'+tag.substr(1)+'</li>';
            }
        });

        return {
            'hashTags': hashTags,
            'catTags': catTags,
        };
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
	url: App.API_SERVER + App.API_VERSION + 'entity/',
    model: App.SummaryCardModel,
    comparator: function(m) {
        return -m.get('summary').totalVote;
    },
    parse: function(response) {
        return response;
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
    var cardCols = {
            cols: [$('#col1'), $('#col2'), $('#col3'), $('#col4')],
            ind: 0,
        },
        cmtCols = {
            cols: [$('#cmt1'), $('#cmt2'), $('#cmt3')],
            ind: 0,
        },
        getCol = function(type) {
            if (type == 'cmt' ) {
                return cmtCols;
            }
            return cardCols;
        },
        nextCol = function(type) {
            var colObj = getCol(type),
                nextCol = colObj.cols[colObj.ind];
            colObj.ind = (colObj.ind+1)%colObj.cols.length;
            return nextCol;
        },
        resetCol = function(type, range) {
            var colObj = getCol(type);

            if (range) {
                _.each(range, function(ind) {
                    colObj.cols[ind].empty();
                });
            }
            else {
                _.invoke(colObj.cols, "invoke");
            }
        },
        lastCol = function(type) {
            var colObj = getCol(type);
            return colObj.cols[colObj.cols.length-1];
        },
        addAttr = function(el, tone) {
            var colObj = getCol('card');
            var ind = tone == App.POSITIVE ? 1 : 2; //pos on col1 neg on col2

            colObj.cols[ind].append(el);
        };

    return {
        getCol: getCol,
        nextCol: nextCol,
        resetCol: resetCol,
        lastCol: lastCol,
        addAttribute: addAttr,
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
    var sourceURL = App.AE_C_URL,
        prefix = "$";

    if (option == "hash") {
        sourceURL = App.AE_H_URL;
        prefix = "#";
    }

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
        },
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
}
