/*
 *  Document   : login.js
 *  Author     : pixelcave
 *  Description: Custom javascript code used in Login page
 */

var Login = function() {

    // Function for switching form views (login, reminder and register forms)
    var switchView = function(viewHide, viewShow, viewHash){
        viewHide.slideUp(250);
        viewShow.slideDown(250, function(){
            $('input').placeholder();
        });

        if ( viewHash ) {
            window.location = '#' + viewHash;
        } else {
            window.location = '#';
        }
    };

    return {
        init: function() {
            /* Switch Login, Reminder and Register form views */
            var formLogin       = $('#form-login'),
                formReminder    = $('#form-reminder'),
                formRegister    = $('#form-register');

            $('#link-register-login').click(function(){
                switchView(formLogin, formRegister, 'register');
            });

            $('#link-register').click(function(){
                switchView(formRegister, formLogin, '');
            });

            $('#link-reminder-login').click(function(){
                switchView(formLogin, formReminder, 'reminder');
            });

            $('#link-reminder').click(function(){
                switchView(formReminder, formLogin, '');
            });

            $('#loginBtn').click(function () {
                alert(location.host);
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/loginVerify",
                    data: { username: $("#login-username").val(), password: $("#login-password").val() },
                    dataType: "json",
                    success: function (data) {
                        if(data.success == "1"){
                            $("#form-login").submit();
                        } else if (data.success == "2"){
                            alert("用户名或密码错误");
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                }); 
            });

            // If the link includes the hashtag 'register', show the register form instead of login
            if (window.location.hash === '#register') {
                formLogin.hide();
                formRegister.show();
            }

            // If the link includes the hashtag 'reminder', show the reminder form instead of login
            if (window.location.hash === '#reminder') {
                formLogin.hide();
                formReminder.show();
            }

            /*
             *  Jquery Validation, Check out more examples and documentation at https://github.com/jzaefferer/jquery-validation
             */

            /* Login form - Initialize Validation */
            $('#form-login').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function(e) {
                    e.closest('.form-group').removeClass('has-success has-error');
                    e.closest('.help-block').remove();
                },
                rules: {
                    'login_username': {
                        required: true
                    },
                    'login_password': {
                        required: true,
                        minlength: 5
                    }
                },
                messages: {
                    'login_username': '请输入用户名',
                    'login_password': {
                        required: '请输入密码',
                        minlength: '您的密码长度不能小于5位'
                    }
                }
            });

            /* Reminder form - Initialize Validation */
            $('#form-reminder').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function(e) {
                    e.closest('.form-group').removeClass('has-success has-error');
                    e.closest('.help-block').remove();
                },
                rules: {
                    'reminder_email': {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    'reminder_email': '请输入您账号的邮箱'
                }
            });

            /* Register form - Initialize Validation */
            $('#form-register').validate({
                errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    e.parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                    $(e).closest('.help-block').remove();
                },
                success: function(e) {
                    if (e.closest('.form-group').find('.help-block').length === 2) {
                        e.closest('.help-block').remove();
                    } else {
                        e.closest('.form-group').removeClass('has-success has-error');
                        e.closest('.help-block').remove();
                    }
                },
                rules: {
                    'register_username': {
                        required: true,
                        minlength: 2
                    },
                    'register_email': {
                        required: true,
                        email: true
                    },
                    'register_password': {
                        required: true,
                        minlength: 5
                    },
                    'register_password_verify': {
                        required: true,
                        equalTo: '#register-password'
                    },
                    'register_terms': {
                        required: true
                    }
                },
                messages: {
                    'register_username': {
                        required: '请输入用户名',
                        minlength: '请输入用户名'
                    },
                    'register_email': '请输入邮箱',
                    'register_password': {
                        required: '请输入密码',
                        minlength: '您的密码长度不能小于5位'
                    },
                    'register_password_verify': {
                        required: '请再次输入密码',
                        minlength: '您的密码长度不能小于5位',
                        equalTo: '您的两次密码输入不一致'
                    },
                    'register_terms': {
                        required: '请接受以上条款!'
                    }
                }
            });
        }
    };
}();