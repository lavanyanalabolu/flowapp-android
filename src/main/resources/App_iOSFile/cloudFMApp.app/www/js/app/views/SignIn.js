window.viewConstructors.SignInView = Backbone.View.extend({ __name__:'window.viewConstructors.SignInView',
    el: '#nebulousContainer',
    initialize: function () {
        //this.employeeList = new models.EmployeeCollection();
        this.render();
    },

    render: function () {
        $.getPageHtmlAsync('signIn.html', false, function(tmp){
            this.$el.html(tmp());
        }.bind(this));
		return this;
    },
    events: {
        //"tap #btnAuthenticate": "authenticate2",
        "tap #btnRegister": "register",
        "tap #btnUpdates": "updates",
        //"keypress #passcodeSignIn" : "authenticateEV",
        "tap .btnForgotPassword": "forgotPassword",
        "submit #loginForm": "authenticate2",
		"tap #loginBtn": function(e){ this.$('#loginForm').submit(); },
        "submit #frmResendPassword" : "resendPassword"
    },
    authenticate2 : function(){
		var _v = this;
        $('#divBadLogin').hide();
        $('#divAttempt').html('Authenticating...').fadeIn();
        var formData = $('#loginForm').serializeObject();
        console.log(formData);

        $.jGeneric('Authenticating ...', 'mobileLogin', formData , function(msg) {

            var loginResponse = msg.d;
            localStorage_a.setItem('mobileNumber', formData.signInMobile);

            console.log('OK');
            console.log(msg);
            $('#btnAuthenticate').show();
            $('#divLoginProgress').hide();

            if(loginResponse.success===1){

				_v.downloadClients2(loginResponse.mobileGUID);

                localStorage_a.setItem('token', loginResponse.mobileGUID);
                localStorage_a.setItem('userName', loginResponse.userName);
                localStorage_a.setItem('publicGUID', loginResponse.publicGUID);

                $.loadPermissions(function(){
                    console.log('going HOME');
                    window.location='#home';
                },
                function(err){
					console.log('errrroorrr', err);
                    //window.location='#login';
                });
            } else {
                $('#divAttempt').hide();
                $('#divBadLogin').html(loginResponse.messageText).fadeIn();
            }

        },function(msg){
            console.log(msg);
        });
        return(false);
    },
	downloadClients2: function(token){
        var data = {
            auth : token,
            dsName : 'CIRRUSMODE_availableClients',
            i : 0,
            j: 0,
            k: 0,
            t: '',
            p1 : {}
        };
        $.jAdminWorking('Downloading Available Clients', data,
            function(msg) {
                var myData = JSON.parse(msg.d);
				localStorage_a.setItem('clients', myData.data);
            },
            function(msg) {
                console.log(msg);
                window.location='#home';
            }
        );
        return(false);
    },

    forgotPassword : function() {
        $('#resdivAttempt').hide();
        $('.showFp').fadeToggle();
        $('#loginPanel').fadeToggle();
    },

    register : function() {
       window.location='#register';
    },

    resendPassword : function(){
        console.log('im here!');
        var formData = $('#frmResendPassword').serializeObject();
        console.log(formData);

        $.jGeneric('Loading ...','rsendpascode',formData , function(msg) {
            var status = msg.status;
            if(status =="Ok"){
                $('#resdivAttempt').text('Your Pin Number is Being Sent').show().fadeIn().removeClass('alert-danger').addClass('alert-success');
                $('.showFp').fadeOut(2000,function(){
                    $('#loginPanel').show();
                });
            }
            if(status =="Error"){
                $('#resdivAttempt').text('Your Mobile number Is Not Recognised').show().fadeIn().removeClass('alert-success').addClass('alert-danger');
            }

            if(status =="Deactivated"){
                $('#resdivAttempt').text('User Deactivated').show().fadeIn().removeClass('alert-success').addClass('alert-danger');
            }

        },function(msg){
        });
        return(false);
    }
});
