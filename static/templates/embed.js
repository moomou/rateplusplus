(function(cloverite) {
    // Setup
    var _entity = {{ENTITY_JSON}},
    _data = {{DATA_JSON }}, 
    _scripTagId = {{SCRIPT_ID}},
    scriptTags = document.getElementsByTagName('script'),
    styleTag = document.createElement('link');

    styleTag.rel = 'stylesheet';
    styleTag.type = 'text/css';
    styleTag.href = 'http://cloverite.com/embed/style.css';
    styleTag.media = 'all';

    document.getElementsByTagName('head')[0].appendChild(styleTag);

    // Actual Render
    var div = document.createElement('div');
    div.id = {{GUUID}};
    div.className = 'cloverite-container cleanslate';
    scriptTag.parentNode.insertBefore(div, scriptTag);
    div.innerHTML = {{RENDERED}};
})(this);
