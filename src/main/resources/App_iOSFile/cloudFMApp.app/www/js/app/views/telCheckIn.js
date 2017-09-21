window.viewConstructors.TelCheckInView = Backbone.View.extend({ __name__:'window.viewConstructors.TelCheckInView',
    el: '#nebulousContainer',
    initialize: function(){
    	this.render();
    },
    render: function(){
    	var client = $.parseClient();
    	if(!!client.config){
			$.getPageHtmlAsync('telCheckIn.html', false, function(tmp){
				window.footerView.footer(this, 'telCheckIn.html', { checkInTel:client.config.checkInTel, helpdeskTel: client.config.helpdeskTel, clientName: client.clientName });
		    	var pageBody = tmp({ checkInTel:client.config.checkInTel, helpdeskTel: client.config.helpdeskTel, clientName: client.clientName });
		        this.$el.html(pageBody);
			}.bind(this));
	    }else{
	    	window.location = "#setClient"
	    }
    },
    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    }
});
