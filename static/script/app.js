'use strict';

$(function() {
    var query = $('#searchInput').val(),
        collection = new App.SummaryCardCollectionView({query:query});

    $('#submitFeedbackForm').click(function(e) {
        var $form = $('#feedbackForm');
        $form.submit(function(e) {
            e.preventDefault();
            $form.find('.field').attr('disabled', 'true');

            $.post($(this).attr('action'), $(this).serialize(), 
                function(resp) {
                // $('#feedbackModal').modal('hide');
                }, 'json')
            return false;
        });
        $form.submit();
    });
    $('#feedbackBtn').click(function(e) {
        var $form = $('#feedbackForm');
        $form.find('.field').removeAttr('disabled');
        $form.find('input').val('');
        $form.find('textarea').val('');
    });

    $('#searchBtn').click(function(e) {
        $('#searchForm').submit()
    });

    $('#addNewEntity').click(function(e) {
        var newCard = new App.SummaryCardView({model: new App.SummaryCardModel({})}); 
        var $newCard = newCard.render().$el;
        App.NextCol().prepend($newCard);
    });
});
