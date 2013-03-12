'use strict';

$(function() {
    var query = $('#searchInput').val(),
        collection = new App.SummaryCardCollectionView({query:query});

    $('#searchBtn').click(function(e) {
        $('#searchForm').submit()
    });

    $('#addNewEntity').click(function(e) {
        var newCard = new App.SummaryCardView({model: new App.SummaryCardModel({})}); 
        var $newCard = newCard.render().$el;
        App.NextCol().prepend($newCard);
    });
});
