App.SlideConstructors.SiteSpecificNoteSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.SiteSpecificNoteSlide',
	initialize : function(){
		var currentPage = this;
        if ( !localStorage_a.getItem('client') ){
            window.location='#setClient';
        } else {
            var headerTmp = $.headerTmp;
            var client = $.parseClient(),
                currentTask = client.currentTask;

            var renderParams = this.renderParams = {
                headerTmp : headerTmp,
                client: client,
                currentTask: currentTask
            }
		}
	},
	render: function (mode) {
        var tmp = window.App.viewTaskSlides['viewTaskSlides/SiteSpecificNote.html'];
            var pageBody = tmp(this.renderParams);
            this.$el.html(pageBody);

        return this;
    },
    renderFooter: function(taskStarted){
        taskStarted && window.footerView.footer(this, 'SiteSpecificNoteSlide.html', this.renderParams);
    },
	events : {
		"tap #RAMUpload" : function(){
			$.updateTaskInfo('RR', { riskStatus: 3 });
			routeSlideController.mainView.trigger('advanceRR');
		}
	}
});
