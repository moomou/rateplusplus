'use strict';

$(function() {
    var samples = new App.SearchResultView({query:DEFAULT_QUERY});

    App.ShowTrendyLink();
    
    $('#searchInput').focus();
    $('#searchBtn').click(function(e) {
        $('#searchForm').submit()
    });
    $('.container-landing .jumbotron:odd').addClass('jumbotron-alternate');
});

