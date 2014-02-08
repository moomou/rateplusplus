//'use strict';
pageView = undefined;

$(function() {
    var searchView = window.location.search,
        $mediaQuery = $('#mediaQuery');
        body = document.body,
        timer = 0;

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

    $('#navBtns li').tooltip({placement: 'bottom'});

    window.addEventListener('scroll', function() {
      var localHeader = $('#local-header');

      clearTimeout(timer);

      /*
      if ($(window).scrollTop() >= localHeader.offset().top) {
          console.log("!");
          localHeader.css({
              position: 'fixed',
              top: '0',
              left: '0'
          });
      }
      else {
        localHeader.css({position: ''});
      }*/

      if(!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover')
      }

      timer = setTimeout(function() {
          body.classList.remove('disable-hover')
      },500);

    }, false);
});
