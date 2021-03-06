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

            // 用户名输入框发生改变后 去掉用户名和密码的错误提示
            $("#login-username").keyup(function () {
                $(".gi-user").css('color', '');
                $("#login-username").parent().parent().find(".check-u").remove();

                $(".gi-asterisk").css('color', '');
                $("#login-password").parent().parent().find(".check-p").remove();
            });

            // 密码输入框发生改变后 去掉用户名和密码的错误提示
            $("#login-password").keyup(function () {
                $("#login-username").parent().find(".gi-user").css('color', '');
                $("#login-username").parent().parent().find(".check-u").remove();

                $("#login-password").parent().find(".gi-asterisk").css('color', '');
                $("#login-password").parent().parent().find(".check-p").remove();
            });

            // 用户名输入框发生改变后 去掉用户名已存在的提示
            $("#register-username").keyup(function () {
                $("#register-username").parent().find(".gi-user").css('color', '');
                $("#register-username").parent().parent().find(".check-u").remove();
            });

            $('#loginBtn').click(function () {

                // 判断用户名密码 是否为空  不为空才提交到后端验证
                if ($("#login-username").val() == "" || $("#login-password").val() == ""){
                    $("#form-login").submit();
                } else {
                    $.ajax({
                        type: "POST",
                        url: "http://" + location.host + "/loginVerify",
                        data: { username: $("#login-username").val(), password: $("#login-password").val() },
                        dataType: "json",
                        success: function (data) {
                            if (data.success == "1") {
                                $("#form-login").submit();
                            } else if (data.success == "2") {
                                $("#login-username").focus();

                                // 当用户名密码不正确时 给出 提示语句 并将图标 标红
                                $("#login-username").parent().find(".gi-user").css('color', '#e74c3c');
                                $("#login-username").parent().parent().find(".check-u").remove();
                                $("#login-username").parent().after('<div for="login-username" class="animation-slideDown check-u" style="color: #e74c3c;">用户名或者密码不正确</div>');

                                $("#login-password").parent().find(".gi-asterisk").css('color', '#e74c3c');
                                $("#login-password").parent().parent().find(".check-p").remove();
                                $("#login-password").parent().after('<div for="login-password" class="animation-slideDown check-p" style="color: #e74c3c;">用户名或者密码不正确</div>');
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    }); 
                }
            });

            $('#registerBtn').click(function () {
                var username = $("#register-username").val(), email = $("#register-email").val(), password = $("#register-password").val(), 
                    passwordVerify = $("#register-password-verify").val();

                // 判断用户名密码 是否为空  不为空才提交到后端验证
                if (username == "" || email == "" || password == "" || passwordVerify == "") {
                    $("#form-register").submit();
                } else {
                    $.ajax({
                        type: "POST",
                        url: "http://" + location.host + "/registerVerify",
                        data: { username: username, email: email, password: password },
                        dataType: "json",
                        success: function (data) {
                            if (data.success == "1") {
                                $("#form-register").submit();
                            } else if (data.success == "2") {
                                $("#register-username").val("");
                                $("#register-username").focus();

                                // 当用户名已经存在时 给出 提示语句 并将图标 标红
                                $("#register-username").parent().find(".gi-user").css('color', '#e74c3c');
                                $("#register-username").parent().parent().find(".check-u").remove();
                                $("#register-username").parent().after('<div for="register-username" class="animation-slideDown check-u" style="color: #e74c3c;">用户名已存在,请重新输入</div>');
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }
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