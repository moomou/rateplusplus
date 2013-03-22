function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var App = App || {};

App.API_VERSION = 'api/v0/';

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
    defaults: {
        domId: undefined,
    	id: undefined,
        name: 'New Entity',
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
        this.delegateEvents(); //shouldn't have to call this explicitly but some weird coupling between summaryview and this
        return this;
    },
    initialize: function() {
    },
    //Event Handler
    editProfile: function(e) {
        e.preventDefault();

        console.log('Editing Box');
        if (!this.model.get('editable')) {
            return;
        }

        var editBoxMenuId = 'editBoxMenu-' + this.model.get('domId');
        var editBoxId = 'editBox-' + this.model.get('domId');
        var $e = $(e.target);
        var $p = this.$('.description');
        var $textarea = this.$('#'+editBoxId);

        if ($e.text() == "Edit") {
            $textarea.html($p.html());

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
            $e.text('Save');
            this.$('.cancelBtn').show();
        }
        else if ($e.text() == "Save") {
            var editor = nicEditors.findEditor(editBoxId);
            var newTxt = editor.getContent();

            this.model.set('description',newTxt);

            $p.html(newTxt);

            this.editBox.removeInstance(editBoxId);
            $textarea.hide();

            $p.show();

            $e.text('Edit');
            this.$('.cancelBtn').hide();
            this.model.save();
        }
        else { //Cancel
            var editor = nicEditors.findEditor(editBoxId);
            $p.html(this.model.get('description'));

            this.editBox.removeInstance(editBoxId);
            $textarea.hide();

            $p.show();

            this.$('.editBtn').text('Edit');
            $e.hide();
        }
    },
});

App.AttributeModel = Backbone.Model.extend({
    urlRoot: App.API_VERSION + 'attribute/',
    defaults: {
    	id: undefined,
        entity: undefined,
        name: 'New Attribute',
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
    },
    parse: function(response) {
        return response;
    },
    //Custom Func
    getRating: function() {
        var rating = this.get('upVote')/(this.get('voteCount') || 1);
        rating = this.get('voteCount') ? (rating*100).toFixed(2).toString() : 0; 
        return rating;
    },
    enqueuVote: function(voteType, view) {
        var that = this;

        this.set('voted', true);

        if (this.isNew()) {
            this.set('editable', false);
            that.updateVoteCount(voteType, view);

            this.save({}, {
                success: function(model, response) {
                },
            });
            return;
        }

        $.ajax({
            type: "POST",
            url: this.url() + "/vote/",
            data: { voteType: voteType},
        })
        .done(function(res) {
            if (!res.error) {
                that.updateVoteCount(voteType, view);
            }
        })
        .fail(function(msg) {
        });
    },
    updateVoteCount: function(voteType, view) {
        this.set('voteCount', this.get('voteCount')+1); 

        if (voteType=="+") {
            this.set('upVote', this.get('upVote')+1);
        }
        else {
            this.set('downVote', this.get('downVote')+1);
        }

        var rating = this.getRating();
        this.set('rating', rating);
        this.set('upVotePer100', Math.round(rating));
        this.set('downVotePer100', Math.round(100 - rating));

        view.render();
    },
});

App.AttributeView = Backbone.View.extend({
    template: _.template(Template.attributeTemplate),
    tagName: 'div',
    className: 'page-curl editHighlight',
    events: {
        'click .voteBtn': 'attrVote',
        'click .attrName': 'editName',
        'click .attrSaveBtn': 'saveAttr',
        'click .attrCloseBtn': 'removeAttr',
    },
    initialize: function() {
        var that = this;
        this.model.on('sync', function(e) {
            that.model.set('editable', false);
            that.render();
        });
    },
    render: function() {
        console.log('AttributeView Render');
        this.$el.html(this.template(this.model.toJSON()));

        if (!this.model.isNew()) {
            this.$el.removeClass('editHighlight');
        }
        if (this.model.get('voted')) {
            this.$('.voteBtns').slideToggle();
        }

        return this;
    },
     //Event Handler
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
            $.extend(this.attributes, newEntity.toJSON());

            this.set('summary', this.getEntityStats(this.get('attributes')));
            this.set('entityView', this.getEntityView(newEntity)); 
            this.set('attributeViews', this.getAttributesView({}));
        }

        this.on('entityModelUpdated', this.updateSummaryCard);
    },
	validate: function(attribs) {
	},
    parse: function(response) {
        console.log("SummaryCardModel Parse");
        response['tagDOM'] = this.getTags(response['tags']); 
        response['summary'] = this.getEntityStats(response['attributes']); 
        response['entityView'] = this.getEntityView(new App.EntityModel(response)); 
        response['attributeViews'] = this.getAttributesView(response['attributes']);

        return response;
    },
    //event handler
    updateSummaryCard: function() {
        console.log('Calling SummaryModel update');
        var entityModel = this.get('entityView').model;
        this.set('tagDOM', this.getTags(entityModel.get('tags')));
        this.set('summary', this.getEntityStats(entityModel.get('attributes')));
    },
    //Custom Functions
    getTags: function(tags) {
        var tagEmblems = '';
        _.each(tags, function(tag) {
            tagEmblems += '<li>'+tag+'</li>';
        });
        return tagEmblems;
    },
    getEntityView: function(entityModel) {
        return new App.EntityView({model: entityModel}); 
    },
    getAttributesView: function(attrModel) {
        return new App.AttributeCollectionView(attrModel);
    },
    updateEntityStats: function(attrs) {
        console.log('updateEntityStats called!!');
        $.extend(this.get('summary'), this.getEntityStats(attrs));
    },
    getEntityStats: function(attrs) {
        var attrLength = attrs ? attrs.length : 0;
        var totalVote = 0;
        var avgScore = 0;

        _.each(attrs, function(attr) {
            totalVote += attr['voteCount'];
        });

        if (totalVote !== 0) {
            _.each(attrs, function(attr) {
                var attrScore = attr['upVote']/(attr['voteCount'] || 1);  //divide by totalCount unless 0
                avgScore += attrScore * (attr['voteCount']/(totalVote || 1));
            });
        }

        avgScore *= 100;

        return {
            'totalVote': totalVote,
            'avgScore': avgScore ? avgScore.toFixed(0).toString() : '-',
            'totalAttribute': attrLength,
        };
    },
});

