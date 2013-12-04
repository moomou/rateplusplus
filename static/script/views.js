/**
 * Global Objects
 */

App.GlobalWidget = {
    measureDOM: $('#measure'),
    twitterShareBtn: $('#twitterBtn'),
    searchMessageBox: $('#message-box'),
    searchInput: $('#searchInput'),

    rankingFork: $('#rankingFork'),
    rankingPrivacy: $('#rankingPrivacy'),
    rankingHeader: $('#rankingHeader'),
    rankingName: $('#rankingName'),
    rankingList: $('#rankingList'),
    rankInstruction: $('#rankInstruction'),
    rankEditButtons: $('#rank-sessionButtons'),
    rankViewButtons: $('#rank-viewButtons'),
    shareModal: $('#shareModal'),
};

App.DetailPage = {
    commentContainer: $('#commentContainer'),
    privacyIcon: $('#privacy-setting'),
    title: $('#entityTitle')
};

App.ProfilePage = {
};

App.CommentContainer = $('#commentContainer');
App.GlobalWidget.rankingPrivacy.tooltip();

/**
 * Common Utility Function
 */

// Used completely for its side effect
var updateSessionStorageRankingView = function(currentRankingInd) {
    currentRankingInd = parseInt(currentRankingInd);

    var allRankings = sessionStorage.getItem("allRankings") &&
        JSON.parse(sessionStorage.getItem("allRankings")),
        currentRanking =
            currentRankingInd < allRankings.length && allRankings[currentRankingInd];

    currentRanking.ranks = _(currentRanking.ranks).map(function(id) {
        return parseInt(id);
    });

    sessionStorage.setItem("rankingView", JSON.stringify(currentRanking));
    sessionStorage.setItem("currentRankingInd", currentRankingInd);
}

/**
 * Individual Model Views
 */
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

App.AttributeSimpleView = Backbone.View.extend({
    template: _.template(Template.attributeSimpleTemplate),
    initialize: function() {
       var that = this,
            updateStarRatingType = function() {
                that.model.set('ratingType',
                    that.model.get('tone') == App.POSITIVE ? "goldStar" : 'blackStar');
            };

        updateStarRatingType();
    },
    render: function() {
        console.log('AttributeView Render');

        var model = this.model;
        this.$el.html(this.template(model.toJSON()));
        this.renderStarRating(model.get('upVote'), model.get('downVote'));
    },
    renderStarRating: function(canvas, upVote, downVote) {
        var starGen = function(stars) {
            var starDOM = function(className) {
                return "<i class='icon-" + className + "'></i>";
            },
            result = '';

            for (var i = 0; i < 5; i++) {
                if (stars >= 1) {
                    result += starDOM('star');
                }
                else if (stars >= 0.5) {
                    result += starDOM('star-half-full');
                }
                else {
                    result += starDOM('star-empty');
                }
                stars -= 1;
            }

            return result;
        },
        score = upVote / (upVote + downVote),
        stars = score * 5,
        starDOM = starGen(stars);

        canvas.removeClass('hidden').html(starDOM);
    },
});

