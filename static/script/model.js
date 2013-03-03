function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var App = App || {};

App.API_VERSION = 'api/v0/';

App.EntityModel = Backbone.Model.extend({
	urlRoot: App.API_VERSION + 'entity/',
    defaults: {
        domId: undefined,
    	id: undefined,
        name: 'Add a New Name',
        imageURL: '',
        description: 'Add Short Description',
        tags: [],
        tagDOM: '', 
        attributes: undefined,
        editable: false
    },
    validate: function(attrs) {
	},
    initialize: function() {
        this.set('domId', guidGenerator());
        this.on('tagChange', function() {
            this.save();
        });
        this.on('change:description change:name change:imageURL', function() {
            this.save(); //save to server
        });
    },
    parse: function(response) {
        return response; 
    }
});

App.EntityView = Backbone.View.extend({
    tagName: "div",
    className: "inner",
    events: {
        'click .editProfileBtn': 'editProfile',
    },
    template: _.template(Template.entityTemplate),

   //Builtin Function
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    initialize: function() {
    },
    //Event Handler
    editProfile: function(e) {
        e.preventDefault();

        if (!this.model.get('editable')) {
            return;
        }

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
                                             'underline',
                                             'image',
                                             'left',
                                             'center',
                                             'link']
                                             })
                .panelInstance(editBoxId);

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
    },
    //Builtin Function
    initialize: function() {
        var rating = this.getRating();  

        this.set('rating', rating);
        this.set('upVotePer100', rating);
        this.set('downVotePer100', 100 - rating);

        //set events
        this.on('change:name', function() {
            //save to server
            this.save();
        });
    },
    parse: function(response) {
        return response;
    },

    //Custom Func
    getRating: function() {
        var rating = this.get('upVote')/(this.get('voteCount') || 1);
        rating = this.get('voteCount') ? (rating*100).toFixed(2).toString() : 'N/A';
        return rating;
    },
    enqueuVote: function(voteType, callback) {
        if (this.isNew()) {
            this.save();
            return;
        }

        var that = this;

        $.ajax({
            type: "POST",
            url: this.url() + "/vote/",
            data: { voteType: voteType},
        })
        .done(function(msg) {
            if (msg.result == "ok") {
                if (voteType=="+") {
                    that.set('upVote', that.get('upVote')+1);
                }
                else {
                    that.set('downVote', that.get('downVote')+1);
                }

                var rating = that.getRating();

                that.set('voteCount', that.get('voteCount')+1); 
                that.set('rating', rating);
                that.set('upVotePer100', rating);
                that.set('downVotePer100', 100 - rating);

                callback();
            }
        })
        .fail(function(msg) {
        });
    },
});

