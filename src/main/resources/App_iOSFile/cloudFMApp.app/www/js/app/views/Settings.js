window.viewConstructors.SettingsView = Backbone.View.extend({ __name__:'window.viewConstructors.SettingsView',
   el: '#nebulousContainer',
    initialize: function () {
        this.render();
    },

    render: function () {
        var currentPage = this;
        console.log('im here!');
        $.getPageHtmlAsync('mainMenu2.html', false, function(tmp){
    		window.footerView.footer(this, 'mainMenu2.html', {});
            this.$el.html(tmp({currentPage:currentPage}));
        }.bind(this));
		return this;
    },
    events: {
        "tap .btnExitMenu": "goBack",
        "tap .btnUpdate": "update",
        "tap #btnDataReset": "resetData",
        "tap .btnSendErrorLog" : function(){ $.errorLogging.mailLogs(); },
    		"tap #btnRefreshApp": function(){
    			window.location.reload();
    		}
    },

    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },

    goBack: window.App.goBack,

    update: function() {
        serverPath = $('#txtServerPath').val();
        localStorage.proximityValue = $('#txtProximity').val();
        serverPath = serverPath;
        window.proximityMax = localStorage.proximityValue;
        alert('Updated Values');
        console.log(serverPath);
        console.log(localStorage.proximityValue);
        window.location='#home';
    },
    resetData: function() {
        console.log(localStorage);
        localStorage_a.removeItem('ajaxActive');
        localStorage_a.removeItem('client');
        localStorage_a.removeItem('clients');
        localStorage_a.removeItem('currentURL');
        localStorage_a.removeItem('EngineerGuid');
        localStorage_a.removeItem('hashChain');
        localStorage.setItem('proximityValue', "1");
        localStorage.setItem('serverPath', localStorage_a.getItem('originalServerPath'));
        localStorage_a.removeItem('synchActive');
        localStorage_a.removeItem('synchTimerInterval');
        localStorage_a.removeItem('uploadCache');
        console.log(localStorage);
        alert('Data storage cleared - restarting');
		    window.location = '#home';
        return false;
    }

});
