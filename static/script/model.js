var App = App || {};

/*
    Constants for App
*/
App.API_SERVER = 'http://api.cloverite.com/';
App.API_VERSION = '';
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
        //DOM
        editable: false,
        //BACKEND
    	id: undefined,
        entity: undefined,
        name: 'New Attribute',
        tone: App.POSITIVE,
        upVote: 0,
        downVote: 0,
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
            data: {type: voteType},
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
        'click .tone': 'toneChange',
        'click .voteBtn': 'attrVote',
        'focusout .attrName': 'editName',
        'focusout .srcURL': 'editSrcURL',
        'click .tone': 'toneChange',
        'click .saveBtn': 'saveAttr',
        'click .closeBtn': 'removeAttr',
    },
    initialize: function(inactive) {
        var that = this;
        this.model.on('sync', function(e) {
            that.render();
        });
    },
    render: function() {
        console.log('AttributeView Render');

        if (this.model.isNew()) {
            this.$el.addClass('editHighlight focusOnHover');
            this.$el.html(this.editTemplate(this.model.toJSON()));
        }
        else {
            this.$el.removeClass('editHighlight focusOnHover');
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.find('.menu').hide(); //hide report btn
        }

        if (this.model.get('voted')) {
            this.$('.voteBtns').hide();
            this.$('.progress').fadeToggle();
        }

        return this;
    },
     //Event Handler
    toneChange: function(e) {
        var $i = this.$('.tone');

        if ($i.hasClass('black-heart')) {
            $i.removeClass('black-heart');
            $i.addClass('red-heart');
            this.model.set('tone', App.POSITIVE);
        }
        else {
            $i.removeClass('red-heart');
            $i.addClass('black-heart');
            this.model.set('tone', App.NEGATIVE);
        }
    },
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
    editName: function(e) {
        console.log('editName called');
        var domRef = this.$('.attrName');
        this.model.set('name', domRef.text());
        console.log(this.model.get('name'));
    },
    editSrcURL: function(e) {
        this.model.set('srcURL', this.$(".srcURL").val());
    },
    saveAttr: function(e) {
        this.model.save();
    },
    removeAttr: function(e) {
        this.model.destroy();
        this.remove();
    },
});

