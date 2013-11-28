'use strict';

$(function() {
    $('#searchBtn').click(function(e) {
        $('#searchForm').submit()
    });

    console.log("Profile Page Init");
    $.ajax({
        type: "GET",
        url: App.API_SERVER + App.API_VERSION + 'user/public/ranked'
    })
    .done(function(res) {
        if (!res.success) {
            // notify user
            return;
        }

        var allRankings = res.payload;
        sessionStorage.setItem("allRankings", JSON.stringify(allRankings));

        var sampleRanking = [];
        _(allRankings).each(function(ranking) {
            var url = window.location.origin + "/ranking/" + ranking.shareToken,
                name = ranking.name;
            sampleRanking.push({name: name, url: url});
        });

        var ind = 0;
        _($('#sampleRanking a')).each(function(a) {
            if (ind >= sampleRanking.length) { 
                return;
            }
            var $a = $(a);
            $a.attr('href', sampleRanking[ind].url)
                .html(sampleRanking[ind].name);
            ind += 1;
        });
    })
    .fail(function(msg) {
        // Tell the user
    });

});

