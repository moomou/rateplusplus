/*
    Global Objects
*/

App.CommentContainer = $('#commentContainer');
App.LinkBox = $('#linkBox');
App.MessageBox = $('.message-box');

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

        this.preSaveAttrs = [];
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
        document.getElementById('attribute').appendChild(this.el);
    },
    // event handler
    addNew: function(e) {
        var newAttr = this.getNewAttrModel();
        this.$el.find('th').parent().after(this.renderAttribute(newAttr));
        this.preSaveAttrs.push(newAttr);
        return newAttr;
    },
    // Custom Func
    renderAttribute: function(newAttr) {
        var rowView = new App.AttributeView({
            model: newAttr
        });
        return rowView.render().el;
    },
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
    saveAll: function() {
        _.each(this.preSaveAttrs, function(attr) {
            attr.save();
        });
        this.preSaveAttrs = [];
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
        titleRow.$('.addNew').hide();

        _.each(this.collection.models, function(row) {
            rowViews.push(that.renderRow(row, tableView));
        });

        document.getElementById('top1').appendChild(tableView.el);

        _.each(rowViews, function(rowView) {
            var rawRankingSession = sessionStorage.getItem('rankingSession'),
                rankingSession = rawRankingSession && JSON.parse(rawRankingSession),
                rawRankingView = sessionStorage.getItem('rankingView'),
                rankingView = rawRankingView && JSON.parse(rawRankingView);
            var referenceRanking = rankingSession || rankingView;

            if (!referenceRanking || referenceRanking.ranks.indexOf(rowView.model.get('id')) < 0) {
                rowView.renderKonb();
            }
            else {
                rowView.assignRanking(rankingView);
            }
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
            // this.collection.fetch({data: $.param({q: q.query})});
            this.pageType = {'type': "search", 'value': q.query};
        }
        else { //empty
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
            filteredList = _.filter(this.collection.models, this._filter),
            isPrivate = false;

        console.log('In PageView summaryCardCollectionView');

        _.each(filteredList, function(item) {
            that.renderSummaryCard(item, this.renderMode);
            isPrivate = item.get('private');
        }, this);

        if (!this.collection.models.length) {
            App.ShowTrendyLink();
        }
        else if (this.pageType.type === 'id') {
            $('#privacy-setting').attr('class', isPrivate ? "icon-lock" : "icon-globe");
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
        console.log(data);
        this.collection = new App.CommentCollection({entity: data.entityId});
        this.data = data;
        this.side = 'left';
        this.collection.fetch();
        this.collection.on('reset', this.render, this);
    },
    update: function(newCmt) {
        $('#commentContainer').append(
            this.renderComment(newCmt, this.side).el);
        this.collection.add(newCmt);
    },
    render: function() {
        var that = this,
            prev = null,
            side = this.side;
        this.cmtViews = [];

        _.each(this.collection.models, function(cmt) {
            if (prev != cmt.get('username')) {
                side = (side == 'left') ? 'right' : 'left';
                prev = cmt.get('username');
            }
            var result = that.renderComment(cmt, side);
            that.cmtViews.push(result);
            $('#commentContainer').append(result.el);
        }, this);

        return this;
    },
    renderComment: function(item, side) {
        var cmtView = new App.CommentView({
                model: item
            }),
            rowCmtView = new App.RowCommentView({
                commentView: cmtView
            });
        var result = rowCmtView.render(side);
        return result;
    }
});

App.RankingControlView = function() {
    var getRankingFromStorage = function(rankingType) {
        var ranking = sessionStorage.getItem(rankingType);
        ranking = (ranking && JSON.parse(ranking)) || null;
        return ranking;
    },
    initRankingListToolbarView = function(rankingType, rankingObj) {
        $('#rankingHeader').show();
        App.RankListToolbarView.clear();
        App.RankListToolbarView.mode(rankingType);
        App.RankListToolbarView.setName(rankingObj.name);
        App.RankListToolbarView.addNewRanks(rankingObj.ranks);
    },
    rankingSession = getRankingFromStorage("rankingSession"),
    rankingView = getRankingFromStorage("rankingView");

    if (!_.isEmpty(rankingSession)) {
        initRankingListToolbarView("rankingSession", rankingSession);
    }
    else if (!_.isEmpty(rankingView)) {
        initRankingListToolbarView("rankingView", rankingView);
    }

    $('#newRanking').click(function(e) {
        var inUse = $('#rankingHeader').is(':visible'),
            forceClear = false,
            existingRankingSession = getRankingFromStorage("rankingSession");

        if (inUse) {
            forceClear = confirm("Start from scratch?");
        }
        else {
            $('#rankingHeader').show()
        }

        if ((!inUse && _.isEmpty(existingRankingSession)) || forceClear) {
            var newRankingSession = {
                inSession: true,
                ranks: []
            }
            sessionStorage.setItem('rankingSession', JSON.stringify(newRankingSession));
            initRankingListToolbarView("rankingSession", newRankingSession.ranks);
        }
    });

    $('#rankingSaveBtn').click(function(e) {
        var existingRankingSession = getRankingFromStorage("rankingSession");
        existingRankingSession.name = $('#rankingName').text();

        if (!existingRankingSession.name || !existingRankingSession.ranks) {
            alert("Please provide a name");
            return;
        }

        $.ajax({
            type: "POST",
            url: App.API_SERVER + App.API_VERSION + 'user/' + getCookie('userid') + "/ranking",
            data: existingRankingSession
        })
        .done(function(res) {
            if (!res.error) { // clear local session
                $('#rankingHeader').hide();
                sessionStorage.removeItem('rankingSession');
            }
        })
        .fail(function(msg) {
            // Tell the user
        });
    });

    $("#rankingCancelBtn").click(function(e) {
        sessionStorage.removeItem("rankingSession");
        $("#rankingHeader").hide();
    });

    $("#rankingViewCancelBtn").click(function(e) {
        sessionStorage.removeItem("rankingView");
        $("#rankingHeader").hide();
    });
};

App.SummaryCardView = Backbone.View.extend({
    className: 'card',
	template: _.template(Template.summaryCardTemplate, null, {variable: 'obj'}),
    summaryTemplate: _.template(Template.summaryTemplate, null, {variable: 'obj'}),
    saveCancelTemplate: _.template(Template.summaryTemplate, null, {variable: 'obj'}),
	events: {
        'click .card-header-left': 'leftCardHeaderBtnHandler',
        'click .card-header-right': 'rightCardHeaderBtnHandler',
        'click .card-title': 'updateCardTitle',
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
        /* Editable and Editing confusing */
		console.log("App.SummaryCardView Render");

        var editable = this.model.get('editable'),
            domId = this.model.get('domId'),
            entityModel = this.model.toJSON(),
            isNew = this.entityView.model.isNew(),
            private = this.entityView.model.get('private');

        this.$el.html(this.template(entityModel));
        this.$('.profileContent').empty().append(this.entityView.render().el);

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
        //catTagsUL.tagit(App.ConfigureTagit('cat', that, editable));

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

            if (isNew) {
                this.$('.closeBtn').hide();
                this.$('.saveBtn').hide();
            }
            else {
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
    saveCreation: function(e, cb) {
        var that = this;

        this.$('.card-status').html('<i class="icon-spinner icon-spin icon-2x pull-left"></i>');
        this.entityView.editProfile('save'); //save the description

        this.entityView.model.save({}, {
            success: function(model, response) {
                //update summary
                $.extend(that.model.attributes, response);

                that.model.trigger('entityModelUpdated');
                that.attributeCollectionView.entityId = model.get('id');

                //UI update
                that.model.set('editable', false);
                that.render();

                if (cb) cb();
            },
            error: function(m, y) {
                debugger;
            }
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
        console.log("adNewAttribute called")

        if (e) { //if activated by UI
            e.preventDefault();
        }

        if (this.renderMode === this.renderDetail) {
            this.attributeCollectionView.addNew();
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
            $btn = this.$('.card-header-right'),
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
        this.attributeCollectionView.saveAll();
    },
    setPrivacy: function(isPublic) {
        this.entityView.model.set('private', !isPublic);
        console.log("Private: " + this.model.get('private'));
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

App.RankBadgeView = Backbone.View.extend({
    template: _.template(Template.rankBadgetTemplate),
    tagName: 'span',
    className: 'rankContainer',
    initialize: function(settings) {
        var color = settings.color || '';

        if (settings.rank <= Constants.rankColor.length) {
            color = Constants.rankColor[settings.rank - 1];
        }

        this.model = {
            rank: settings.rank || 1,
            icon: settings.icon || 'icon-circle',
            color: color
        }
    },
    render: function() {
        this.$el
            .html(this.template(this.model))
            .data('rank', this.model.rank)
            .attr('draggable', 'true')
            .attr('id', _.uniqueId());

        this.el.addEventListener('dragstart', function(ev) {
            ev.dataTransfer.setData("exchangeRank", $(ev.target).data('rank'));
            ev.dataTransfer.setData("exchangeId", ev.target.id);
        });
        return this;
    },
});

App.RankListIconView = Backbone.View.extend({
    template: _.template(Template.rankingListIconTemplate),
    tagName: 'li',
    events: {
        'click .rankContainer': 'updateSessionStorage',
    },
    className: 'ranking',
    initialize: function(settings) {
        var color = settings.color || '',
            domId = settings.domId || "rankingList",
            sessionStorageInd = settings.sessionStorageInd;

        if (settings.rank <= Constants.rankColor.length) {
            color = Constants.rankColor[settings.rank - 1];
        }

        this.model = {
            domId: domId,
            rank: settings.rank || 1,
            icon: settings.icon || 'icon-circle',
            color: color,
            link: settings.link || '#',
            sessionStorageInd: sessionStorageInd
        }
    },
    render: function() {
        this.$el.html(this.template(this.model));
        return this;
    },
    // event handler
    updateSessionStorage: function(e) {
        // write the indicated index data to rankingession
        var currentRankingInd = this.model.sessionStorageInd;

        if (_.isNumber(currentRankingInd)) {
            var allRankings = sessionStorage.getItem("allRankings") &&
                JSON.parse(sessionStorage.getItem("allRankings")),
                currentRanking = currentRankingInd < allRankings.length && allRankings[currentRankingInd];

            currentRanking.ranks = _(currentRanking.ranks).map(function(id) {
                return parseInt(id);
            });

            sessionStorage.setItem("rankingView", JSON.stringify(currentRanking));
            sessionStorage.setItem("currentRankingInd", currentRankingInd);
        }
    }
});

App.RankListToolbarView = (function() {
    var empty = true;

    // private
    var addNewRank = function(entityId, rank) {
        if (empty) {
            $('#rankingList').prev().hide();
            empty = false;
        }

        var link = window.location.origin + "/entity/" + entityId,
            rankListIcon = new App.RankListIconView({rank: rank, link: link});

        $('#rankingList').append(rankListIcon.render().el);
    },
    clear = function() {
        $('#rankingList').empty();
    },
    viewMode = function() {
        $('#rank-sessionButtons').hide();
        $('#rank-viewButtons').show();
        $('#rankingName').attr('contenteditable', false);
    },
    interacMode = function() {
        $('#rankInstruction').show();
        $('#rank-sessionButtons').show();
        $('#rank-viewButtons').hide();
    },
    setName = function(name) {
        $('#rankingName').text(name);
    };

    // public
    return {
        clear: clear,
        mode: function(modeType) {
            if (modeType == "rankingSession") {
                interacMode();
            }
            else {
                viewMode();
            }
        },
        setName: setName,
        addNewRank: addNewRank,
        addNewRanks: function(entityIds) {
            var i = 1;
            _.each(entityIds, function(entityId) {
                addNewRank(entityId, i);
                i += 1;
            });
        }
    };
})();

App.RankingRowView = App.SummaryCardView.extend({
    template: _.template(Template.rankingRowTemplate),
    tagName: 'tr',
    className: 'row',
    events: {
        'click .ranking': 'assignRanking'
    },
    initialize: function() {
    },
    render: function() {
        var that = this;

        this.$el.html(this.template(this.model.toJSON()));
        this.el.addEventListener('dragover', function(ev) {
            ev.preventDefault();
        });

        this.el.addEventListener('drop', function(ev) {
            ev.preventDefault();

            var badgeId = ev.dataTransfer.getData('exchangeId'),
                otherRankBadge = $('#' + badgeId),
                otherTdHead = $('#' + badgeId).parent(),
                tdHead = that.$('.ranking'),
                rankBadge = tdHead.find('.rankContainer'),
                rankingSession = JSON.parse(sessionStorage.getItem('rankingSession')),
                rankInd = ev.dataTransfer.getData('exchangeRank'),
                otherRankInd = rankBadge.data('rank');

            // exchanging background data
            var tmp = rankingSession.ranks[rankInd - 1];
            rankingSession.ranks[rankInd- 1] = rankingSession.ranks[otherRankInd - 1];
            rankingSession.ranks[otherRankInd - 1] = tmp;
            sessionStorage.setItem('rankingSession', JSON.stringify(rankingSession));

            // exchanging row UI
            otherRankBadge.detach();
            rankBadge.detach();
            tdHead.append(otherRankBadge);
            otherTdHead.append(rankBadge);

            // exchange toolbar UI
            var otherRankListIcon = $('#rankingList li:nth-child(' + otherRankInd + ')'),
                rankListIcon = $('#rankingList li:nth-child(' + rankInd + ')');
                otherLink = otherRankListIcon.find('a').attr('href');
            otherRankListIcon.find('a').attr('href', rankListIcon.find('a').attr('href'));
            rankListIcon.find('a').attr('href', otherLink);
        });

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
    assignRanking: function(rankingView) {
        var rawRankingSession = sessionStorage.getItem('rankingSession'),
            rankingSession = rawRankingSession && JSON.parse(rawRankingSession),
            referenceRanking = rankingSession || rankingView;

        if (referenceRanking) {
            var rank = referenceRanking.ranks.indexOf(this.model.get('id'));

            if (rankingSession && rank < 0) {
                rank = rankingSession.ranks.length + 1;
                rankingSession.ranks.push(this.model.get('id'));
                sessionStorage.setItem('rankingSession', JSON.stringify(rankingSession));
                App.RankListToolbarView.addNewRank(this.model.get('id'), rank);
            }
            else {
                rank += 1;
            }

            var rankBadgeView = new App.RankBadgeView({rank: rank});
            this.$('.ranking').empty().append(rankBadgeView.render().el);
        }
    }
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