App.CommentModel = Backbone.Model.extend({
    urlRoot: App.API_VERSION + 'comment/',
    defaults: {
    	id: undefined,
        entityId: undefined,
        user: 'Anonymous',
        private: false,
        editable: false,
        upVote: 0,
        downVote: 0,
        totalVote: 0
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
    className: 'page-curl outer',
    initialize: function() {
        this.voted = false;
    },
    events: {
        'mouseover': 'toggleCommentVoteMenu',
        'mouseout': 'toggleCommentVoteMenu',
        'click .btn': 'commentVote'
    },
    render: function() {
        console.log('Comentview Render');
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
        debugger;
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

App.SummaryCardView = Backbone.View.extend({
    className: 'card cardSize',
	template: _.template(Template.summaryCardTemplate, null, {variable: 'obj'}),
    summaryTemplate: _.template(Template.summaryTemplate, null, {variable: 'obj'}),
    saveCancelTemplate: _.template(Template.summaryTemplate, null, {variable: 'obj'}),
	events: {
        'click .card-header-left': 'leftCardHeaderBtnHandler',
        'click .card-header-right': 'rightCardHeaderBtnHandler',
        'click .card-title': 'updateCardTitle',
        'click .card-status': 'changePrivacy',
        'click .closeBtn': 'cancelCreation',
        'click .editImgBtn': 'changeImg',
        'click .scroll': 'attrContentScrollHandler',
        'click .saveBtn': 'saveCreation',
        'click .searchState': 'searchIconClick',
        'keypress .search-query': 'attrSearch',
        'mouseover .photo': 'toggleEditImgBtn',
        'mouseout .photo': 'toggleEditImgBtn',
        'mouseover': 'toggleCardHeaderBtn',
        'mouseout': 'toggleCardHeaderBtn',
	},
    //Builtin Func
    initialize: function(setting) {
		console.log("App.SummaryCardView initialize");

        /* 4 render mode: default, search, detail, graph */
        this.renderMode = this["render" + capFirstLetter(setting.renderMode || 'default')];
        this.colManager = setting.colManager || App.ColManager;

        this.entityView = new App.EntityView({model: this.model.get('entityModel')});
        this.attributeCollectionView = new App.AttributeCollectionView({
            entityId: this.entityView.model.get('id'),
            collection: this.model.get('attributeCollection'),
            renderMode: setting.renderMode,
            colManager: setting.colManager});

        this.preSaveAttr = [];
        this.side = setting.side;
        this.listenTo(this.model.get('attributeCollection'), 'change', this.attrChange);
    },
    renderSaveCancelBtns: function() {

    },
	render: function(editing, renderMode) {
        /*
            Editable and Editing confusing
        */
		console.log("App.SummaryCardView Render");

        var editable = this.model.get('editable'),
            domId = this.model.get('domId'),
            entityModel = this.model.toJSON(),
            isNew = this.entityView.model.isNew(),
            private = this.entityView.model.get('private');

        //_.extend(entityModel, {searchView: this.searchView});

        this.$el.html(this.template(entityModel));
        this.$('.profileContent').empty().append(this.entityView.render().el);
        //this.attributeCollectionView.clean(); //remove extra

        var that = this,
            hashTagsUL = this.$('#hashtags-'+domId),
            catTagsUL = this.$('#cattags-'+domId);

        if (editing) {
            console.log("Editing");
            this.$('.attrContainer').hide();
            this.$('.summary').hide();
            this.entityView.editProfile('edit');
        }
        else {
            this.renderMode(editing);
        }

        this.renderKonb();

        hashTagsUL.tagit(App.ConfigureTagit('hash', that, editable));
        catTagsUL.tagit(App.ConfigureTagit('cat', that, editable));

        if (!editable) {
            this.entityView.editProfile('editable');

            if (!this.model.get('hashTags')) {
                this.$('.hashTag').hide();
            }
            else {
                hashTagsUL.find('input').hide();
            }

            if (!this.model.get('catTags')) {
                this.$('.catTag').hide();
            }
            else {
                catTagsUL.find('input').hide();
            }

            this.$('.close').hide(); //save and close btn
            this.$el.removeClass('editHighlight');
        }
        else {
            this.$el.addClass('editHighlight');

            //Hide details that require model to be saved first
            this.$('.card-header-right').hide();

            hashTagsUL.find('input')
                .css('display', '')
                .attr('placeholder', 'Add New Hash Tag');

            catTagsUL.find('input')
                .css('display', '')
                .attr('placeholder', 'Add New Category Tag');

            if (!isNew) {
                this.$('.closeBtn').hide();
            }
        }

        return this;
    },
    renderDefault: function(editing) {
        console.log("renderDefault");
        this.renderSearch(editing);
    },
    renderSearch: function(editing) {
        console.log("renderSearch");
        this.attributeCollectionView.render(this.$('.attrContent'));
        this.renderChevrons();
    },
    renderDetail: function(editing) {
        console.log("renderDetail");
        this.attributeCollectionView.render(this.$('.attrContent'));
    },
    renderGraph: function(editing) {
        console.log("renderDetail");
        this.$('.attrContainer').hide();
        this.$('.editBtn').hide();
        this.$('.linkBtn').show();
        this.attributeCollectionView.render(this.$('.attrContent'));
    },
    //Event Handler
    attrContentScrollHandler: function(e) {
        var $attrContent = this.$('.attrContent'),
            $tar = $(e.target),
            attrHeight = 320,
            that = this;

        if ($tar.hasClass('up')) {
            attrHeight *= -1;
        }

        $attrContent.stop().animate({scrollTop: $attrContent.scrollTop()+attrHeight
            }, 800, function() {
                that.renderChevrons();
        });
    },
    changePrivacy: function(e) {
        var entityModel = this.entityView.model;

        if (!entityModel.isNew()) {
            return;
        }

        if (entityModel.get('private')) {
            entityModel.set('private', false);
            this.$('.card-status').find('i')
                .attr('class', 'icon-globe icon-large')
                .attr('title', 'Public');
        }
        else {
            entityModel.set('private', true);
            this.$('.card-status').find('i')
                .attr('class', 'icon-lock icon-large')
                .attr('title', 'Private');
        }
    },
    rightCardHeaderBtnHandler: function(e) {
        var target = $(e.target);
        if (target.hasClass('icon-paper-clip') || target.hasClass('linkBtn')) {
            console.log(this.side);
            if (this.side === "left") {
                App.leftId = this.model.get('id');
            }
            else {
                App.rightId = this.model.get('id');
            }
            if (App.rightId && App.leftId) {
                $(document).trigger('graphLinkSet');
            }
        }
        else { // editing
            this.model.set('editable',true);
            this.render(true);
        }
    },
    leftCardHeaderBtnHandler: function(e) {
        var $target = $(e.target);
        console.log($target);
    },
    saveCreation: function(e) {
        var that = this;

        this.$('.card-status').html('<i class="icon-spinner icon-spin icon-2x pull-left"></i>');

        this.entityView.editProfile('save'); //save the description

        this.entityView.model.save({}, {
            success: function(model, response) {
                //update summary
                $.extend(that.model.attributes, response);
                that.model.trigger('entityModelUpdated');

                //UI update
                that.model.set('editable', false);
                that.render();
            },
        });
    },
    cancelCreation: function(e) {
        if(confirm("Are you sure you want to delete this entry? It will be gone forever!")) {
            this.remove();
            this.entityView.model.destroy();
        }
    },
    updateCardTitle: function(e) {
        if (this.model.get('editable')) {
            var domRef = this.$('.card-title');
            var that = this;

            domRef.attr('contenteditable', true);
            domRef.focus();

            console.log(domRef.text());
            domRef.focusout(function() {
                that.model.set('name', domRef.text());
                that.entityView.model.set('name', domRef.text());
                console.log(domRef.text());
            });
        }
    },
    addNewAttribute: function(e, modifiedAttrTone) {
        if (e) { //if activated by UI
            e.preventDefault();
        }

        if (this.renderMode === this.renderDetail) {
            //add extra attr to each col
            if (!modifiedAttrTone || modifiedAttrTone == App.POSITIVE) {
                console.log(this.model.get('id'));
                var attrView = new App.AttributeView({
                    model:this.attributeCollectionView.getNewAttrModel()});
                attrView.$el.addClass('focusOnHover');
                App.ColManager.addAttribute(attrView.render().el, App.POSITIVE); //pos

                // save for easy access later
                this.preSaveAttr.push(attrView);
            }
            if (!modifiedAttrTone || modifiedAttrTone == App.NEGATIVE) {
                var attrView = new App.AttributeView({
                    model:this.attributeCollectionView.getNewAttrModel(App.NEGATIVE)});
                attrView.$el.addClass('focusOnHover');
                App.ColManager.addAttribute(attrView.render().el, App.NEGATIVE); //neg
            }
        }
        else {
            var $attrContent = this.$('.attrContent'),
                attrView = new App.AttributeView({model:this.getNewAttrModel()});

            $attrContent.prepend(attrView.render().el);
            this.renderChevrons();
        }
    },
    toggleEditImgBtn: function(e) {
        var eventType = e.type;

        if (!this.model.get('editable')) {
            return;
        }

        var $btn = this.$('#editImgBtn-'+this.model.get('domId')),
            state = $btn.css('visibility');

        if (eventType === "mouseover" && state === "hidden") {
            $btn.css('visibility', 'visible');
        }
        else if (eventType === "mouseout") {
            $btn.css('visibility', 'hidden');
        }
    },
    toggleCardHeaderBtn: function(e) {
        var eventType = e.type,
            $btn = this.$('.card-header-btn'),
            state = $btn.css('visibility');

        if (eventType === "mouseover" && state === "hidden") {
            $btn.css('visibility', 'visible');
        }
        else if (eventType === "mouseout") {
            $btn.css('visibility', 'hidden');
        }
    },
    changeImg: function(e) {
        e.preventDefault();

        var that = this;

        $('#imageChangeTitle').html("Update Image for " +this.$('.card-title').text());
        $('#imageURLInput').val(this.entityView.model.get('imgURL'));

        $('#imageURLSaveBtn').off('click.appspace');
        $('#imageURLSaveBtn').on('click.appspace', function() {
            that.model.set('imgURL', $('#imageURLInput').val());
            that.entityView.model.set('imgURL', $('#imageURLInput').val());
            that.$('#img-'+that.model.get('domId')).attr('src', $('#imageURLInput').val());
        });
    },
    searchIconClick: function(e) {
        var $e = $(e.target);

        if ($e.hasClass('icon-remove')) {
            $e.addClass('icon-search')
              .removeClass('icon-remove');

            this.$('.search-query').val('');
            this.$('.attrContent').html('');

            //re-render stuff CHECK
            _.each(this.attributeCollectionView.render(), function(el) {
                this.$('.attrContent').append(el);
            }, this);
        }
    },
    //this function needs updating
    attrSearch: function(e) {
        console.log('Query Event: ' + query);
        var query = (this.$el.find('.search-query').val());
        if (query !== '') {
            this.$el.find('.searchState')
                .removeClass('icon-search')
                .addClass('icon-remove');
        }
        else {
            this.$el.find('.searchState')
                .removeClass('icon-remove')
                .addClass('icon-search');
        }

        var results = App.Utility.filterCollection(this.attributeCollectionView.collection, query);
        this.$el.find('.attrContent').html('');

        _.each(results, function(m) {
            var mv = new App.AttributeView({model:m});
            this.$el.find('.attrContent').append(mv.render().el);
        }, this);
    },
    attrChange: function(e) {
        console.log('AttrChange Called');

        //this.attributeCollectionView.clean(e.get('tone'));

        var attrs = _.invoke(_.filter(
            this.attributeCollectionView.collection.models,
            function(attr) { return !attr.isNew() }), 'toJSON');

        this.model.updateEntityStats(attrs);

        this.$el.find('.summary').html(this.summaryTemplate(this.model.toJSON()));
        this.renderKonb();

        if (this.renderMode === "renderDetail" && e.changed.entity) {
            this.addNewAttribute(null, e.get('tone'));
        }
    },
    //Misc. Func
    renderChevrons: function() {
        var chevronup = this.$('.up'),
            chevrondown = this.$('.down');
            attrContent= this.$('.attrContent'),
            attrContentHeight = attrContent.children().length*135;

        if (attrContentHeight == 0 || attrContent.scrollTop() == 0) {
            chevronup.hide();
        }
        else {
            chevronup.show();
        }
        if (attrContentHeight == 0 || attrContent.scrollTop() >= attrContentHeight) {
            chevrondown.hide();
        }
        else {
            chevrondown.show();
        }
    },
    renderKonb: function() {
        var knobColor = hslInterpolation(this.model.get('summary').avgScore);

        this.$('.idial').knob({
            'fgColor': knobColor,
            'inputColor': knobColor,
            'thickness': 0.4,
            'angleOffset': -125,
            'angleArc': 250,
            'width': 75,
            'height': 75,
            'readOnly': true,
        });

        this.$('.sdial').attr('style', this.$('.idial').attr('style'));
        this.$('.idial').hide();
    },
    toggleVisibility: function(e, selector) {
        var eventType = e.type;

        if (!this.model.get('editable')) {
            return;
        }

        var $btn = this.$(selector),
            state = $btn.css('visibility');

        if (eventType === "mouseover" && state === "hidden") {
            $btn.css('visibility', 'visible');
        }
        else if (eventType === "mouseout") {
            $btn.css('visibility', 'hidden');
        }
    },
    saveAllAttributes: function() {
        _.each(this.preSaveAttr, function(attrView) {
            attrView.saveAttr();
        });
    },
});

App.TitleRowView = Backbone.View.extend({
    template: _.template(Template.titleRowTemplate),
    tagName: 'tr',
    className: 'row title',
    initialize: function() {
    },
    render: function(title) {
        this.$el.html(this.template({"title": title}));
        return this;
    }
});

App.RankingRowView = App.SummaryCardView.extend({
    template: _.template(Template.rankingRowTemplate),
    tagName: 'tr',
    className: 'row',
    initialize: function() {
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    renderKonb: function() {
        var knobColor = hslInterpolation(this.model.get('summary').avgScore);

        this.$('.idial').knob({
            'fgColor': knobColor,
            'inputColor': knobColor,
            'thickness': 0.4,
            'angleOffset': -125,
            'angleArc': 250,
            'width': 75,
            'height': 75,
            'readOnly': true,
        });

        this.$('.sdial').attr('style', this.$('.idial').attr('style'));
        this.$('.idial').hide();
    },
});

App.TableView = Backbone.View.extend({
    template: _.template(Template.tableTemplate),
    tagName: 'table',
    className: 'rankingTable table',
    events: {
        'click .addNew': 'addNew'
    },
    render: function() {
        this.$el.html(this.template({}));
        return this;
    },
    // Event handler
    addNew: function() {
        console.log('Not implemented');
    }
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
    initialize: function(models, entity) {
        if (entity) {
            _.each(models, function(model) { model['entity'] = entity})
        }
    },
    model: App.EntityAttributeModel,
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
    //Custom Func
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
    url: App.API_VERSION + 'commentlist/',
    model: App.CommentModel,
    parse: function(response) {
        return response.results;
    },
    comparator: function(m) {
        return -m.get('upVote');
    },
});

/*
    App Level Component
*/

//TODO - make other card view extend this
App.GenericCardView = Backbone.View.extend({
});

App.AttributeCollectionView = App.TableView.extend({
    initialize: function(setting) {
        console.log('Attr Collection View');

        if (setting.collection) {
            this.collection = setting.collection;
        }
        else {
            this.collection = new App.AttributeCollection();
        }

        this.entityId = setting.entityId
        this.renderMode = this["render" + capFirstLetter(setting.renderMode || 'default')];
        this.colManager = setting.colManager || App.ColManager;
    },
    // render functions
    render: function(attrContainer) {
        this.attrContainer = attrContainer;
        this.renderMode();
    },
    renderAttribute: function(item) {
        var attrView = new App.AttributeView({
            model: item
        });
        return attrView.render();
    },
    renderDefault: function() {
        var that = this;
        _.each(this.collection.models, function(item) {
            that.attrContainer.append(that.renderAttribute(item).el);}, this);
    },
    renderSearch: function() {
    },
    renderGraph: function() {
    },
    renderDetail: function() {
        // create table
        this.$el.html(this.template({}));

        // add title
        this.el.appendChild(
            new App.TitleRowView().render("Attribute").el);

        // add each attribute
        var that = this;
        _.each(this.collection.models, function(attr) {
            that.el.appendChild(that.renderAttribute(attr));
        });

        // TODO change
        document.getElementById('dr2').appendChild(this.el);
    },
    renderAttribute: function(newAttr) {
        var rowView = new App.AttributeView({
            model: newAttr
        });
        return rowView.render().el;
    },
    // event handler
    addNew: function(e) {
        var newAttr = this.getNewAttrModel();
        this.$el.find('th').parent().after(this.renderAttribute(newAttr));
    },
    // Custom Func
    getNewAttrModel: function(tone) {
        tone = tone ? tone : App.POSITIVE; //default to pos
        var entityId = this.entityId,
            attrModel = new App.EntityAttributeModel({
                entity:entityId,
                editable:true,
                tone:tone});

        this.collection.add(attrModel);
        return attrModel;
    },
});

App.TableCardCollectionView = Backbone.View.extend({
    initialize: function(setting) {
        this.query = setting.query;

        this.collection = new App.SummaryCardCollection();
        this.collection.on('reset', this.render, this);

        this.collection.url += 'search/';
        this.collection.fetch({data: $.param({q: this.query})});
        this.pageType = {'type': "search", 'value': this.query};
    },
    render: function() {
        var that = this,
            rowViews = [],
            tableView = new App.TableView(),
            titleRow = new App.TitleRowView();

        tableView.el.appendChild(titleRow.render("Ranking - " + this.query).el);

        _.each(this.collection.models, function(row) {
            rowViews.push(that.renderRow(row, tableView));
        });

        document.getElementById('top1').appendChild(tableView.el);

        _.each(rowViews, function(rowView) {
            rowView.renderKonb();
        });
    },
    renderRow: function(mRow, tableView) {
        var that = this;
        var rowView = new App.RankingRowView({
            model: mRow
        });
        tableView.el.appendChild(rowView.render().el);
        return rowView;
    }
});

App.CardColView = Backbone.View.extend({
    initialize: function(setting) {
        this._filter = function(e) {
            return true;
        };

        this.collection = new App.SummaryCardCollection();
        this.col = App.ColManager.getCol('card').cols[setting.col];
        this.colInd = setting.col;
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
    search: function(q) {
        App.ColManager.resetCol('card', [this.colInd]);

        if (q.id) {//specific entity
            this.collection.fetch({data: $.param({id: q.id})});
            this.pageType = {'type': 'id', 'value': q.id};
        }
        else if (q.query) {//a search
            this.collection.fetch({data: $.param({q: q.query})});
            this.pageType = {'type': "search", 'value': q.query};
        }
        else {//empty
            this.collection.fetch({data: $.param({q: ''})});
            this.pageType = "empty";
        }
    },
    render: function() {
        var that = this,
            filteredList = _.filter(this.collection.models, this._filter);

        _.each(filteredList, function(item) {
            that.renderSummaryCard(item);
        }, this);
    },
    renderSummaryCard: function(item) {
        var that = this;
        var cardView = new App.SummaryCardView({
            model: item,
            renderMode: 'graph',
            side: this.colInd < 2 ? "left" : "right",
        });

        this.col.append(cardView.render().el);
    },
});

App.PageView = Backbone.View.extend({
    initialize: function(q) {
        this.renderMode = 'default';
        this.collection = new App.SummaryCardCollection();
        this._filter = function(e) {
            return true;
        };

        if (q.id) {//specific entity
            this.collection.url += q.id;
            this.collection.fetch();

            this.pageType = {'type': 'id', 'value': q.id};
            this.renderMode = 'detail';
        }
        else if (q.query) {//a search
            this.collection.url += 'search/';
            new App.TableCardCollectionView({query: q.query})
            //this.collection.fetch({data: $.param({q: q.query})});
            this.pageType = {'type': "search", 'value': q.query};
        }
        else {//empty
            this.collection.fetch({data: $.param({q: ''})});
            this.pageType = "empty";
        }

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

        console.log('In summaryCardCollectionView');

        _.each(filteredList, function(item) {
            that.renderSummaryCard(item, this.renderMode);
        }, this);

        if (!this.collection.models.length) {
            App.ShowTrendyLink();
        }
        else if (this.pageType['type'] === 'id') {
            App.CommentContainer.show();
        }

        if (this.collection.models.length > 3) {
            //show 1 sponsored ad
            var adModel = new App.AdModel({});
            var adView = new App.AdView({model:adModel});
            adModel.fetch();
        }
    },
    renderSummaryCard: function(item, renderMode) {
        console.log("Rendering summaryCard");

        var cardView = new App.SummaryCardView({
            model: item,
            renderMode: renderMode,
            colManager: App.ColManager,
        });


        if (renderMode == "detail") {
            document.getElementById('dr1').appendChild(cardView.render().el);
        }
        else {
            App.ColManager.nextCol('card').append(cardView.render().el);
        }
    },
});

App.GraphView = Backbone.View.extend({
    initialize: function(setting) {
        this.collection = new App.LinkCollection();
        this._filter = function(e) {
            return true;
        };

        this.domContainer = setting.domContainer;
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

App.LinkCollectionView = Backbone.View.extend({
    initialize: function(setting) {
        console.log('Link Collection View');

        if (setting.collection) {
            this.collection = setting.collection;
        }
        else {
            this.collection = new App.LinkCollection();
        }

        this.renderMode = this["render" + capFirstLetter(setting.renderMode || 'default')];
    },
    render: function(domContainer) {
        this.domContainer = domContainer;
        this.renderMode();
    },
    renderLink: function(item) {
        var linkView = new App.LinkView({
            model: item
        });
        return linkView.render();
    },
    renderDefault: function() {
        var that = this;
        _.each(this.collection.models, function(item) {
            that.domContainer.append(that.renderLink(item).el);}, this);
    },
});

App.CommentCollectionView = Backbone.View.extend({
    initialize: function(data) {
        this.collection = new App.CommentCollection();
        this.data = data;

        this.collection.fetch({data: $.param(data)});
        this.collection.on('reset', this.render, this);
    },
    update: function(newCmt) {
        App.ColManager.getCol('cmt').cols[0].prepend(this.renderComment(newCmt).el);
        this.collection.add(newCmt);
    },
    render: function() {
        var that = this;
        this.cmtViews = [];

        _.each(this.collection.models, function(item) {
            that.cmtViews.push(that.renderComment(item));
            App.ColManager.nextCol('cmt').append(that.renderComment(item).el);
        }, this);

        return this;
    },
    renderComment: function(item) {
        var cmtView = new App.CommentView({
            model: item
        });
        return cmtView.render();
    }
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
            if (tags.indexOf(prefix+ui.tagLabel) < 0) {
                var label = ui.tagLabel[0] == prefix ? ui.tagLabel : prefix + ui.tagLabel;
                tags.push(label);
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

App.createNewCard = function() {
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

/*
    Global Objects
*/
App.State = (function() {
    // private

    // public
    return {
    };
})();

App.CommentContainer = $('#commentContainer');
App.LinkBox = $('#linkBox');
App.MessageBox = $('.message-box');

App.AppRouter = Backbone.Router.extend({
    routes: {
        "graph" : "graphPageInit",
        "entity/new" : "newEntityPageInit",
        "entity/:id" : "detailEntityPageInit",
        "" : "defaultPageInit" //handles query
    },
    graphPageInit: function() {
        var that = this;

        this.leftSearch = new App.CardColView({col:0});
        $('#leftSearchBtn').click(function() {
            var q = {};
            q.query = $('#leftSearchForm input').val();
            that.leftSearch.search(q);
        });

        this.rightSearch = new App.CardColView({col:2});
        $('#rightSearchBtn').click(function() {
            var q = {};
            q.query = $('#rightSearchForm input').val();
            that.rightSearch.search(q);
        });

        $('#linkBtn').click(function(e) {
            var newRelation = new App.LinkView({
                model: new App.LinkModel(),
            });
            App.ColManager.getCol("card").cols[1].append(newRelation.render().el);
        });

        $(document).on('graphLinkSet', function(e) {
            var domContainer = App.ColManager.getCol('card').cols[1];
            var graphView = new App.GraphView({domContainer: domContainer});
        });
    },
    detailEntityPageInit: function(id) {
        console.log("detail Entity");
        pageView = new App.PageView({id:parseInt(id)}); //search for particular id
        //cmtCollectionView = new App.CommentCollectionView({entityId:id});

        $('#submitComment').click(function(e) {
            var cmtForm = $('#commentForm'),
                content = cmtForm.find('input[name=content]'),
                btn = $(this);

            if (!content.val()) {
                return;
            }

            btn.button('loading');

            var newComment = new App.CommentModel({});

            newComment.set('content', content.val());
            newComment.set('private', cmtForm.find('input[name=private]').is(':checked'));
            newComment.set('entityId', id);

            newComment.save({}, {
                success: function(response) {
                    content.val('');
                    btn.button('reset');
                    cmtCollectionView.update(response);
                },
                error: function(response) {
                },
            });
        });
    },
    newEntityPageInit: function() {
        console.log("New Entity");

        var stateVar = 0,
            cardRef  = App.createNewCard(),
            saveCancelBtn = _.template(Template.saveCancelBtnTemplate);

        $('#dr1').append(saveCancelBtn({
            'id': 'saveCancelContainer',
            'saveId': 'saveAndNext',
            'cancelId': 'cancelAndNext'
        }));

        // step 1
        $("#saveAndNext").click(function(e) {
            switch (stateVar) {
                case 0:
                    stateVar = -1; // hacky way to disabel btn
                    cardRef.saveCreation();
                    cardRef.addNewAttribute();

                    $('#dr2').removeClass('hidden');

                    var dom = $('#saveCancelContainer').detach();
                    $('#dr2').append(dom);

                    stateVar = 1;
                    break;
                case 1:
                    stateVar = -1;

                    cardRef.saveAllAttributes();
                    $('#dr3').removeClass('hidden');

                    var dom = $('#saveCancelContainer').detach();
                    $('#dr3').append(dom);

                    stateVar = 2;
                    break;
                case 2:
                    // get ref and finalize
                    // finish
                    break;
            }
        });

        // step 2
        $("#step2Fin").click(function(e) {
        });

        $("#step2Fin").click(function(e) {
        });
    },
    queryPageInit: function(query) {
        console.log("QQQQ");
    },
    defaultPageInit: function() {
        console.log("Default Route");

        $('#addNewEntity').click(function(e) {
            // hide message box
            $('.message-box').slideUp();

            // intentionally global??
            newCard = new App.SummaryCardView({model: new App.SummaryCardModel({})});
            App.ColManager.nextCol('card').prepend(newCard.render().$el);

            // manually activate edit mode
            newCard.model.set('editable',true);
            newCard.render(true);
        });

        var query = $('#searchInput').val();

        if (query) {
            pageView = new App.PageView({query:query});
        }
    }
});

var appRouter = new App.AppRouter;
Backbone.history.start({pushState: true});
