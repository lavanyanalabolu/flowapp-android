App.SlideConstructors.OddJobsSlide = baseView.extend({ __name__:'App.SlideConstructors.OddJobsSlide',
    events:{
        "tap .btn-oddJobList" : "filterOddJobList",
        "tap .btnEditOddJob" : "ShowOddJob",
        "tap .btnBackToOddJobList" : 'backToOddJobList',
        "tap .btnSaveOddJob": "saveOddJob",
        "tap .input-label":function(e){ $('input', e.currentTarget).click(); },
        "change .ojstatus" : function(e){
            //console.log(e)
            !!e.originalEvent && $('.ojstatus').trigger('change');
            var et = $(e.currentTarget);
            et.parent().toggleClass('btn-default', !et.prop('checked')).toggleClass('btn-success', et.prop('checked'))
        }
    },
    initialize: function(){
        this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/OddJobs.html']);
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
                mode: mode,
                headerTmp : headerTmp,
                client: client,
                currentTask: currentTask,
                task: currentTask.task,
                oddJobs: currentTask.oddJobs
            };

            var tmp = this.templates.main;

            var pageBody = tmp(renderParams);

            this.$el.html(pageBody);

            this.renderOJList();

            return this;
        }
    },
    renderFooter: function(taskStarted){
        taskStarted && window.footerView.footer(this, 'OddJobsSlide.html', this.renderParams);
    },
    filterOddJobList : function(e) {
        var el = $(e.currentTarget);
        var btnList = $('.btn-oddJobList');
        var status = el.attr('data-oddJobStatus');
        if (status =="open") {
            $('#openOddJobs').show();
            $('#inProgress').hide();
            $('#completedOddJobs').hide();
        }
        if (status =="completed") {
            $('#completedOddJobs').show();
            $('#openOddJobs').hide();
            $('#inProgress').hide();
        }
        if (status =="inProgress") {
            $('#inProgress').show();
            $('#openOddJobs').hide();
            $('#completedOddJobs').hide();
        }

        if ( btnList.hasClass( "btn-primary" ) ) {
            btnList.removeClass('btn-primary').addClass('btn-default')
        }
        el.addClass('btn-primary').removeClass('btn-default');
    },
    ShowOddJob : function(e) {
        //this.swipe.disable()

        window.routeSlideController.disable();
        var client = $.parseClient();
        var id = $(e.currentTarget).attr('data-odjobId');
        var oddJobs = client.currentTask.oddJobs;
        var clientGuid = client.clientGuid;
        var thisOddJob = _.filter(oddJobs, function(oj) {
            return oj.PK_Clip_Key == id;
        } ).shift();
        var ojParams = _.extend( {
            Clip_Status:"",
            status:"",
            mins:null,
            comments:null,
            headerTmp : $.headerTmp,
            clientGuid: clientGuid
        }, thisOddJob );

        $.getPageHtmlAsync('oddJob.html', false, function(template){
            $('.oddJobContainer').hide();
            $('#oddJob').html( template( ojParams ) ).show()
        });
    },
    saveOddJob: function(e){
        var oddJobID = $(e.currentTarget).attr('data-oddJobID');
        var client = $.parseClient();

        var intRegex = /^\d+$/;
        var saveOK = 1;
        var mins = $('#ojMins' + oddJobID).val();
        var comments = $('#txtOddJobComments' + oddJobID).val();
        var status = $('[name="status' + oddJobID + '"]:checked').val();
        console.log('status',status)
        if(!intRegex.test(mins)) {
            saveOK=0;
            $.jAlert('Odd job minutes ' + mins + ' must be a whole number');
        } else {
            if(!status){
                $.jAlert('Please select a status');
                return false;
            }
            if(!comments){
                $.jAlert('Please enter odd job comments');
            } else {
                //oj.mins = mins;
                for(var i=0;i<client.currentTask.oddJobs.length;i++){
                    if(client.currentTask.oddJobs[i].PK_Clip_Key==oddJobID){
                        pos=i;
                    }
                }
                client.currentTask.oddJobs[pos].mins = mins;
                client.currentTask.oddJobs[pos].comments = comments;
                client.currentTask.oddJobs[pos].status = status;
                if(saveOK){
                    localStorage_a.setItem('client', client);
                    $(e.currentTarget).addClass('btn-success').removeClass('btn-default').html('OK');
                    this.renderOJList();
                    this.backToOddJobList();
                } else {
                    $($('.ojMins' + oddJobID)).focus();
                }
            }
        }
    },
    backToOddJobList : function() {
        //this.swipe.enable()
        window.routeSlideController.enable()

        $('.oddJobContainer').show();
        $('#oddJob').hide()
    },
    renderOJList: function(){
        $.getPageHtmlAsync('oddJobList.html', false, function(tmp){
            this.$('.oddJobList').html(tmp());
        }.bind(this));
    }
});
