App.SlideConstructors.EventHistorySlide = baseView.extend({ __name__:'App.SlideConstructors.EventHistorySlide',
    initialize: function(){
        this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/EventHistory.html']);
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

            var tmp = this.templates.main;
            var pageBody = tmp(renderParams);
            this.$el.html(pageBody);

            //throw 'error';
            return this;
        }
    },
    renderFooter: function(taskStarted){
        taskStarted && window.footerView.footer(this, 'EventHistorySlide.html', this.renderParams);
    }
});
