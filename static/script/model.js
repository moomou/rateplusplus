var App = App || {};

/*
    Constants for App
*/
App.API_VERSION = '/api/v0/';
App.AE_H_URL = App.API_VERSION + 'ae/tag';
App.AE_C_URL = App.API_VERSION + 'ae/cat';

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
	urlRoot: App.API_VERSION + 'entity/',
    /*url: function() {
        return window.location.origin + "/" + this.urlRoot + (this.id ? this.id : "");
    },*/
    defaults: {
        domId: undefined,
    	id: undefined,
        name: 'New Entity',
        private: false,
        imageURL: '',
        description: 'Add Short Description',
        tags: [],
        tagDOM: '', 
        version: 0,
        attributes: undefined,
        editable: true 
    },
    validate: function(attrs) {
	},
    initialize: function() {
        this.set('domId', guidGenerator());
    },
});

App.EntityView = Backbone.View.extend({
    tagName: "div",
    className: "inner",
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

        if (mode == "edit") {
            wideArea('#'+editBoxContainer);
            var $textarea = $textAreaContainer.find("textarea");
            $textarea.text(($p.html()));

            /*
            this.editBox = new nicEditor({buttonList : [
                                             'fontSize',
                                             'bold',
                                             'italic',
                                             'image',
                                             'left',
                                             'center',
                                             'link']
                                             })
                .panelInstance(editBoxId);
            /*
            this.editBox.setPanel(editBoxMenuId);
            this.editBox.addInstance(editBoxId);
            */

            $p.hide(); 
            $textAreaContainer.show();
        }
        else if (mode == "save") {
            //var editor = nicEditors.findEditor(editBoxId);
            //var newTxt = editor.getContent();
            var $textarea = $textAreaContainer.find("textarea");
            var newTxt = $textarea.val();

            this.model.set('description', newTxt);
            $p.html(newTxt);

            //this.editBox.removeInstance(editBoxId);
            $textAreaContainer.hide();
            $p.show();
        }
        else { //Cancel
            $p.html(this.model.get('description'));
            //this.editBox.removeInstance(editBoxId);
            $textAreaContainer.hide();
            $p.show();
        }
    },
});

