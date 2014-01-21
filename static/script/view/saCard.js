// Stand Alone Content Card
App.ContentAttributeView = (function() {
    var template = Handlebars.templates.sa_content_rating,
        contentTemplate = Handlebars.templates.sa_card_content;

    return {
        renderStarRating: App.renderStarRating,
        render: function(data) {
            var upVote = data.upVote,
                downVote = data.downVote;
                data.stars = this.renderStarRating(upVote, downVote),
                renderedContent = contentTemplate({
                    content: template(data),
                    src: '',
                    contentId: "",
                });
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
        contentTemplate: Handlebars.templates.sa_card_content
    };

    return {
        render: function(data) {
            var templateName = data.dataType + "Template",
                content = templates[templateName](data);
                renderedContent = templates.contentTemplate({
                    content: content,
                    src: data.srcUrl,
                    contentId: "",
                });
            return renderedContent;
        }
    }
})();

// Content Card
App.StandaloneCardView = Backbone.View.extend({
    saCardTemplate: Handlebars.templates.sa_card,
    standaloneCardTemplateFields: {
        profileIconUrl: '/static/img/blank.png',
        title: 'Title',
        hashTag: '#hashtag',
        authorName: '',
        authorProfileUrl: ''
    },
    events: {
        'click .js-full-screen': 'toggleFullscreen',
        'click .js-hide-screen': 'toggleHidescreen',
        'click .js-save-btn': 'save',
        'dragenter .js-editzone': 'highlightDropZone',
        'dragleave .js-editzone': 'unhighlightDropZone',
        'dragover .js-editzone': 'highlightDropZone',
        'dragenter .js-profile': 'highlightDropZone',
        'dragleave .js-profile': 'unhighlightDropZone',
        'dragover .js-profile': 'highlightDropZone',
        'drop .js-editzone': 'addContent',
        'drop .js-profile': 'changeProfilePicture',
    },
    initialize: function() {
        // should get profile information
        this.postData = {
            dataChain: [],
            hashTag: [],
            entityId: [],
            authorName: [],
            authorProfileUrl: [],
            title: '',
            profileIconUrl: ''
        };
    },
    render: function(presentationMode) {
        var renderData = _.clone(this.standaloneCardTemplateFields);
        renderData.authorName = getCookie("username");
        renderData.editing = !presentationMode;

        this.$el.html(this.saCardTemplate(renderData));
        this.$el.attr('style', 'background: white;');
        return this;
    },
    // Events
    toggleFullscreen: function(e) {
        this.$('.content').removeClass('minimize');
        this.$('.footer').removeClass('minimize');

        if (this.$el.hasClass('widearea-overlayLayer')) {
            this.$('.view-toolbar').addClass('hide');
            this.$el.removeClass('widearea-overlayLayer');
            this.$('.js-scroll-container')
                .removeClass('scroll-container absCenter')
                .attr('style', '');
            this.$el.find('.info-card')
                .removeClass('presentation')
                .attr('style', '');
        }
        else {
            var halfWidth = Math.floor(window.screen.width/2);
            this.$('.view-toolbar').removeClass('hide');
            this.$el.addClass('widearea-overlayLayer');
            this.$('.js-scroll-container')
                .addClass('scroll-container absCenter')
                .attr('style', 'width: '+halfWidth+'px;');
            this.$el.find('.info-card')
                .addClass('presentation')
                .attr('style', 'width: '+(halfWidth-25)+'px;');
        }
    },
    toggleHidescreen: function(e) {
        if (this.$('.content').hasClass('minimize')) {
            this.$('.content').removeClass('minimize');
            this.$('.footer').removeClass('minimize');
        }
        else {
            this.$('.content').addClass('minimize');
            this.$('.footer').addClass('minimize');
        }
    },
    highlightDropZone: function(e) {
        e.preventDefault();
        this.$('.js-editzone').addClass('content-highlight');
    },
    unhighlightDropZone: function(e) {
        e.preventDefault();
        this.$('.js-editzone').removeClass('content-highlight');
    },
    changeProfilePicture: function(e) {
        e.preventDefault();

        var tfData = JSON.parse(
            e.originalEvent.dataTransfer.getData('text'));

        if (tfData.dataType == "image") {
            this.postData.profileIconUrl = tfData.srcUrl;
            this.$('.js-profile')
                .attr('style', "background-image: url('"+tfData.srcUrl+"');");
        }
    },
    addContent: function(e) {
        e.preventDefault();

        var tfData = JSON.parse(
            e.originalEvent.dataTransfer.getData('text')),
            renderedContent = null;

        switch (tfData.contentType) {
            case Constants.contentType.data: {
                renderedContent = App.ContentDataView.render(tfData);
                break;
            }
            case Constants.contentType.attribute: {
                renderedContent = App.ContentAttributeView.render(tfData);
                break;
            }
            case Constants.contentType.ranking: {
                renderedContent = App.ContentRankingView.render(tfData);
                break;
            }
            case Constants.contentType.rating: {
                // not implemented
            }
            default: {
                // should not accept
            }
        }
        
        this.postData.dataChain.push(tfData.id);
        this.$('.js-editzone').after(renderedContent);
    },
    removeContent: function(e) {
    },
    save: function(e) {
        this.postData.title = this.$('js-title').val();
        this.postData.hashTag = _(this.$('js-tag').val().split(",")).map(function(e) {
            return e.trim();
        });

        $.ajax({
            type: "POST",
            url: App.API_SERVER + App.API_VERSION + 'composed/',
            data: this.postData
        })
        .done(function(res) {
            if (!res.error) { // clear local session
            }
        })
        .fail(function(msg) {
            // Tell the user
        });

    },
});
