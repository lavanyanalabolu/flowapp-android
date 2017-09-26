App.SlideConstructors.MeterReadingsSlide = baseView.extend({ __name__:'App.SlideConstructors.MeterReadingsSlide',
	events: {
		"tap .btnSaveMeterReadings": "saveMeterReadings",
	},
    initialize: function(){
        this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/MeterReadings.html']);
    },
    render: function (mode) {
        var currentPage = this;
        if ( !localStorage_a.getItem('client') ) {
            window.location='#setClient';
        } else {
            var headerTmp = $.headerTmp;
            var client = $.parseClient(),
                currentTask = client.currentTask;
            console.log(currentTask.meterReadings)
            var renderParams = this.renderParams = {
                mode: mode,
                headerTmp : headerTmp,
                client: client,
                currentTask: currentTask,
                task: currentTask.task,
                meterReadings: currentTask.meterReadings
            }

            var tmp = this.templates.main;
            var pageBody = tmp(renderParams);
            this.$el.html(pageBody);
            return this;
        }
    },
    renderFooter: function(taskStarted){
        taskStarted && window.footerView.footer(this, 'MeterReadingsSlide.html', this.renderParams);
    },
	saveMeterReadings: function(){
        var client = $.parseClient();

        var intRegex = /^\d+$/;
        var saveOK = 1;

        _.each(client.currentTask.meterReadings, function(mr){
            var meterReading = $('.txtMeterReadingID' + mr.meterReadingID).val();

            if(!intRegex.test(meterReading)) {
                saveOK=0;
               $.jAlert('Meter reading ' + meterReading + ' must be a whole number');
            } else {
				mr.meterReading = meterReading;
            }
        });
        if(saveOK){
            localStorage_a.setItem('client', client);
			$.jSuccess('Thank you. Meter readings have been saved to device');
            //$('#spnMeterReadingsSaved').fadeIn();
        } else {
            //$('#spnMeterReadingsSaved').hide();
        }
    },
});
