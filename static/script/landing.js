'use strict';

$(function() {
    var samples = new App.SummaryCardCollectionView({query:DEFAULT_QUERY});
    
    $('#searchInput').focus();
    $('#searchBtn').click(function(e) {
        $('#searchForm').submit()
    });
});