App.AttributeView = Backbone.View.extend({
    template: _.template(Template.attributeRowTemplate),
    editTemplate: _.template(Template.attributeRowEditTemplate),
    tagName: 'tr',
    className: 'row',
    events: {
        'click .closeBtn': 'removeAttr',
        'click .saveBtn': 'saveAttr',
        'click .voteBtn': 'attrVote',
        'click .tone': 'toneChange',
        'focusout .attrName': 'editName',
    },
    initialize: function(inactive) {
        console.log("AttrView init")
        var that = this,
            updateStarRatingType = function() {
                that.model.set('ratingType',
                    that.model.get('tone') == App.POSITIVE ? "goldStar" : 'blackStar');
            };

        updateStarRatingType();

        that.model.on('change', function(e) {
            updateStarRatingType();
        });
        that.model.on('sync', function(e) {
            that.render();
        });
    },
    // Rendering functions
    render: function() {
        console.log('AttributeView Render');

        var model = this.model;

        if (model.isNew()) {
            this.$el.html(this.editTemplate(model.toJSON()));
            this.$el.addClass('editHighlight focusOnHover');
        }
        else {
            this.$el.html(this.template(model.toJSON()));
            this.$el.removeClass('editHighlight focusOnHover');
        }

        if (model.get('voted')) {
            this.$('.voteBtns').hide();
            this.$('.progress').fadeToggle();
            this.$('.rating').removeClass('hidden');
            this.renderStarRating(this.$('.rating'),
                model.get('upVote'), model.get('downVote'));
        }

        return this;
    },
    renderStarRating: function(canvas, upVote, downVote) {
        var starGen = function(stars) {
            var starDOM = function(className) {
                return "<i class='icon-" + className + "'></i>";
            },
            result = '';

            for (var i = 0; i < 5; i++) {
                if (stars >= 1) {
                    result += starDOM('star');
                }
                else if (stars >= 0.5) {
                    result += starDOM('star-half-full');
                }
                else {
                    result += starDOM('star-empty');
                }
                stars -= 1;
            }

            return result;
        },
        score = upVote / (upVote + downVote),
        stars = score * 5,
        starDOM = starGen(stars);

        canvas.removeClass('hidden').html(starDOM);
    },
    // Event Handler
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

        if (this.model.get('tone') == App.NEGATIVE) {
            this.model.set('tone', App.POSITIVE);
            $i.attr('style', 'font-size:3em;color:red');
            this.$('.toneText').html('positive');
        }
        else {
            this.model.set('tone', App.NEGATIVE);
            $i.attr('style', 'font-size:3em;');
            this.$('.toneText').html('negative');
        }
},
});

