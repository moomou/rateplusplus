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

    saEditor: $('.sa-editor')
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
App.updateSessionStorageRankingView = function(currentRankingInd) {
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
};

App.renderStarRating = function(upVote, downVote) {
    var starGen = function(stars) {
        var starDOM = function(className) {
            return "<i class='fa fa-" + className + "'></i>";
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
                result += starDOM('star-o');
            }
            stars -= 1;
        }

        return result;
    },
    score = upVote / (upVote + downVote),
    stars = score * 5,
    starDOM = starGen(stars);

    return starDOM;
};


// Content Data
App.ContentAttributeView = (function() {
    var template = Handlebars.templates.sa_content_rating,
        contentTemplate = Handlebars.templates.sa_card_content;

    return {
        renderStarRating: App.renderStarRating,
        render: function(data, noWrap) {
            var upVote = data.upVote,
                downVote = data.downVote;
                data.stars = this.renderStarRating(upVote, downVote),
                renderedContent = contentTemplate({
                    content: template(data),
                    src: '',
                    contentId: "",
                });

            if (noWrap) {
                return template(data);
            }
            return renderedContent;
        }
    };
})();

App.ContentRankingView = (function() {
    var template = Handlebars.templates.sa_content_ranking,
        contentTemplate = Handlebars.templates.sa_card_content;
    return {
        render: function(data) {
            renderedContent = contentTemplate({
                content: template(data),
                src: '',
                contentId: "",
            });
            return renderedContent;
        }
    };
})();

App.ContentDataView = (function() {
    var templates = {
        numberTemplate: Handlebars.templates.sa_content_field,
        timeseriesTemplate: Handlebars.templates.sa_content_timeseries,
        imageTemplate: Handlebars.templates.sa_content_image,
        videoTemplate: Handlebars.templates.sa_content_video,
        contentTemplate: Handlebars.templates.sa_card_content,
        textTemplate: Handlebars.templates.sa_content_textbox
    };

    return {
        render: function(data, noWrap) {
            var templateName = data.dataType + "Template",
                content = templates[templateName](data);
                renderedContent = templates.contentTemplate({
                    content: content,
                    src: data.srcUrl,
                    contentId: "",
                });

            if (noWrap) {
                return content;
            }
            else {
                return renderedContent;
            }
        }
    }
})();

/**
 * Individual Model Views
 */
App.TableView = Backbone.View.extend({
    template: function() { return "";},
    tagName: 'table',
    className: 'rankingTable table',
    events: {
        'click .addNew': 'addNew'
    },
    render: function() {
        this.$el.html();
        return this;
    },
    // Event handler
    addNew: function() {
        console.log('Not implemented');
    }
});

