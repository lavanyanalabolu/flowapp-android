App.SlideConstructors.ClosingSeveritySlide = Backbone.View.extend({ __name__:'App.SlideConstructors.ClosingSeveritySlide',
	events:{
		"tap .btnSeverity": "chooseSeverity",
	},
    render: function (mode) {
        var currentPage = this;
        if ( !localStorage_a.getItem('client') ) {
            window.location='#setClient';
        } else {
            var headerTmp = $.headerTmp;
            var client = $.parseClient(),
                currentTask = client.currentTask;

            var renderParams = this.renderParams = {
                mode : mode,
                headerTmp : headerTmp,
                client: client,
                currentTask: currentTask,
                task: currentTask.task,
                events: currentTask.events
            }

            var tmp = window.App.viewTaskSlides['viewTaskSlides/ClosingSeverity.html'];

                var pageBody = tmp(renderParams);

                this.$el.html(pageBody);


            return this;
        }
    },
    renderFooter: function(taskStarted){
        taskStarted && window.footerView.footer(this, 'ClosingSeveritySlide.html', this.renderParams);
    },
	chooseSeverity: function(event){
        var worksSeverity = $(event.currentTarget).attr('data-worksSeverity');
        var client = $.parseClient();
        client.currentTask.finishTask.worksSeverity = worksSeverity;

        localStorage_a.setItem('client', client);
        $('.btnSeverity').find('span').css('visibility', 'hidden');
        $(event.currentTarget).find('span').css('visibility', 'visible');
    }
});