App.AttributeModel = Backbone.Model.extend({
    urlRoot: App.API_VERSION + 'attribute/',
    defaults: {
    	id: undefined,
        entity: undefined,
        name: 'New Attribute',
        tone: 1, //defaults to +,
        upVote: 0,
        downVote: 0,
        voteCount: 0,
        editable: false, 
        voted: false,
    },
    //Builtin Function
    initialize: function() {
        var rating = this.getRating();  
        var that = this;

        this.set('rating', rating);
        this.set('upVotePer100', rating);

        if (!rating) {
            this.set('downVotePer100', 0);
        }
        else {
            this.set('downVotePer100', 100 - rating);
        }

        if (this.get('tone') < 0) {
            this.set('TONE_ICON', 'black-heart');
            this.set('TONE', 'Negative');
        }
        else {
            this.set('TONE_ICON', 'red-heart');
            this.set('TONE', 'Positive');
        }

        this.on('change:tone', function(e) {
            if (this.get('tone') < 0 ) {
                this.set('TONE_ICON', 'black-heart');
            }
            else {
                this.set('TONE_ICON', 'red-heart');
            }
        });
    },
    parse: function(response) {
        return response;
    },
    //Custom Func
    getRating: function() {
        var rating = this.get('upVote')/(this.get('voteCount') || 1);
        rating = this.get('voteCount') ? (rating*100).toFixed(0) : 0; 
        return rating;
    },
    enqueuVote: function(voteType, view) {
        var that = this;
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
            url: this.url() + "/vote/",
            data: {voteType: voteType},
        })
        .done(function(res) {
            if (!res.error) {
                that.updateVoteCount(voteType, view);
                that.fetch();
            }
        })
        .fail(function(msg) {
        });
    },
    updateVoteCount: function(voteType, view) {
        this.set('voteCount', this.get('voteCount')+1); 

        if (voteType === "+") {
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
    template: _.template(Template.attributeTemplate),
    tagName: 'div',
    className: 'page-curl editHighlight outer',
    events: {
        'click .menu': 'menuHandler',
        'click .tone': 'toneChange',
        'click .voteBtn': 'attrVote',
        'click .attrName': 'editName',
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

        this.$el.html(this.template(this.model.toJSON()));

        if (!this.model.isNew()) {
            this.$el.removeClass('editHighlight focusOnHover');
            this.$el.find('.close').hide();//hide save and del btn
        }
        else {
            this.$el.find('.menu').hide(); //hide report btn
        }

        if (this.model.get('voted')) {
            this.$('.voteBtns').hide();
            this.$('.progress').fadeToggle();
        }

        return this;
    },
     //Event Handler
    menuHandler: function(e) {
    },
    toneChange: function(e) {
        if (!this.model.get('editable')) {
            return;
        }

        var $i = this.$('.tone').find('i');

        if ($i.hasClass('black-heart')) {
            $i.removeClass('black-heart');
            $i.addClass('red-heart');
            this.model.set('tone', 1);
        }
        else {
            $i.removeClass('red-heart');
            $i.addClass('black-heart');
            this.model.set('tone', -1);
        }

        this.model.set('editable', true);
        this.render();
    },
    attrVote: function(e) {
        e.preventDefault();
        console.log('attrVote called:');

        if ($(e.target).hasClass('upVote')) {
            this.model.enqueuVote('+', this);
        }
        else {
            this.model.enqueuVote('-', this);
        }
    },
    editName: function(e) {
        console.log('editName called');
        if (this.model.get('editable')) {
            var domRef = this.$('.attrName');
            var that = this;

            domRef.attr('contenteditable', true);
            domRef.focus();

            domRef.focusout(function() {
                that.model.set('name', domRef.text());
                console.log(domRef.text());
            });
        }
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
            voteType = "+",
            that = this;

        if (this.voted) {
            return;
        }

        this.voted = true;
        
        if (btn.hasClass('cmtDownVote')) {
            voteType = "-";
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
        debugger;
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
        this.set('domId', guidGenerator());

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
        var newEntity = new App.EntityModel(response);

        response['hashTags'] = tags['hashTags'];
        response['catTags'] = tags['catTags'];

        response['summary'] = this.getEntityStats(response['attributes']); 
        response['entityModel'] = newEntity;
        response['attributeCollection'] = new App.AttributeCollection(response['attributes']);

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
        console.log('updateEntityStats called!!');
        $.extend(this.get('summary'), this.getEntityStats(attrs));
    },
    getEntityStats: function(attrs) {
        var attrLength = attrs ? attrs.length : 0,
            posAttr = 0, 
            negAttr = 0,
            totalVote = 0,
            avgScore = 0,
            upVote = 0;

        _.each(attrs, function(attr) {
            totalVote += attr['voteCount'];
        });

        if (totalVote !== 0) {
            _.each(attrs, function(attr) {
                var attrScore = attr['upVote']/(attr['voteCount'] || 1);  //divide by totalCount unless 0
                avgScore += attrScore * (attr['voteCount']/(totalVote || 1)) * (attr['tone'] < 0 ? -1 : 1) ;

                upVote += attr['upVote'];
                if (attr['tone']) {
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
    className: 'card', 
	template: _.template(Template.summaryCardTemplate, null, {variable: 'obj'}),
    summaryTemplate: _.template(Template.summaryTemplate, null, {variable: 'obj'}),
	events: {
        'click .addAttrBtn': 'addNewAttribute',
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
            collection: this.model.get('attributeCollection'),
            renderMode: setting.renderMode,
            colManager: setting.colManager});
                
        this.side = setting.side;
        this.listenTo(this.model.get('attributeCollection'), 'sync', this.attrChange);
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
        this.attributeCollectionView.clean(); //remove extra 

        var that = this,
            hashTagsUL = this.$('#hashtags-'+domId),
            catTagsUL = this.$('#cattags-'+domId); 

        if (editing) {
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

            hashTagsUL.find('input').css('display', '')
                                    .attr('placeholder', 'Add New Hash Tag');
            catTagsUL.find('input').css('display', '')
                                    .attr('placeholder', 'Add New Category Tag');
            if (!isNew) {
                this.$('.closeBtn').hide();
            }
        }

        if (this.renderMode === "renderDefault") {
            this.$('.attrContainer').hide();
        }
        else {
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
        this.$('.attrContainer').hide();
        this.attributeCollectionView.render(this.$('.attrContent'));
        this.addNewAttribute();
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
        else {
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

        if (this.renderMode === "renderDetail") {
            //add extra attr to each col
            if (!modifiedAttrTone || modifiedAttrTone == 1) {
                var attrView = new App.AttributeView({model:this.getNewAttrModel()}); 
                attrView.$el.addClass('focusOnHover');

                App.ColManager.addAttribute(attrView.render().el, 1); //pos
            }
            if (!modifiedAttrTone || modifiedAttrTone == -1) {
                var attrView = new App.AttributeView({model:this.getNewAttrModel(-1)}); 
                attrView.$el.addClass('focusOnHover');
                App.ColManager.addAttribute(attrView.render().el, -1); //neg
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
        $('#imageURLInput').val(this.entityView.model.get('imageURL'));

        $('#imageURLSaveBtn').off('click.appspace');
        $('#imageURLSaveBtn').on('click.appspace', function() {
            that.model.set('imageURL', $('#imageURLInput').val());
            that.entityView.model.set('imageURL', $('#imageURLInput').val());
            that.$('#img-'+that.model.get('domId')).attr('src', $('#imageURLInput').val());
        });
    },
    searchIconClick: function(e) {
        var $e = $(e.target); 
        console.log($e);
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

        this.attributeCollectionView.clean(e.get('tone'));

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
    getNewAttrModel: function(tone) {
        tone = tone ? tone : 1; //default to pos
        var entityId = this.entityView.model.get('id');

        if (!entityId) {
            console.log('need to save entity before adding attribute');
            return;
        }

        var attrModel = new App.AttributeModel({entity:entityId, editable:true, tone:tone}); 
        this.attributeCollectionView.collection.add(attrModel);

        return attrModel;
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


App.AttributeCollection = Backbone.Collection.extend({
    model: App.AttributeModel,
    comparator: function(m) {
        return -m.get('voteCount');
    },
});

App.AttributeCollectionView = Backbone.View.extend({
    initialize: function(setting) {
        console.log('Attr Collection View');

        if (setting.collection) {
            this.collection = setting.collection;
        }
        else {
            this.collection = new App.AttributeCollection();
        }

        this.renderMode = this["render" + capFirstLetter(setting.renderMode || 'default')]; 
        this.colMaanager = setting.colManager || App.ColManager;
    },
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
        var that = this;

        this.colManager.resetCol('card',[1,2]);

        _.each(this.collection.models, function(attr) {
            var attr = that.renderAttribute(item);
            this.colManager.addAttribute(attr.el, attr.model.get('tone'));}, this);
    },
    //Custom Func
    clean: function(tone) {
        var toRemove = [];
        _.each(this.collection.models, function(model) {
            if (model.isNew()) {
                if (tone === undefined || tone === model.get('tone')) {
                    toRemove.push(model);
                }
            }
        }, this);

        this.collection.remove(toRemove);
    },
});

App.SummaryCardCollection = Backbone.Collection.extend({
	url: App.API_VERSION + 'entitylist/', 
    model: App.SummaryCardModel,
    comparator: function(m) {
        return -m.get('summary').totalVote;
    },
    parse: function(response) {
        return response.results;
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

//App Level Component
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
        debugger;
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

App.PageView = Backbone.View.extend({
    initialize: function(q) {
        this.collection = new App.SummaryCardCollection();
        this._filter = function(e) {
            return true;
        };

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
            that.renderSummaryCard(item);
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
    renderSummaryCard: function(item) {
        var cardView = new App.SummaryCardView({
            model: item
        });

        App.ColManager.nextCol('card').append(cardView.render().el);
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
            var ind = tone == 1 ? 1 : 2; //pos on col1 neg on col2
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

/*
    Global Objects
*/
App.CommentContainer = $('#commentContainer');
App.LinkBox = $('#linkBox');
App.MessageBox = $('.message-box');

App.AppRouter = Backbone.Router.extend({
    routes: {
        "graph" : "graphEditorInit",
        "" : "defaultRoute"
    },
    graphEditorInit: function() {
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
    defaultRoute: function() {
    }
});

var appRouter = new App.AppRouter;
Backbone.history.start({pushState: true});
