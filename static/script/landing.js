'use strict';

$(function() {
    $('#searchBtn').click(function(e) {
        $('#searchForm').submit()
    });

    $.ajax({
        type: "GET",
        url: App.API_SERVER + App.API_VERSION + 'user/public/ranked'
    }).done(function(res) {
        if (!res) { // clear local session
            console.log("Error Loading Ranking on Profile Page"); 
        }
            
        var allRankings = res;
        pageView = new App.PageView({rankingId: res[0].shareToken});
    })
    .fail(function(msg) {
    });

    $('.container-landing .jumbotron:odd').addClass('jumbotron-alternate');
});