App.AttributeView = Backbone.View.extend({
    template: _.template(Template.attributeTemplate),
    events: {
        'click .voteBtn': 'attrVote',
        'click .attrName': 'editName',
        'click .close': 'removeAttr',
    },
    //Builtin Func
    render: function() {
        console.log('AttributeView Render');
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },
    initialize: function() {
        //attach up and down vote event
    },
    //Event Handler
    attrVote: function(e) {
        e.preventDefault();
        console.log('attrVote called:');

        if ($(e.target).hasClass('upVote')) {
            //this.model.set('upVote', this.model.get('upVote')+1);
            this.model.enqueuVote('+', this.render);
            this.$('.voteBtns').toggle();
        }
        else {
            //this.model.set('downVote', this.model.get('downVote')+1);
            this.model.enqueuVote('+', this.render);
            this.$('.voteBtns').toggle();
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
        console.log('initializing...');
        
        this.set('domId', guidGenerator());

        if (!this.get('id')) { //new card
            this.set('editable', true);

            var newEntity = new App.EntityModel({editable: this.get('editable')});

            $.extend(this.attributes, newEntity.toJSON());

            this.set('summary', this.getEntityStats(this.get('attributes')));
            this.set('entityView', this.getEntityView(newEntity)); 
            this.set('attributeViews', this.getAttributesView({}));
        }
    },
	validate: function(attribs) {
	},
    parse: function(response) {
        console.log("SummaryCardModel Parse");

        var tagEmblems = '';
        _.each(response['tags'], function(tag) {
            tagEmblems += $('<li/>', {class:'', html: tag})[0].outerHTML + " ";
        });

        response['tagDOM'] = tagEmblems; 
        response['summary'] = this.getEntityStats(response['attributes']); 
        response['entityView'] = this.getEntityView(new App.EntityModel(response)); 
        response['attributeViews'] = this.getAttributesView(response['attributes']);

        return response;
    },
    //Custom Functions
    getEntityView: function(entityModel) {
        return new App.EntityView({model: entityModel}); //.render().el.outerHTML;
    },
    getAttributesView: function(attrModel) {
        return new App.AttributeCollectionView(attrModel);//.render();
    },
    updateEntityStats: function(attrs) {
        console.log('updateEntityStats called!!');
        $.extend(this.get('summary'), this.getEntityStats(attrs));
    },
    getEntityStats: function(attrs) {
        var attrLength = attrs ? attrs.length : 0;
        var totalVote = 0;
        var avgScore = 0;

        console.log(attrs);

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

    //Event Handler
    test: function() {
        console.log('...');
    }
});

App.SummaryCardView = Backbone.View.extend({
	template: _.template(Template.summaryCardTemplate),
    summaryTemplate: _.template(Template.summaryTemplate),
	events: {
        'click .closeBtn': 'cancelCreation',
        'click .card-title': 'updateName', //title
        'click .searchState': 'searchIconClick',
        'click .addAttrBtn': 'addAttr',
        'click .imgBtn': 'changeImg',
        'keypress .search-query': 'attrSearch',
        'focus .search-query': 'attrSearchFocus',
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
        
        //render sub views
        this.$('.profileContent').html(this.model.get('entityView').render().el);
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
                    that.model.get('entityView').model.trigger('tagChange');
                }
            },
            beforeTagRemoved: function(event, ui) {
                
            },
            afterTagRemoved: function(event, ui) {
                var tags = that.model.get('entityView').model.get('tags');
                var ind = tags.indexOf(ui.tag);
                tags.splice(ind, 1);
                console.log(tags);
                that.model.get('entityView').model.trigger('tagChange');
            },
            readOnly: !editable,
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
    cancelCreation: function() {
        if(confirm("Are you sure you want to delete this entry? It will be gone forever!")) {
            this.remove();
            this.model.destroy();
        }
    },
    updateName: function() {
        if (this.model.get('editable')) {
            var domRef = this.$('.card-title');
            var that = this;

            domRef.attr('contenteditable', true);
            domRef.focus();

            console.log(domRef.text());
            domRef.focusout(function() {
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
        var attrView = new App.AttributeView({model:attrModel}); 

        $attrContent.prepend(attrView.render().el);
    },
    toggleEditImgBtn: function(e) {
        var eventType = e.type;

        var $btn = this.$('#imgBtn-'+this.model.get('domId')),
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

        $('#imageChangeTitle').html("Update Image for " +this.model.get('name'));
        $('#imageURLInput').val(this.model.get('entityView').model.get('imageURL'));

        $('#imageURLSaveBtn').off('click.appspace');
        $('#imageURLSaveBtn').on('click.appspace', function() {
            that.model.get('entityView').model.set('imageURL', $('#imageURLInput').val());
            that.$('#img-'+that.model.get('domId')).attr('src', $('#imageURLInput').val());
        });
    },
    attrSearchFocus: function(e) {
        e.preventDefault();
    },
    attrSearchCancel: function(e) {
        e.preventDefault();
    },
    searchIconClick: function(e) {
        var $e = $(e.target); 
        console.log($e);
        if ($e.hasClass('icon-remove')) {
            $e.addClass('icon-search')
              .removeClass('icon-remove');

            this.$('.search-query').val('');
            this.$('.attrContent').html('');

            //rerender stuff
            _.each(this.model.get('attributeViews').render(), function(el) {
                this.$('.attrContent').append(el);
            }, this);
        }
    },
    attrSearch: function(e) {
        var query = (this.$el.find('.search-query').val());
        console.log('Query Event: ' + query);
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

        console.log(results);
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

//Collections
App.AttributeCollection = Backbone.Collection.extend({
    model: App.AttributeModel
});

App.AttributeCollectionView = Backbone.View.extend({
    initialize: function(data) {
        console.log('Attr Collection View');
        this.collection = new App.AttributeCollection(data);
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
    model: App.SummaryCardModel
});

App.SummaryCardCollectionView = Backbone.View.extend({
    initialize: function(data, query) {
        if (query) {
            this.collection = new App.SummaryCardCollection();
            this.collection.fetch({data: $.param({q: query})});
        }
        else {
    	    this.collection = new App.SummaryCardCollection();
            this.collection.fetch({data: $.param({q: query})});
        
            //this.collection = new App.SummaryCardCollection(data);
        }

        this.collection.on("reset", this.render, this);
    },
    render: function() {
        var that = this;
        console.log('In summaryCardCollectionView');
        console.log(this.collection.models.length);
        _.each(this.collection.models, function(item) {
            that.renderSummaryCard(item);
        }, this);
    },
    renderSummaryCard: function(item) {
        var cardView = new App.SummaryCardView({
            model: item
        });
        App.NextCol().append(cardView.render().el);
    }
});

//Utility Functions
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