App.SummaryCardView = Backbone.View.extend({
    className: 'card',
	template: _.template(Template.summaryCardTemplate, null, {variable: 'obj'}),
    summaryTemplate: _.template(Template.summaryTemplate, null, {variable: 'obj'}),
    saveCancelTemplate: _.template(Template.summaryTemplate, null, {variable: 'obj'}),
    model: App.SummaryCardModel,
	events: {
        'click .card-header-left': 'leftCardHeaderBtnHandler',
        'click .card-header-right': 'rightCardHeaderBtnHandler',
        'click .card-title': 'updateCardTitle',
        'click .closeBtn': 'cancelCreation',
        'click .editImgBtn': 'changeImg',
        'click .saveBtn': 'saveCreation',
        'mouseover .photo': 'toggleEditImgBtn',
        'mouseout .photo': 'toggleEditImgBtn',
        'mouseover': 'toggleCardHeaderBtn',
        'mouseout': 'toggleCardHeaderBtn',
	},
    //Builtin Func
    initialize: function(settings) {
		console.log("App.SummaryCardView initialize");

        /* 4 render mode: default, search, detail, graph */
        this.renderMode = this["render" + capFirstLetter(settings.renderMode || 'default')];
        this.colManager = settings.colManager || App.ColManager;

        this.entityView = new App.EntityView({model: this.model.get('entityModel')});

        this.attributeCollectionView = new App.TableAttributeCollectionView({
            entityId: this.entityView.model.get('id'),
            collection: this.model.get('attributeCollection'),
            renderMode: settings.renderMode,
            colManager: settings.colManager});

        //TODO change name
        this.side = settings.side;

        if (!this.skipAttribute)
            this.listenTo(this.model.get('attributeCollection'), 'change', this.attrChange);
    },
    // Render Functions
	render: function(editing, renderMode) {
        /* Editable and Editing confusing */
		console.log("App.SummaryCardView Render");

        var editable = this.model.get('editable'),
            domId = this.model.get('domId'),
            entityModel = this.model.toJSON(),
            isNew = this.entityView.model.isNew();

        this.$el.html(this.template(entityModel));
        this.$('.profileContent').empty().append(this.entityView.render().el);

        var that = this,
            hashTagsUL = this.$('#hashtags-'+domId);

        if (editing) {
            console.log("Editing");
            this.$('.summary').hide();
            this.entityView.editProfile('edit');
        }
        else {
            this.renderMode(editing);
        }

        this.renderKonb();
        hashTagsUL.tagit(App.ConfigureTagit('hash', that, editable));

        if (!editable) {
            this.entityView.editProfile('editable');

            if (!this.model.get('hashTags')) {
                this.$('.hashTag').hide();
            }
            else {
                hashTagsUL.find('input').hide();
            }

            this.$('.close').hide(); //save and close btn
            this.$el.removeClass('editHighlight');
        }
        else {
            // Hide details that require model to be saved first
            this.$('.card-header-right').hide();

            this.$el.addClass('editHighlight');

            hashTagsUL.find('input').css('display', '')
                .attr('placeholder', 'Add New Tag');

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
        if (!this.skipAttribute)
            this.attributeCollectionView.render(this.$('.attrContent'));
    },
    renderDetail: function(editing) {
        console.log("renderDetail");
        if (!this.skipAttribute)
            this.attributeCollectionView.render(this.$('.attrContent'));
    },
    renderGraph: function(editing) {
        console.log("renderDetail");
        this.$('.attrContainer').hide();
        this.$('.editBtn').hide();
        this.$('.linkBtn').show();
        if (!this.skipAttribute)
            this.attributeCollectionView.render(this.$('.attrContent'));
    },
    //Event Handler
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
                if (response.success) {
                    //update summary
                    $.extend(that.model.attributes, response.payload);

                    that.model.trigger('entityModelUpdated');
                    that.attributeCollectionView.entityId = model.get('id');

                    //UI update
                    that.model.set('editable', false);
                    that.render();

                    if (cb) cb();
                }
                else {
                    // error, notify user
                }
            },
            error: function(m, y) {
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
    attrChange: function(e) {
        console.log('AttrChange Called');

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
        this.$('.sdial').show();
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


/**
 * Table Row View
 */
App.ProfileRowView = Backbone.View.extend({
    template: _.template(Template.profileRowTemplate),
    tagName: 'tr',
    className: 'row',
    events: {
        'click .icon-share': 'shareRanking',
        'click .viewRanking': 'viewRanking'
    },
    initialize: function(settings) {
        settings = settings || {};
        this.model.sessionStorageInd = settings.sessionStorageInd;
        this.model.rankingShareUrl =
            window.location.origin + '/ranking/' + this.model.shareToken;
        this.disableShare = settings.disableShare;
        this.disableName = settings.disableName;
    },
    render: function() {
        console.log('proilfeRowView Render');
        this.$el.html(this.template(this.model));
        if (this.disableShare) this.$el.find('.btn').addClass('hidden');
        if (this.disableName) this.$el.find('.noSelect').addClass('hidden');
        return this;
    },
    // event handler
    shareRanking: function(e) {
        var that = this;

        App.GlobalWidget.twitterShareBtn
            .attr('href', App.TWITTER_LINK + $.param({
                'url': that.model.rankingShareUrl,
                'text': that.model.name
            }));

        App.GlobalWidget.shareModal
            .find('#shareName').html(this.model.name);

        App.GlobalWidget.shareModal.on("shown", function() {
            App.GlobalWidget.shareModal.find('#publicURL')
                .val(that.model.rankingShareUrl).select();
        });

        App.GlobalWidget.shareModal.modal();
    },
    viewRanking: function(e) {
        // update internal storage
        e.preventDefault();

        var currentRankingInd = this.model.sessionStorageInd;

        if (_.isNumber(currentRankingInd)) {
            updateSessionStorageRankingView(currentRankingInd);
        }

        // Remove ranking session if any
        sessionStorage.removeItem('rankingSession');
        document.location.href = this.model.rankingShareUrl;
    }
});

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
            rankingSession = rawRankingSession && JSON.parse(rawRankingSession);

        if (!rankingView) {
            var rawRankingView = sessionStorage.getItem('rankingView');
            rankingView = rawRankingView && JSON.parse(rawRankingView);
        }

        var referenceRanking = rankingSession || rankingView;

        if (referenceRanking) {
            var rank = referenceRanking.ranks.indexOf(this.model.id.toString());

            if (rankingSession && rank < 0) {
                rank = rankingSession.ranks.length + 1;
                rankingSession.ranks.push(this.model.get('id').toString());
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

App.TitleRowView = Backbone.View.extend({
    template: _.template(Template.titleRowTemplate),
    tagName: 'tr',
    className: 'row title',
    initialize: function(settings) {
        this.settings = settings;
    },
    render: function(title) {
        this.$el.html(this.template({"title": title}));

        var that = this;
        if (that.settings) {
            _(that.settings.hide).each(function(className) {
                that.$el.find(className).hide();
            });
        }
        return this;
    }
});


/**
 * Ranking Related Views
 */
App.RankBadgeView = Backbone.View.extend({
    template: _.template(Template.rankBadgetTemplate),
    className: 'rankContainer moz-rankContainer',
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
        var currentRankingInd = this.model.sessionStorageInd;
        if (_.isNumber(currentRankingInd)) {
            updateSessionStorageRankingView(currentRankingInd);
        }
    }
});

// Global Object for controlling ranking toolb
App.RankListToolbarView = (function() {
    var empty = true;

    // private
    var addNewRank = function(entityId, rank) {
        App.GlobalWidget.rankInstruction.hide();

        if (empty) {
            App.GlobalWidget.rankingList.prev().hide();
            empty = false;
        }

        var link = window.location.origin + "/entity/" + entityId,
            rankListIcon = new App.RankListIconView({rank: rank, link: link});

        App.GlobalWidget.rankingList.append(rankListIcon.render().el);
        return this;
    },
    clear = function() {
        App.GlobalWidget.rankingList.empty();
        return this;
    },
    viewMode = function() {
        App.GlobalWidget.rankEditButtons.hide();
        App.GlobalWidget.rankViewButtons.show();
        App.GlobalWidget.rankingPrivacy.hide();
        App.GlobalWidget.rankingFork.tooltip();
        App.GlobalWidget.rankingName
            .attr('contenteditable', false)
            .attr('style', '');
        return this;
    },
    interacMode = function() {
        App.GlobalWidget.rankingPrivacy.show().tooltip();
        App.GlobalWidget.rankingFork.hide();
        App.GlobalWidget.rankInstruction.show();
        App.GlobalWidget.rankEditButtons.show();
        App.GlobalWidget.rankViewButtons.hide();
        App.GlobalWidget.rankingName
            .text("Click to add name")
            .attr('contenteditable', true)
            .attr('style', 'border-bottom: 1px dashed pink');
        return this;
    },
    setName = function(name) {
        if (name && name.indexOf("#") >= 0) {
            App.GlobalWidget.rankingName.html(
                    "<a href='" + '#' +"'>" + name + "</a>");
        }
        else {
            App.GlobalWidget.rankingName.text(name);
        }
        return this;
    },
    setPrivacyIcon = function(isPrivate) {
        App.GlobalWidget.rankingPrivacy
            .tooltip('hide')
            .attr('class', (isPrivate ? "icon-lock" : "icon-globe") + " icon-2x cursor-pointer")
            .attr('title', isPrivate ? "Private Ranking" : "Public Ranking")
            .tooltip('fixTitle')
            .tooltip();
    },
    addNewRanks = function(entityIds) {
        var i = 1;
        _.each(entityIds, function(entityId) {
            addNewRank(entityId, i);
            i += 1;
        });
        return this;
    };

    App.GlobalWidget.rankingPrivacy.click(function(e) {
        // Do not allow edit during viewing mode
        if (App.GlobalWidget.rankViewButtons.is(':visible')) {
            return;
        }

        setPrivacyIcon(!$(e.target).hasClass('icon-lock'));
    });

    // public
    return {
        mode: function(modeType) {
            if (modeType == "rankingSession") {
                interacMode();
            }
            else {
                viewMode();
            }
            return this;
        },
        init: function(rankingObj) {
            setName(rankingObj.name);
            addNewRanks(rankingObj.ranks);
            setPrivacyIcon(rankingObj.private === "true");
        },
        clear: clear,
        setName: setName,
        addNewRanks: addNewRanks,
        addNewRank: addNewRank
    };
})();

App.RankingController = function() {
    var getRankingFromStorage = function(rankingType) {
        var ranking = sessionStorage.getItem(rankingType);
        ranking = (ranking && JSON.parse(ranking)) || null;
        return ranking;
    },
    initRankingListToolbarView = function(rankingType, rankingObj) {
        App.GlobalWidget.rankingHeader.show();
        App.RankListToolbarView
            .clear()
            .mode(rankingType)
            .init(rankingObj);
    },
    rankingSession = getRankingFromStorage("rankingSession"),
    rankingView = getRankingFromStorage("rankingView");

    if (!_.isEmpty(rankingSession)) {
        initRankingListToolbarView("rankingSession", rankingSession);
    }
    else if (!_.isEmpty(rankingView)) {
        initRankingListToolbarView("rankingView", rankingView);
    }

    $('.addNewRanking').click(function(e) {
        var inUse = App.GlobalWidget.rankingHeader.is(':visible'),
            existingRankingSession = getRankingFromStorage("rankingSession"),
            forceClear = false;

        if (inUse) {
            forceClear = confirm("Start a new ranking?");
        }
        else {
            App.GlobalWidget.rankingHeader.show();
        }

        if ((!inUse && _.isEmpty(existingRankingSession)) || forceClear) {
            var newRankingSession = {
                inSession: true,
                ranks: []
            };

            sessionStorage.setItem('rankingSession', JSON.stringify(newRankingSession));
            initRankingListToolbarView("rankingSession", newRankingSession.ranks);
        }
    });

    $('#rankingSaveBtn').click(function(e) {
        var existingRankingSession = getRankingFromStorage("rankingSession"),
            userid = getCookie('userid') || 'public';

        existingRankingSession.name =
            App.GlobalWidget.rankingName.text();
        existingRankingSession.private =
            App.GlobalWidget.rankingPrivacy.hasClass('icon-lock');

        if (!existingRankingSession.name || !existingRankingSession.ranks) {
            alert("Please provide a name");
            return;
        }

        $.ajax({
            type: "POST",
            url: App.API_SERVER + App.API_VERSION + 'user/' + userid + "/ranking",
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

    if (rankingView) {
        $('#rankingHeaderShareTwitterBtn')
            .attr('href', App.TWITTER_LINK + $.param({
                'url': window.location.origin + '/ranking/' + rankingView.shareToken,
                'text': rankingView.name
            }));
    }
};

/* Composite View Component */

// CardView is for column view of card collections
App.PinCardCollectionView = Backbone.View.extend({
    initialize: function(settings) {
        settings = settings || {};

        if (settings.rankingId) {
            this.collection =
                new App.SummaryCardCollection(App.SPECIFIC_RANKING,  settings.rankingId);
        }
        else if (settings.query){ // query
            this.collection =
                new App.SummaryCardCollection(App.SEARCH_ENTITY, settings.query);
        }
        else { // Single
            this.collection =
                new App.SummaryCardCollection(App.SPECIFIC_ENTITY, settings.id);
        }
        this.colManager = App.ColManager.getCardCol();
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
            filteredList = this.collection.models;
        //_.filter(this.collection.models, this.filter());
        _.each(filteredList, function(item) { that.renderSummaryCard(item); }, this);
    },
    renderSummaryCard: function(item) {
        var that = this,
            cardView = new App.SummaryCardView({
                model: item,
                renderMode: 'detail',
                skipAttribute: true
            });

        this.colManager.getNext().append(cardView.render().el);
    }
});

App.TableCardCollectionView = Backbone.View.extend({
    initialize: function(settings) {
        if (settings.rankingId) { //rankingId is shareToken
            this.collection =
                new App.SummaryCardCollection(App.SPECIFIC_RANKING,  settings.rankingId);
            this.pageType = {'type': "ranking", 'value': settings.rankingId};
        }
        else if (settings.query){ // query
            this.collection =
                new App.SummaryCardCollection(App.SEARCH_ENTITY, settings.query)
            this.pageType = {'type': "search", 'value': settings.query};
        }

        this.collection.on('reset', this.render, this);
    },
    render: function() {
        if (this.pageType.type == "ranking") {
            var rankingView = JSON.parse(sessionStorage.getItem("rankingView")),
                profileUrl = window.location.origin + "/profile/",
                displayTitle =
                    "Top " + rankingView.ranks.length + " " + rankingView.name,
                postFixRanking = displayTitle.toLowerCase().indexOf('ranking') < 0;

            this.title = postFixRanking ? displayTitle + " Ranking" : displayTitle;

            /*
            this.title += " by " +
                "<a href='" + profileUrl + rankingView.createdBy + "'>" +
                rankingView.createdBy +
                "</a>";
            */
        }
        else {
            this.title = "Result for " + this.pageType.value;
        }

        if (this.collection.models.length == 0) {
            // Didn't fina anything
            document.location.href = window.location.origin +
                "/entity/new?empty=true&searchterm=" +
                encodeURIComponent(App.GlobalWidget.searchInput.val());
            return;
        }

        var that = this,
            rowViews = [],
            tableView = new App.TableView(),
            titleRow = new App.TitleRowView({
                'hide': ['.addNew']
            });

        tableView.el.appendChild(titleRow.render(this.title).el);

        _.each(this.collection.models, function(row) {
            rowViews.push(that.renderRow(row, tableView));
        });

        document.getElementById('top1').appendChild(tableView.el);

        var rawRankingSession = sessionStorage.getItem('rankingSession'),
            rankingSession = rawRankingSession && JSON.parse(rawRankingSession),
            rawRankingView = sessionStorage.getItem('rankingView'),
            rankingView = rawRankingView && JSON.parse(rawRankingView),
            referenceRanking = rankingSession || rankingView;

        _.each(rowViews, function(rowView) {
            if (!referenceRanking || referenceRanking.ranks.indexOf(rowView.model.id.toString()) < 0) {
                rowView.renderKonb();
            }
            else {
                rowView.assignRanking(rankingView);
            }
        });

        App.RankingController();
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

App.TableAttributeCollectionView = App.TableView.extend({
    initialize: function(settings) {
        console.log('Attr Collection View');

        if (settings.collection) {
            this.collection = settings.collection;
        }
        else {
            this.collection = new App.AttributeCollection();
        }

        this.preSaveAttrs = [];
        this.entityId = settings.entityId
        this.renderMode = this["render" + capFirstLetter(settings.renderMode || 'default')];
        this.colManager = settings.colManager || App.ColManager;
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
            new App.TitleRowView({hide: ['.addNewRanking']}).render("Attribute").el);

        // add each attribute
        var that = this;
        _.each(this.collection.models, function(attr) {
            that.el.appendChild(that.renderAttribute(attr));
        });

        if (document.getElementById('attribute'))
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

// TODO: Implement
App.SimpleAttributeCollectionView = Backbone.View.extend({
});

// High level page
//
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
            .attr('class', isPrivate ? "icon-lock" : "icon-globe")
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
    },
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
