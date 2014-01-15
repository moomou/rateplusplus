// Stand Alone Content Card
App.ContentDataView = Backbone.View.extend({
    numberTemplate: Handlebars.templates.sa_card_content_number,
    timeseriesTemplate: Handlebars.templates.sa_card_content_timeseries,
    imageTemplate: Handlebars.templates.sa_card_content_image,
    videoTemplate: Handlebars.templates.sa_card_content_video,
    numberTemplate: Handlebars.templates.sa_card_content_number,
    contentTemplate: Handlebars.templates.sa_card_content,
    contentTemplateFields: {
        content: "",
        contentId: "",
        srcTtitle: "",
        src: ""
    },
    renderNumber: function() {
    },
    renderTimeSeries: function() {
    },
    renderFile: function() {
    },
    renderYoutubeLink: function() {
    },
    renderImage: function() {
    },
    renderText: function() {
    },
    renderFunc: function(renderType) {
        var renderMap = {
            number: this.renderNumber,
            timeseries: this.renderTimeSeries,
            file: this.renderFile,
            image: this.renderImage,
            video: this.renderVideo,
            link: this.renderLink
        }
        return renderMap[renderType];
    },
    initialize: function(settings) {
        this.dataList = settings.dataList;
    },
    render: function() {
        var rendered = [],
            that = this;
        _(this.dataList).each(function(data) {
            var renderFunc = that.renderFunc(data.dataType);
            rendered.push(renderFunc());
        });
        return rendered;
    }
});

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
        
    },
    changeProfilePicture: function(e) {
        console.log("dropped");
        var profilePictureSrc = e.originalEvent.dataTransfer.getData('url');
        this.$('.js-profile').attr('style', "background-image: url('"+profilePictureSrc+"');");
    }
});
