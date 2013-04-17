
$(function() {
    $('#signinForm').submit(function() {
        $(this).ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(formData, jqFOrm, options) {
            },
            success: function(res) {
                console.log(res); 
            
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
            },
        });
        return false;
    });
});