App.SummaryCardView = Backbone.View.extend({
	template: _.template(Template.summaryCardTemplate),
    summaryTemplate: _.template(Template.summaryTemplate),
	events: {
        'click .closeBtn': 'cancelCreation',
        'click .saveBtn': 'saveCreation',
        'click .card-title': 'updateName', //title
        'click .searchState': 'searchIconClick',
        'click .addAttrBtn': 'addAttr',
        'click .editImgBtn': 'changeImg',
        'keypress .search-query': 'attrSearch',
        'mouseover .photo': 'toggleEditImgBtn',
        'mouseout .photo': 'toggleEditImgBtn',
	},
    //Builtin Func
    initialize: function() {
		console.log("App.SummaryCardView initialize");
        this.listenTo(this.model.get('attributeViews').collection, 'change', this.attrChange);
	},
	render: function(event) {
		console.log("App.SummaryCardView Render");

        var editable = this.model.get('editable');
        var domId = this.model.get('domId');
        var entityModel = this.model.toJSON(); 

		this.$el.html(this.template(entityModel));
        
        //Hide details that require model to be saved first
        if (this.model.get('entityView').model.isNew()) {
            this.$('.card').addClass('editHighlight');
            this.$('.entityDetail').hide();
        }

        //render sub views
        this.$('.profileContent').empty().append(this.model.get('entityView').render().el);

        _.each(this.model.get('attributeViews').render(), function(el) {
            this.$('.attrContent').append(el);
        }, this);
        
        var that = this;
        this.$('#tags-'+domId).tagit({
            beforeTagAdded: function(event, ui) {
            },
            afterTagAdded: function(event, ui) {
                var tags = that.model.get('entityView').model.get('tags');

                if (tags.indexOf(ui.tagLabel) < 0) {
                    tags.push(ui.tagLabel);
                    console.log(tags);
                }
            },
            beforeTagRemoved: function(event, ui) {
            },
            afterTagRemoved: function(event, ui) {
                var tags = that.model.get('entityView').model.get('tags');
                var ind = tags.indexOf(ui.tag);
                tags.splice(ind, 1);
                console.log(tags);
            },
            readOnly: !editable,
            onTagClicked: function(event, ui) {
                $('#searchInput').val(ui.tagLabel);
                $('#searchForm').submit();
            },
        });

        if (!editable) {
            this.$('#tags-'+domId).find('input').css('display','none');
        }
        else {
            this.$('#tags-'+domId).find('input').css('display', '');
            this.$('#tags-'+domId).find('input').attr('placeholder', 'Add New Tag');
        }

		return this;
	},

    //Event Handler
    saveCreation: function(e) {
        var that = this;
        this.$('.card-status').html('<i class="icon-spinner icon-spin icon-2x pull-left"></i>');
        this.model.get('entityView').model.save({}, {
            success: function(model, response) {
                //update summary 
                $.extend(that.model.attributes, response);
                that.model.trigger('entityModelUpdated');

                //UI update
                that.model.set('editable', false);
                that.render();

                /*
                if (!model.attributes.length) {
                    that.$('.addAttrBtn').click();
                }
                else {
                }

                that.$('.entityDetail').slideDown('slow');
                */
            },
        });
    },
    cancelCreation: function(e) {
        if(confirm("Are you sure you want to delete this entry? It will be gone forever!")) {
            this.remove();
            this.model.destroy();
        }
    },
    updateName: function(e) {
        if (this.model.get('editable')) {
            var domRef = this.$('.card-title');
            var that = this;

            domRef.attr('contenteditable', true);
            domRef.focus();

            console.log(domRef.text());
            domRef.focusout(function() {
                that.model.set('name', domRef.text());
                that.model.get('entityView').model.set('name', domRef.text());
                console.log(domRef.text());
            });
        }
    },
    addAttr: function(e) {
        e.preventDefault();

        var entityId = this.model.get('entityView').model.get('id');

        if (!entityId) {
            console.log('need to save entity before adding attribute');
        }
        var $attrContent = this.$('.attrContent');

        var attrModel = new App.AttributeModel({entity:entityId, editable:true}); 
        this.model.get('attributeViews').collection.add(attrModel);

        var attrView = new App.AttributeView({model:attrModel}); 
        $attrContent.prepend(attrView.render().el);
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
    changeImg: function(e) {
        e.preventDefault();

        var that = this;
        
        $('#imageChangeTitle').html("Update Image for " +this.$('.card-title').text());
        $('#imageURLInput').val(this.model.get('entityView').model.get('imageURL'));

        $('#imageURLSaveBtn').off('click.appspace');
        $('#imageURLSaveBtn').on('click.appspace', function() {
            that.model.set('imageURL', $('#imageURLInput').val());
            that.model.get('entityView').model.set('imageURL', $('#imageURLInput').val());
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

            //re-render stuff
            _.each(this.model.get('attributeViews').render(), function(el) {
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

        var results = App.Utility.filterCollection(this.model.get('attributeViews').collection, query);
        this.$el.find('.attrContent').html('');

        _.each(results, function(m) {
            var mv = new App.AttributeView({model:m});
            this.$el.find('.attrContent').append(mv.render().el);
        }, this);
    },
    attrChange: function() {
        var tmp = [];
        var summary = this.$el.find('.summary');

        _.each(this.model.get('attributeViews').collection.models, function(m) {
            tmp.push(m.toJSON());
        });

        this.model.updateEntityStats(tmp); 
        this.$el.find('.summary').html(this.summaryTemplate(this.model.toJSON()));
    },
});

/*
    Collections
*/
App.AttributeCollection = Backbone.Collection.extend({
    model: App.AttributeModel,
    comparator: function(m) {
        return -m.get('voteCount');
    },
});

App.AttributeCollectionView = Backbone.View.extend({
    initialize: function(data) {
        console.log('Attr Collection View');
        if (!$.isEmptyObject(data)) {
            this.collection = new App.AttributeCollection(data);
        }
        else {
            this.collection = new App.AttributeCollection();
        }

        this.collection.on("reset", this.render, this);
        this.collection.on("add", this.render, this);
    },
    render: function() {
        var that = this,
            els = [];

        _.each(this.collection.models, function(item) {
            els.push(that.renderAttribute(item));
        }, this);
        return els;
    },
    renderAttribute: function(item) {
        var attrView = new App.AttributeView({
            model: item
        });
        return attrView.render().el;
    }
});

App.SummaryCardCollection = Backbone.Collection.extend({
	url: App.API_VERSION + 'entity/', 
    model: App.SummaryCardModel,
    comparator: function(m) {
        return -m.get('summary').totalVote;
    },
});

App.SummaryCardCollectionView = Backbone.View.extend({
    initialize: function(setting) {

        if (setting.query) {
            this.collection = new App.SummaryCardCollection();
            this.collection.fetch({data: $.param({q: setting.query})});
        }
        else {
    	    this.collection = new App.SummaryCardCollection();
            this.collection.fetch({data: $.param({q: ''})});
        }

        this.collection.on("reset", this.render, this);
    },
    render: function() {
        var that = this;
        console.log('In summaryCardCollectionView');

        _.each(this.collection.models, function(item) {
            that.renderSummaryCard(item);
        }, this);

        if (!this.collection.models.length) {
            App.ShowTrendyLink();
        }
        else if (this.collection.models.length > 3) {
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
        App.NextCol().append(cardView.render().el);
    }
});

/*
    Add Ad
*/

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

App.Cols = [$('#col1'), $('#col2'), $('#col3')];
App.CurrentColIndex = 0; //index to current col
App.NextCol = function() {
	var nextCol = App.Cols[App.CurrentColIndex];
	App.CurrentColIndex = (App.CurrentColIndex+1)%App.Cols.length;
	return nextCol;
}
App.LastCol = function() {
    return App.Cols[App.Cols.length-1];
}

App.LinkBox = $('#linkBox');
App.MessageBox = $('.message-box');

App.ShowTrendyLink = function() {
    $.ajax({
        'url': App.API_VERSION+'tags/',
        'type': 'POST'
    })
    .done(function(tags) {
        var aTags = "";
        for (var ind in tags) {
            aTags += "<a href='/?q="+encodeURIComponent(tags[ind])+"'>"+tags[ind]+"</a> ";
        }
        App.MessageBox.fadeToggle();
        App.LinkBox.html(aTags);
    });
}
