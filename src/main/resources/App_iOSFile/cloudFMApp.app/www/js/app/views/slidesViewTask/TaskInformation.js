App.SlideConstructors.TaskInformationSlide = baseView.extend({ __name__:'App.SlideConstructors.TaskInformationSlide',
	events:{
		"tap  .building" : "showBuildingDetails",
		"tap .showPPMlIst" : "showPPMlIst",
        "tap .btnAbandonTask": "abandonTask",
        "tap .btnAbandonTaskNo": "abandonTaskNo",
        "tap .btnAbandonTaskYes": "abandonTaskYes",
        "tap .backToTaskDetails" : "showTaskDetails",
        "tap .col-xs-3.sh": function(e){
            console.log('secondEveents');
        },
        "tap .slideHeaderRow": function(e){
            console.log('thirdEveents');
        },
        "tap .liLinkToTab": function(e){
    			//window.location = '#viewTask/' + this.renderParams.mode + '/' + $(e.currentTarget).attr('data-buttonset')
    			window.routeSlideController.slideTo($(e.currentTarget).attr('data-buttonSet'));
    		}
	},
	initialize: function(){
        this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/TaskInformation.html']);
	},
	render: function (mode) {
      var currentPage = this;
      if ( !localStorage_a.getItem('client') ) {
          window.location='#setClient';
      } else {
          var headerTmp = $.headerTmp,
              client = $.parseClient(),
              currentTask = client.currentTask;

          var renderParams = this.renderParams = {
              mode : mode,
              headerTmp : headerTmp,
              client: client,
              currentTask: currentTask,
              task: currentTask.task,
              t: currentTask.task[0]
          };

          var tmp = this.templates.TaskInformationSlide,
              pageBody = tmp(renderParams);

        this.$el.html(pageBody);



          return this;
      }
    },
    showTaskDetails : function() {
        //this.swipe.enable()
        window.routeSlideController.enable()

        $('#taskDetails').show()
        $('.buildingDetails').hide()
    },
    abandonTask: function(e){
        $(e.currentTarget).hide();
        $('#abandoner').show();
        $('#taskDetails').hide();
        window.routeSlideController.disable()
       // $('abandoner').fadeIn();
        //$.overlayer('#abandoner', true, '#mainSection, #divTaskCardFooter')
    },
    abandonTaskNo: function(e){
        //$.overlayer('#abandoner', false, '#mainSection, #divTaskCardFooter')
        $('#taskDetails').show();
        $('#abandoner').hide();
        window.routeSlideController.enable()
        $('.btnAbandonTask').show();
    },
    abandonTaskYes: function(e){

        $('#divClientList, #divUpdateClients').hide();
        $('#divLoadingQRList').show();
        var client = $.parseClient();
        var currentPage = this;
        var data = {
            clientGuid : $.parseClient().clientGuid,
            auth : localStorage_a.getItem('token'),
            dsName : 'MOBILE_V5_abandonVisit',
            i : client.currentTask.resourceID,
            j: 0,
            k: 0,
            t: '',
            p1 : {}
        };

        $.jWorking('Abandoning visit', data,
            function(msg) {
                localStorage_a.unsub('storageEvent', 'renderFinish');

                localStorage_a.removeItem('taskTime');
                !!App.taskTimer && App.taskTimer.replaceWith( App.curVerEl || localStorage_a.getItem('curVerEl') );

                client.currentTask = undefined;
                localStorage_a.setItem('client', client);
                currentPage.getTasks();
            },
            function(msg) {
                console.log(msg);
                //alert('could not connect to server');
            }
        );
    },
    renderFooter: function(taskStarted){
        taskStarted && window.footerView.footer(this, 'TaskInformationSlide.html', this.renderParams);
    },
	   showBuildingDetails : function() {
        $('#taskDetails').hide()
        $('.buildingDetails').show()
        //this.swipe.disable()
        window.routeSlideController.disable()

    },
    showPPMlIst : function() {
        //this.swipe.slide(4,500)
        window.routeSlideController.slideTo('PPMAssetList')
    },
    getTasks: function(){
        $('#divClientList, #divUpdateClients').hide();
        $('#divLoadingQRList').show();

        var currentPage = this;
        var data = {
            clientGuid : $.parseClient().clientGuid,
            auth : localStorage_a.getItem('token'),
            dsName : 'MOBILE_V5_taskList',
            i : $.parseClient().buildingCheckIn.buildingID,
            j: 0,
            k: 0,
            t: '',
            p1 : {}
        };

        $.jWorking('Downloading Tasks', data,
            function(msg) {
                var myData = JSON.parse(msg.d);
                var client = $.parseClient();
                client.taskList = myData.data;
                localStorage_a.setItem('client', client);
                window.location='#taskFinished';
            },
            function(msg) {
                console.log(msg);
                //alert('could not connect to server');
            }
        );
    }
});
