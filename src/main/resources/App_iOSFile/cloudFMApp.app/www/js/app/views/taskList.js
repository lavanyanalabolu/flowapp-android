window.viewConstructors.taskListView = Backbone.View.extend({ __name__:'window.viewConstructors.taskListView',
  el: '#nebulousContainer',
  startRow: 0,
  pageLength: 5,
  initialize: function () {
    var client = $.parseClient();
    client.taskList = [];
    localStorage_a.setItem('client', client);
    $.getPageHtmlAsync('taskList.html', true, function (tmp) {
      //console.log(tmp)
      this.templates = _.mapObject(_.indexBy($(tmp), 'id'), function (v, k) {
        if (k !== "undefined") return _.template(v.innerHTML);
      });
      this.render();
    }.bind(this));
  },
  nt: false,
  render: function () {
    var currentPage = this;
    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {
      console.log('render');
      this.displayTaskList({
        headerTmp: $.headerTmp
      });
      this.afterRender();
      return this;
    }
  },
  filterText: '',
  taskTypeFilter: '',
  afterRender: function () {
    this.getTasks();
    this.complianceStat();
  },
  events: {
    "tap .btnTaskListFilter": "filterTaskType",
    "tap .btnLoadTask": "loadTask",
    "keypress input#txtFilterTask": "filterTasks",
    "tap .refreshTasks": "getTasks",
    "tap .site-survey-btn": function(){ cordova.InAppBrowser.open($.parseClient().buildingCheckIn.surveyLink, '_blank', 'location=yes'); }
  },
  cleanup: function () {
    this.undelegateEvents();
    $(this.el).empty();
  },
  complianceStat: function () {
    var chartModel = dataClientToken();
    $.when(chartModel.fetch({
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_statutoryCompliance',
      i: $.parseClient().buildingCheckIn.buildingID,
      j: 0,
      k: 0,
      t: '',
      p1: {}
    })).done(function (resp, req) {
      console.log(chartModel, resp, req);
      this.$('.complianceBuildingChart').html(chartModel.get('complianceStat')+'/100');
      this.$('.complianceBuildingChart').peity('donut', {
        "fill": [ "#265D7C", "#12B3D3"],  "innerRadius": 18, "radius": 28
      });
      this.$('.cbcLabel').html(chartModel.get('complianceStat')+'%')
    }.bind(this));
  },
  getTasks: function (callBack) {
    //$('#divClientList, #divUpdateClients').hide();
    $('.loadingTasks').show();
    $('.tasksUl').css('opacity', 0.4);

    var currentPage = this;
    var data = {
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_taskList',
      i: $.parseClient().buildingCheckIn.buildingID,
      j: 0,
      k: 0,
      t: '',
      p1: {}
    };
    $.jWorking('Downloading Tasks', data,
      function (msg) {
        var myData = JSON.parse(msg.d);
        var client = $.parseClient();
        var taskList = this.taskList = client.taskList = myData.data;

        this.reactiveCount = _.filter(taskList, function(t){
        	return(t.taskType!='AutoPPM' && t.taskType!='QuotedWorks');
        });

        this.quotedCount = _.filter(taskList, function(t){
        	return(t.taskType=='QuotedWorks');
        });

        this.ppmCount = _.filter(taskList, function(t){
        	return(t.taskType=='AutoPPM');
        });


        this.updateTaskList();
        this.$('.loadingTasks').hide();
        localStorage_a.setItem('client', client);
      }.bind(this),
      function (msg) {
        console.log(msg);
      }
    );
  },
  displayTaskList: function (taskFilter) {
    var tmp = this.templates.taskListMain;
    window.footerView.footer(this, 'taskList.html', taskFilter);
    var pageBody = tmp(taskFilter);
    this.$el.html(pageBody);
    if (this.nt) {
      $('.nt').css('display', 'inline-block');
    }
    this.nt = true;
    return this;
  },
  updateTaskList: function () {
    var data = {
      taskList: this.taskList,
      filterText: this.filterText,
      taskTypeFilter: this.taskTypeFilter,
      reactiveCount: this.reactiveCount,
      quotedCount: this.quotedCount,
      ppmCount: this.ppmCount
    };
    this.renderListInner(data);
    this.renderListBtns(data);
  },
  renderListInner: function (options) {
    var tmp = this.templates.listInner;
    console.log('listInner', options,tmp);
    this.$('.listInner').html(tmp(options));
  },
  renderListBtns: function (options) {
    var tmp = this.templates.listBtns;
    this.$('.listBtns').html(tmp(options));
  },
  filterTaskType: function (event) {
    var taskType = $(event.currentTarget).attr('data-taskType');
    this.taskTypeFilter = taskType;
    this.updateTaskList();
    //this.displayTaskList({taskTypeFilter:taskType, filterText:''});
  },
  filterTasks: function (event) {
    if (event.keyCode == 13) {
      var filterText = $(event.currentTarget).val();
      //this.displayTaskList({taskTypeFilter:'', filterText:filterText});
    }
  },
  loadTask: function (event) {
    var client = $.parseClient();
    var taskStarted = $.getStartedTaskStatus(client);
    var currentTaskGuid = $.getCurrentTaskGuid(client);
    var taskGuid = $(event.currentTarget).attr('data-taskGuid');
    if (taskStarted == 1 && (currentTaskGuid == taskGuid)) {
      window.location = '#viewTask/visit';
    } else {
      var currentPage = this;
      $('#sideNav').hide();
      var data = {
        clientGuid: $.parseClient().clientGuid,
        auth: localStorage_a.getItem('token'),
        json: {
          actions: [{
            dsName: 'MOBILE_V5_loadTask',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_loadEvents',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_documentList',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_taskPhotos',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_taskAssets',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_meterReadings',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_oddjobList',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_tapTempTypes',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }, {
            dsName: 'MOBILE_V5_BuildingFGas',
            i: 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1: {}
          }]
        }
      };

      $.jMultiWorking('Loading Task', data,
        function (msg) {

          //var myData = JSON.parse(msg.d);
          var myData = msg.d;

          console.log('taskLisMultiData', myData);
          var client = $.parseClient();
          _.each(myData.MOBILE_V5_oddjobList.data, function (v) {
            console.log(v);
            v.status = v.Clip_Status;
          });

          var currentTask = {
            task: myData.MOBILE_V5_loadTask.data,
            events: myData.MOBILE_V5_loadEvents.data,
            documents: myData.MOBILE_V5_documentList.data,
            photos: myData.MOBILE_V5_taskPhotos.data,
            assets: myData.MOBILE_V5_taskAssets.data,
            meterReadings: _.reject(myData.MOBILE_V5_meterReadings.data, {
              meterReadingTypeName: 'Tap Temperatures'
            }),
            tapTemperatures: _.where(myData.MOBILE_V5_meterReadings.data, {
              meterReadingTypeName: 'Tap Temperatures'
            }),
            oddJobs: myData.MOBILE_V5_oddjobList.data,
            buildingFGas: myData.MOBILE_V5_BuildingFGas.data,
            fGasData: [],
            fGasStream: 0,
            RR: {
              riskStatus: 0
            }
          };
          client.tapTempTypes = myData.MOBILE_V5_tapTempTypes.data
          client.currentTask = currentTask;
          localStorage_a.setItem('client', client);
          window.location = '#viewTask/visit';

        },
        function (msg) {
          console.log(msg);
          //alert('could not connect to server');
        }
      );
    }
  }
});
