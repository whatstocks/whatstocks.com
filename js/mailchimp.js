(function ($) {
    "use strict";
    $('#getInTouch').on('click' , function(e){
        let email = $('input[name="email"]').val();
        if (isEmail(email)) {
            $('.form__errors').html('');
            $('.form__hint--error').html();
            let formFields = $('#subscribe-form').serialize();
            $.ajax({
                url: '.netlify/functions/subscribe',
                type: "POST",
                data: formFields,
                dataType: 'json',
                beforeSend: function() {
                    $('#getInTouch').html('Sending...');
                },
                success: function(data) {
                    localStorage.removeItem('subscribe-form-temp-key');
                    $('#subscribe-form').trigger("reset");
                    if (data.unique_email_id) {
                        $('#getInTouch').html('Get in touch');
                        $('form .subscribe-modal__form-group').hide();
                        $('form .subscribe-modal__form-submit').hide();
                        $('.subscribe-modal__title').html('Thank you for subscription');
                    } else if (data.status == 400) {
                        if (data.title == 'Member Exists' || data.title == "ERROR_CONTACT_EXISTS")  {
                            $('.form__hint--error').html('This email is already a list member');
                        } else if (data.detail!='') {
                            $('.form__hint--error').html(data.detail);
                        }
                    }
                },
                error: function(xhr) {
                    $('.form__errors').html('Something went wrong. Please try again');
                }
            });
        } else {
            $('.form__hint--error').html('Email is not valid');
        }
    });

    $('.subscribe-modal__close-button').on('click' , function(e){
        $('form .subscribe-modal__form-group').show();
        $('form .subscribe-modal__form-submit').show();
        $('.subscribe-modal__title').html('Get notified');
    });
})(jQuery);

function isEmail(email) {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}