App.EntityView = Backbone.View.extend({
    template: Handlebars.templates.entityDescription,
    tagName: 'div',
    className: 'inner',
    events: {
        'click .editProfileBtn': 'editProfile',
    },
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

App.AttributeView = Backbone.View.extend({
    renderStarRating: App.renderStarRating,
    events: {
        'click .voteBtn': 'attrVote',
        'dragstart': 'dragStart',
        'dragend': 'dragEnd'
    },
    initialize: function(settings) {
        console.log("AttrController init")
        this.el = settings.el;
        this.$el = settings.$el;
        this.model = settings.model;
        this.$el.attr('draggable', 'true');
    },
    // Rendering functions
    render: function() {
        this.$('.voteBtns').hide();
        this.$('.progress').fadeToggle();
        this.$('.rating').removeClass('hidden');
        this.$('.rating')
            .removeClass('hidden')
            .append(this.renderStarRating(
                model.get('upVote'), model.get('downVote')));
        return this;
    },
    // Event Handler
    attrVote: function(e) {
        console.log('attrVote called:');

        if ($(e.target).hasClass('upVote')) {
            this.model.enqueuVote(App.POSITIVE, this);
        }
        else {
            this.model.enqueuVote(App.NEGATIVE, this);
        }
    },
    dragStart: function(e) {
        var dt = e.originalEvent.dataTransfer,
            transferData = this.model.toJSON();

        transferData.contentType = Constants.contentType.attribute;
        dt.setData("text/plain", JSON.stringify(transferData));
    },
    dragEnd: function(e) {
        console.log('drag end');
    }
});

App.DataView = Backbone.View.extend({
    numberTemplate: Handlebars.templates.data_num,
    imageTemplate: Handlebars.templates.data_img,
    textTemplate: Handlebars.templates.sa_content_textbox,
    tagName: 'li',
    events: {
        'dragstart': 'dragStart',
        'dragend': 'dragEnd'
    },
    getTemplate: function(data) {
       if (data.dataType == "number") {
            return this.numberTemplate;
        }
        else if (data.dataType == "image") {
            return this.imageTemplate;
        }
       else if (data.dataType == "text") {
            return this.textTemplate;
       }
    },
    initialize: function(settings) {
        this.template = this.getTemplate(settings);
        this.model = {
            toJSON: function() {
                return _.clone(settings);
            }
        };
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.attr('id', 'data-' + _.uniqueId());
        this.$el.attr('draggable', 'true');
        return this;
    },
    // Events
    dragStart: function(e) {
        var dt = e.originalEvent.dataTransfer,
            transferData = this.model.toJSON();
        transferData.contentType = Constants.contentType.data;
        dt.setData("text/plain", JSON.stringify(transferData));
    },
    dragEnd: function(e) {
        console.log('drag end');
    }
});

App.SummaryCardView = Backbone.View.extend({
    className: 'card',
	template: Handlebars.templates.summaryCard,
    summaryTemplate: Handlebars.templates.contentSummary,
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

        if (!this.skipAttribute) {
            this.listenTo(this.model.get('attributeCollection'), 'change', this.attrChange);
        }
    },
    // Render Functions
	render: function(editing, renderMode) {
        /* Editable and Editing confusing */
		console.log("App.SummaryCardView Render");

        var editable = this.model.get('editable'),
            domId = this.model.get('domId'),
            isNew = this.entityView.model.isNew(),
            entityModel = _.extend(this.model.toJSON(), {editable: isNew.toString()});
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
        if (!this.skipAttribute) {
            this.$el.find('.summary').html(this.summaryTemplate(this.model.toJSON()));
            this.attributeCollectionView.render(this.$('.attrContent'));
        }
        if (!this.skipData) {
            var allData = this.model.get('data'),
                content = $('#content .content'),
                writing = $('#writing .writing');

            _(allData).each(function(data) {
                var dataView = new App.DataView(data);

                if (data.dataType == "number") {
                    content.find('.numData').append(dataView.render().el);
                }
                else if (data.dataType == "image") {
                    content.find('.mediaData').append(dataView.render().el);
                }
                else if (data.dataType == "text") {
                    writing.append(dataView.render().el);
                }
            });
        }
        if (!this.skipRanking) {
            var allRanking = this.model.get('ranking'),
                rankingCanvas = $('#ranking .row-fluid');
            _(allRanking).each(function(ranking) {
                var rankingView = new App.RankingView(data);
                rankingCanvas.append(rankingView.render().el);
            });
        }
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
        if (target.hasClass('fa-paper-clip') || target.hasClass('linkBtn')) {
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

        this.$('.card-status').html('<i class="fa fa-spinner fa-spin fa-2x pull-left"></i>');
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

App.SimpleCard = Backbone.View.extend({
    className: 'card micro',
    template: Handlebars.templates.simple_card,
    model: App.EntityModel,
    events: {
        'mouseover': 'toggleToolbar',
        'mouseout': 'toggleToolbar',
	},
    toggleToolbar: function(e) {
        return;
        var eventType = e.type,
            $toolbar = this.$('.view-toolbar'),
            state = $toolbar.css('visibility');

        if (eventType === "mouseover" && state === "hidden") {
            $toolbar.css('visibility', 'visible');
        }
        else if (eventType === "mouseout") {
            $toolbar.css('visibility', 'hidden');
        }
    },
    initialize: function(settings) {
        var data = this.model.get(settings.renderType)[settings.renderIndex];

        if (settings.renderType === "attributes") {
            this.content = App.ContentAttributeView.render(data, true);
            this.model = new App.EntityAttributeModel(data);
            this.controller = App.AttributeView;
        }
        else {
            this.content = App.ContentDataView.render(data, true);
        }
        this.title = data.name;
    },
    render: function() {
        var templateValues = this.model.toJSON();
        templateValues.title = this.title;

        this.$el.html(this.template(templateValues));
        this.$('.entityDetail').html(this.content);

        // initialize controller
        var that = this;
        new this.controller({
            el: that.el,
            $el: that.$el,
            model: that.model
        });

        return this;
    },
});

/**
 * Table Row View
 */
App.ProfileRowView = Backbone.View.extend({
    template: Handlebars.templates.profileRow,
    tagName: 'tr',
    className: 'row',
    events: {
        'click .fa-share': 'shareRanking',
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
            App.updateSessionStorageRankingView(currentRankingInd);
        }

        // Remove ranking session if any
        sessionStorage.removeItem('rankingSession');
        document.location.href = this.model.rankingShareUrl;
    }
});

App.RankingRowView = App.SummaryCardView.extend({
    template: Handlebars.templates.rankingRow,
    tagName: 'tr',
    className: 'row',
    events: {
        'click .js-ranking': 'assignRanking'
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
                tdHead = that.$('.js-ranking'),
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
            this.$('.js-ranking').empty().append(rankBadgeView.render().el);
        }
    }
});

App.TitleRowView = Backbone.View.extend({
    template: Handlebars.templates.titleRow,
    tagName: 'tr',
    className: 'row title',
    initialize: function(settings) {
        this.settings = settings;
    },
    render: function(title, hideNewRankingBtn) {
        var that = this;

        that.$el.html(that.template({"title": title}));

        if (hideNewRankingBtn) {
            that.settings.hide.push(".addNewRanking");
        }

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
App.RankingView =  Backbone.View.extend({
    template: Handlebars.templates.detail_ranking,
    events: {
        'dragstart': 'dragStart',
        'dragend': 'dragEnd'
    },
    initialize: function(settings) {
        this.model = {
            toJSON: function() {
                return _.clone(settings);
            }
        };
    },
    render: function() {
        this.$el.attr('draggable', true);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    // Event code
    dragStart: function(e) {
        var dt = e.originalEvent.dataTransfer,
            transferData = this.model.toJSON();
        transferData.contentType = Constants.contentType.ranking;
        dt.setData("text/plain", JSON.stringify(transferData));
    },
    dragEnd: function(e) {
    }
});

App.RankBadgeView = Backbone.View.extend({
    template: Handlebars.templates.rankBadge,
    className: 'rankContainer moz-rankContainer',
    initialize: function(settings) {
        var color = settings.color || '';

        if (settings.rank <= Constants.rankColor.length) {
            color = Constants.rankColor[settings.rank - 1];
        }

        this.model = {
            rank: settings.rank || 1,
            icon: settings.icon || 'fa fa-circle',
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
    template: Handlebars.templates.rankingListIcon,
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
            icon: settings.icon || 'fa fa-circle',
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
            App.updateSessionStorageRankingView(currentRankingInd);
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
    setForkLink = function(shareToken) {
        App.GlobalWidget.rankingFork.parent().attr("href",
            window.location.origin + "/ranking/" + shareToken + "?forking=true");
    },
    setPrivacyIcon = function(isPrivate) {
        App.GlobalWidget.rankingPrivacy
            .tooltip('hide')
            .attr('class', (isPrivate ? "fa-lock" : "fa-globe") + "fa fa-2x cursor-pointer")
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
        // Do not allow edit during viewing mode or fork mode
        if (getQueryVariable("forking") || App.GlobalWidget.rankViewButtons.is(':visible')) {
            return;
        }
        setPrivacyIcon(!$(e.target).hasClass('fa-lock'));
    });

    // public
    return {
        mode: function(modeType, isForking) {
            if (isForking || modeType === "rankingSession") {
                interacMode();
            }
            else {
                viewMode();
            }
            return this;
        },
        init: function(rankingObj) {
            setName(rankingObj.name);
            setForkLink(rankingObj.shareToken);
            addNewRanks(rankingObj.ranks);
            setPrivacyIcon(rankingObj.private === "true");
        },
        clear: clear,
        setName: setName,
        addNewRanks: addNewRanks,
        addNewRank: addNewRank
    };
})();

App.RankingController = function(isForking) {
    var getRankingFromStorage = function(rankingType) {
        var ranking = sessionStorage.getItem(rankingType);
        ranking = (ranking && JSON.parse(ranking)) || null;
        return ranking;
    },
    initRankingListToolbarView = function(rankingType, rankingObj) {
        App.GlobalWidget.rankingHeader.show();
        App.RankListToolbarView
            .clear()
            .mode(rankingType, isForking)
            .init(rankingObj);
    },
    startNewRanking = function(forking) {
        var inUse = App.GlobalWidget.rankingHeader.is(':visible'),
            existingRankingSession = getRankingFromStorage("rankingSession"),
            existingRankingView = getRankingFromStorage("rankingView"),
            forceClear = false;

        if (forking) {
            // if forking, must have an existing rankingView
            if (!existingRankingView) {
                console.log("Error: rankingView should exist for forking to work");
                return;
            }
            // clear the existing ranks
            existingRankingSession = {};
            inUse = false;
        }
        else if (inUse) {
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

            if (forking) {
                // set the name to the forked hash tag
                App.GlobalWidget.rankingName.text(existingRankingView.name);
            }
        }
    },
    rankingSession = getRankingFromStorage("rankingSession"),
    rankingView = getRankingFromStorage("rankingView");


    $('.addNewRanking').click(function(e) {
        startNewRanking(false);
    });

    $('#rankingSaveBtn').click(function(e) {
        var existingRankingSession = getRankingFromStorage("rankingSession"),
            userid = getCookie('userid') || 'public';

        existingRankingSession.name =
            App.GlobalWidget.rankingName.text();
        existingRankingSession.private =
            App.GlobalWidget.rankingPrivacy.hasClass('fa-lock');

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
                var newRankingShareToken = res.payload.shareToken;

                // redirect the user to new rankingView
                document.location.href =
                    window.location.origin + "/ranking/" + newRankingShareToken;
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

    if (!_.isEmpty(rankingSession)) {
        initRankingListToolbarView("rankingSession", rankingSession);
    }
    else if (!_.isEmpty(rankingView)) {
        initRankingListToolbarView("rankingView", rankingView);
    }

    if (!isForking && rankingView) {
        $('#rankingHeaderShareTwitterBtn')
            .attr('href', App.TWITTER_LINK + $.param({
                'url': window.location.origin + '/ranking/' + rankingView.shareToken,
                'text': rankingView.name
            }));
    }
    else if (isForking) {
        startNewRanking(true);
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
        this.colManager = App.ColManager.CardCol;
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

        this.isForking = settings.forking || false;
        this.collection.on('reset', this.render, this);
    },
    render: function() {
        if (this.pageType.type == "ranking") {
            var rankingView = JSON.parse(sessionStorage.getItem("rankingView")),
                profileUrl = window.location.origin + "/profile/",
                displayTitle = "Top " + rankingView.ranks.length + " " + rankingView.name,
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
            // Didn't find anything
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

        tableView.el.appendChild(titleRow.render(this.title, rankingView).el);

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
            if (that.isForking || !referenceRanking ||
                referenceRanking.ranks.indexOf(rowView.model.id.toString()) < 0) {
                rowView.renderKonb();
            }
            else {
                rowView.assignRanking(rankingView);
            }
        });

        App.RankingController(that.isForking);
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
