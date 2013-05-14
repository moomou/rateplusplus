//'use strict';
pageView = undefined;

$(function() {
    var query = $('#searchInput').val(),
        cmtCollectionView = undefined, 
        pathname = window.location.pathname.split('/'),
        id = pathname[pathname.length-1],
        searchView = window.location.search,
        sideMenuOpen = false,
        $mediaQuery = $('#mediaQuery');

    //only enable side menu if on small screen
    if ($mediaQuery.css('display') !== "none") {
        $('#sidr').sidr();
        $('.sideMenuContainer').show();
        $('#sideMenu').click(function(e) {
            if (!sideMenuOpen) {
                $.sidr('open','sidr');
            }
            else {
                $.sidr('close','sidr');
            }
            sideMenuOpen = !sideMenuOpen; 
        });
    }
    
    //if on general search page
    if (searchView) {
        pageView = new App.PageView({query:query});
    } //on specific page
    else {
        pageView = new App.PageView({id:parseInt(id)}); //search for particular id
        cmtCollectionView = new App.CommentCollectionView({entityId:id});
    }

    $('#sortBtn').click(function(e) {
        var sortBy = e.target.getAttribute('data-sortBy');
        if (sortBy) {
            App.ColManager.resetCol();
            pageView.collection.sortByX({'prop': sortBy});
            pageView.render();
        }
    });

    $('#filterBtn').click(function(e) {
        var filterBy = e.target.getAttribute('data-filterBy');
        if (searchView) { //filter on summary card
        }
        else { //filter on attr
        }
    });

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
        newCard = new App.SummaryCardView({model: new App.SummaryCardModel({})}); 
        App.ColManager.nextCol('card').prepend(newCard.render().$el);

        //manually activate edit mode
        newCard.model.set('editable',true);
        newCard.render(true);
    });
});
