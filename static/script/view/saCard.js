// Stand Alone Content Card
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
    render: function() {
        var renderData = _.clone(this.standaloneCardTemplateFields);
        renderData.authorName = getCookie("username");
        this.$el.html(this.saCardTemplate(renderData));
        return this;
    },
    // Events
    highlightDropZone: function(e) {
        e.preventDefault();
        this.$('.js-editzone').addClass('content-highlight');
    },
    unhighlightDropZone: function(e) {
        this.$('.js-editzone').removeClass('content-highlight');
    },
    addNewContent: function(e) {
        console.log("dropped");
        var tfData = JSON.parse(
            e.originalEvent.dataTransfer.getData('text')),
            renderedContent = App.ContentDataView.render(tfData);
        this.$('.js-editzone').after(renderedContent);
    },
    changeProfilePicture: function(e) {
        console.log("dropped");
        var tfData = JSON.parse(
            e.originalEvent.dataTransfer.getData('text'));
        if (tfData.dataType == "image") {
            var profilePictureSrc = tfData.srcUrl;
            this.$('.js-profile')
                .attr('style', "background-image: url('"+profilePictureSrc+"');");
        }
    }
});
