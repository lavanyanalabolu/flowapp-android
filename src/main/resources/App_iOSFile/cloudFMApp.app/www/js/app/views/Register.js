window.viewConstructors.RegisterView = Backbone.View.extend({ __name__:'window.viewConstructors.RegisterView',
    el: 'body',
    initialize: function () {
        //this.employeeList = new models.EmployeeCollection();
        this.render();
    },

    render: function () {
        $.getPageHtmlAsync('Register.html', false, function(tmp){
            this.$el.html(tmp());
        }.bind(this));
		return this;
    },

    events: {
        "tap #btnRegister": "register"
    },

    register: function() {

        var adminAuthKey = 'TheRainbowConnection';
        var regMobile = $('#mobileNo').val();
        var regEmail = $('#email').val();
        var regFirstName = $('#firstName').val();
        var regSurName = $('#surname').val();
        var regCompany = $('#company').val();
        var skillset = $('#skills').val();
        var provider = $('#networkProvider').val();

        $.ajax({
            type: "POST",
            async: true,
            imeout:8000,
            contentType: "application/json; charset=utf-8",
            url: sessionStorage.wsRootAdmin + "/jsonPortal.asmx/RegisterNew?" + (new Date()).getTime(),
            data: '{"adminAuthKey": "' + adminAuthKey + '", "regMobile": "' + regMobile + '", "regEmail": "' + regEmail + '", "regFirstName": "' + regFirstName + '", "regSurName": "' + regSurName + '","regCompany": "' + regCompany + '", "regSkills": "' + skillset + '", "regProvider": "' + provider + '"}',
            dataType: "json",
            success: function(msg) {
                alert('Response from server : ' +  msg.d.authResponse, function(){});
                console.log(msg.d.success)
                if(msg.d.success==1){
                    window.location='#login';
                    localStorage_a.setItem('mobileNumber', regMobile);
                }
            },
            error: function(msg) {
                //alert('Could not connect to registration server!', function(){});
            }
        });
    }

});
