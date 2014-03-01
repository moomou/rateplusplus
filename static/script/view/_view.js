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
        contentTemplate       : Handlebars.templates.sa_card_content,
        // Card template
        numberTemplate        : Handlebars.templates.sa_content_field,
        timeseriesTemplate    : Handlebars.templates.sa_content_timeseries,
        imageTemplate         : Handlebars.templates.sa_content_image,
        videoTemplate         : Handlebars.templates.sa_content_video,
        textTemplate          : Handlebars.templates.sa_content_textbox,
        // Row templats
        numberRowTemplate     : Handlebars.templates.sa_content_field,
        timeseRowriesTemplate : Handlebars.templates.sa_content_timeseries,
        imageRowTemplate      : Handlebars.templates.sa_content_image,
        videoRowTemplate      : Handlebars.templates.sa_content_video,
        textRowTemplate       : Handlebars.templates.sa_content_textbox
    },
    renderRow = function(data) {
        var templateName = data.dataType + "RowTemplate";
        return templates[templateName](data);
    },
    renderCard = function(data) {
       var templateName = data.dataType + "Template";
       return templates[templateName](data);
    };

    return {
        render: function(renderType, data, noWrap) {
            var func = null;

            if (renderType == "row") {
                func = renderRow;    
            } else {
                func = renderCard;
            }

            if (data.dataType == "video") {
                data.youtubeId = getYoutubeId(data.srcUrl);
            }

            var content = func(data, noWrap);

            if (noWrap) {
                return content;
            } else {
                return templates.contentTemplate({
                    content: content,
                    src: data.srcUrl,
                    contentId: "",
                });
            }
        }
    }
})();

// Individual Model Views
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

App.SimpleCard = Backbone.View.extend({
    className: 'card micro searchable',
    template: Handlebars.templates.simple_card,
    model: App.SummaryCardModel,
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
            this.content = App.ContentDataView.render("card", data, true);
        }
        this.title = data.name;
    },
    render: function() {
        var templateValues = this.model.toJSON(),
            indexTitle = this.title || '',
            indexValue = this.value || '',
            dataIndex = indexTitle.toLowerCase() + indexValue.toLowerCase();

        templateValues.title = this.title;

        this.$el.html(this.template(templateValues));
        this.$('.entityDetail').html(this.content);

        this.$el.attr('data-index', dataIndex);

        // initialize controller
        var that = this;

        if (this.controller) {
            new this.controller({
                el: that.el,
                $el: that.$el,
                model: that.model
            });
        }

        return this;
    },
});

App.ContributorView = {
    template: Handlebars.templates.contributor_icon,
    render: function(contributors) {
        contributors = contributors || []; 

        var anonymous = this.template(),
            result = '',
            that = this;
        
        _(contributors).each(function(contributor) {
            if (contributor) {
                result += that.template(contributor);
            }
        });

        if (result == "") {
            result += anonymous;
        }

        return result;
    }
};

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
        this.$('.voteBtn').hide();
        return this;
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


// Table Row View
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

App.RankingRowView = Backbone.View.extend({
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


// Ranking Related Views
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

// Composite View Component
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
