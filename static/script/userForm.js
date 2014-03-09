$(function() {
    $('#signinForm').submit(function() {
        $(this).ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(formData, jqFOrm, options) {
            },
            success: function(res) {
                console.log(res); 
                if (res.redirect) {
                    window.location.href = res.redirect;
                }
                else {
                    //error, update HTML
                }
            },
        });
        return false;
    });

    $('#signupForm').submit(function() {
        $(this).ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(formData, jqFOrm, options) {
            },
            success: function(res) {
                console.log(res); 
                if (res.redirect) {
                    window.location.href = res.redirect;
                }
                else {
                    //error, update HTML
                }
            },
        });
        return false;
    });
});
