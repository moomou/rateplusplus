$(function() {
    $('#signin-form').submit(function() {
        $(this).ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(formData, jqFOrm, options) {
            },
            success: function(res) {
                console.log(res); 
                if (res.success) {
                    window.location.href = res.redirect;
                } else {
                    //error, update HTML
                    App.MessageBox(res.errorMessage, "alert-danger");
                }
            },
        });
        return false;
    });

    $('#signup-form').submit(function() {
        debugger;
        $(this).ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(formData, jqFOrm, options) {
            },
            success: function(res) {
                console.log(res); 
                if (res.success) {
                    window.location.href = res.redirect;
                } else {
                    App.MessageBox(res.errorMessage, "alert-danger");
                    //error, update HTML
                }
            },
        });
        return false;
    });
});
