'use strict';

$(function() {
    var samples = new App.PageView({query:DEFAULT_QUERY});

    App.ShowTrendyLink();
    
    $('#searchBtn').click(function(e) {
        $('#searchForm').submit()
    });

    $('.container-landing .jumbotron:odd').addClass('jumbotron-alternate');
});

