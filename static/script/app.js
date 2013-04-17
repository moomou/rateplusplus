'use strict';

$(function() {
    var query = $('#searchInput').val(),
        collection = new App.SummaryCardCollectionView({query:query});

    $('#feedbackForm').submit(function() {
        $(this).ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(formData, jqFOrm, options) {
                formData.push({
                    name: 'csrfmiddlewaretoken',
                    value: $('input[name=csrfmiddlewaretoken]').val(),
                    type: 'text',
                    required: true
                });
                formData.push({
                    name: 'pageurl',
                    value: document.URL,
                    type: 'text',
                    required: true
                });
            },
            success: function(res) {
                if (res == "pass") {
                    $('#feedbackModal').modal('hide');
                }
            },
        });
        return false;
    });

    $('#submitFeedbackForm').click(function(e) {
        $('#feedbackForm').submit();
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
        //hide message box
        $('.message-box').slideUp();

        var newCard = new App.SummaryCardView({model: new App.SummaryCardModel({})}); 
        var $newCard = newCard.render().$el;
        App.NextCol().prepend($newCard);
    });
});
