'use strict';

$(function() {
    console.log('init......');
    var test = new App.SummaryCardCollectionView({});

    $('#addNewEntity').click(function(e) {
        var newCard = new App.SummaryCardView({model: new App.SummaryCardModel({})}); 
        App.NextCol().append(newCard.render().el);
    });
});
