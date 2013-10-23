//'use strict';
pageView = undefined;

$(function() {
    var searchView = window.location.search,
        $mediaQuery = $('#mediaQuery');

    $('#feedbackForm').submit(function() {
        $(this).ajaxSubmit({
            dataType: 'json',
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

    var appRouter = new App.AppRouter();
});
