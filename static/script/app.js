//'use strict';
pageView = undefined;

$(function() {
    // Initiate the router
    var searchView = window.location.search,
        $mediaQuery = $('#mediaQuery');

    //only enable side menu if on small screen
    if (false) { //$mediaQuery.css('display') !== "none") {
        $('#sidr').sidr();
        $('.sideMenuContainer').show();

        $('#sideMenu').click(function(e) {
            $.sidr('toogle', 'sidr');
        });
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
});
