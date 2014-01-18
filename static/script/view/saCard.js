// Stand Alone Content Card
App.ContentRatingView = (function() {
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
        'dragenter .js-editzone': 'highlightDropZone',
        'dragleave .js-editzone': 'unhighlightDropZone',
        'dragover .js-editzone': 'highlightDropZone',
        'dragenter .js-profile': 'highlightDropZone',
        'dragleave .js-profile': 'unhighlightDropZone',
        'dragover .js-profile': 'highlightDropZone',
        'drop .js-editzone': 'addNewContent',
        'drop .js-profile': 'changeProfilePicture',
    },
    initialize: function() {
        // should get profile information
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

        if (this.$el.hasClass('widearea-overlayLayer')) {
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
            this.$el.addClass('widearea-overlayLayer');
            this.$('.js-scroll-container')
                .addClass('scroll-container absCenter')
                .attr('style', 'width: '+halfWidth+'px;');
            this.$el.find('.info-card')
                .addClass('presentation')
                .attr('style', 'width: '+(halfWidth-25)+'px;');
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
    addNewContent: function(e) {
        console.log("dropped");
        e.preventDefault();
        var tfData = JSON.parse(
            e.originalEvent.dataTransfer.getData('text')),
            renderedContent = null;

        if (tfData.dataType) {
            renderedContent = App.ContentDataView.render(tfData);
        }
        else {
            renderedContent = App.ContentRatingView.render(tfData);
        }

        this.$('.js-editzone').after(renderedContent);
    },
    changeProfilePicture: function(e) {
        console.log("dropped");
        e.preventDefault();
        var tfData = JSON.parse(
            e.originalEvent.dataTransfer.getData('text'));
        if (tfData.dataType == "image") {
            var profilePictureSrc = tfData.srcUrl;
            this.$('.js-profile')
                .attr('style', "background-image: url('"+profilePictureSrc+"');");
        }
    }
});
