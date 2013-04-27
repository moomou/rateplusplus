'use strict';

$(function() {
    var query = $('#searchInput').val(),
        searchView = undefined,
        cmtCollectionView = undefined, 
        pathname = window.location.pathname.split('/'),
        id = pathname[pathname.length-1];

    if (window.location.search) {
        searchView = new App.SearchResultView({query:query});
    }
    else {
        searchView = new App.SearchResultView({id:parseInt(id)}); //search for particular id
        cmtCollectionView = new App.CommentCollectionView({entityId:id});
    }

    $('#feedbackForm').submit(function() {
        $(this).ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(formData, jqFOrm, options) {
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
                else {
                    //TODO - Update User
                }
            },
        });
        return false;
    });

    $('#submitComment').click(function(e) {
        var cmtForm = $('#commentForm'),
            content = cmtForm.find('input[name=content]'),
            btn = $(this);

        if (!content.val()) {
            return;
        }

        btn.button('loading');

        var newComment = new App.CommentModel({});
    
        newComment.set('content', content.val());
        newComment.set('private', cmtForm.find('input[name=private]').is(':checked'));
        newComment.set('entityId', id);

        newComment.save({}, {
            success: function(response) {
                content.val('');
                btn.button('reset');
                cmtCollectionView.update(response);
            },
            error: function(response) {
            },
        });
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
        var $newCard = newCard.render(true).$el;
        App.ColManager.nextCol('card').prepend($newCard);
    });
});
