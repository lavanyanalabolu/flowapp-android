window.viewConstructors.viewTaskControllerView = Backbone.View.extend({ __name__:'window.viewConstructors.viewTaskControllerView',
  el: '#nebulousContainer',
  swipe: null,
  initialize: function (mode, subroute) {

    var currentView = this,
      client = $.parseClient(),
      currentTask = client.currentTask,
      RAMModel = Model.extend({
        idAttribute: 'ramsGUID',
        defaults: {
          selected: false
        },
        initialize: function () {
          this.on('change', function (_m) {
            var cl = $.parseClient();
            cl.currentTask.ramDocs = _m.collection.toJSON();
            localStorage_a.setItem('client', cl);
          });
        }
      });


    if (!currentTask || !currentTask.task) {
      window.location = "#home";
      return false;
    }
    var renderParams = this.renderParams = {
      mode: mode,
      client: client,
      currentTask: currentTask,
      task: currentTask.task,
      ramCol: new(Collection.extend({
        model: RAMModel
      }))()
    };

    if (!!currentTask.ramDocs) {
      renderParams.ramCol.set(client.currentTask.ramDocs);
    }

    routeSlideController.setRouter(App.Subrouters.viewTask, subroute, renderParams);

    var omitSlides = ['AllocatedVisits'];

    omitSlides.push('RiskAssessment', 'RamsDocuments', 'SiteSpecificNote');

    var cguid = localStorage_a.getItem('contractorGUID');
    if (cguid !== '5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38' && cguid !== 'FD705377-B172-49B6-805F-05E7C916BFB8') {
      omitSlides.push('NextVisitNotes', 'AuditReactive');
    }

    if (!currentTask.meterReadings.length) omitSlides.push('MeterReadings');
    if (!currentTask.tapTemperatures || !currentTask.tapTemperatures.length) omitSlides.push('TapTemperatures');
    if (!currentTask.oddJobs.length) omitSlides.push('OddJobs');
    if (!$.getAppPermission('fGas') || !parseInt(currentTask.task[0].isFGas)) omitSlides.push('FGas');
    if (currentTask.task[0].taskType !== 'AutoPPM') omitSlides.push('PPMAssetList', 'AuditReactive');

    console.log(subroute, omitSlides);

    if (currentTask.finishTask) {

      !App.curVerEl && (App.curVerEl = $('.spanCurrentVersion')) && localStorage_a.setItem('curVerEl', App.curVerEl[0].outerHTML);
      App.taskTimer = new $.taskTimer();
      $('.spanCurrentVersion').replaceWith(App.taskTimer);

      routeSlideController.finishTask = true;

      if (!$.getAppPermission('ForceRiskAssessment') || currentTask.RR.riskStatus === 4) {
        routeSlideController.slideFilter(omitSlides, true, subroute || 0); //.slideTo(subroute || 2);


      } else {
        var pickSlides = ['RiskAssessment'];
        routeSlideController.slideFilter(pickSlides, false, 0);

        this.listenTo(routeSlideController.mainView, 'finishRiskAssessment', this.finishRiskAssessment);
        this.listenTo(routeSlideController.mainView, 'advanceRR',
          function () {
            var s = $.parseClient().currentTask.RR.riskStatus;
            var slideArr = {
              "1": ['RamsDocuments'],
              "1.5": ['RamsDocuments'],
              "2": ['SiteSpecificNote'],
              "3": ['Documents'],
              "4": omitSlides
            }[s];
            routeSlideController.slideFilter(slideArr, s === 4, 0);
          }
        );
      }

    } else {
      routeSlideController.finishTask = false;
      routeSlideController.slideFilter(["TaskInformation", "EventHistory", "Photos", "Documents", "PPMAssetList"], false, subroute || 0);
      window.footerView.footer(this, 'viewTaskController.html', renderParams);
      this.listenTo(routeSlideController.mainView, 'refooter', this.refooter);
    }

  },
  finishRiskAssessment: function () {
    var _v = this;
    var RA = {
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_completeHSVisit',
      i: 0,
      j: 0,
      k: 0,
      t: this.renderParams.currentTask.taskGuid,
      p1: _.extend(_.object(_.map($.parseClient().currentTask.riskAssessment, function (ob) {
        return [ob.name, ob.value];
      })), {
        checkInID: $.parseClient().buildingCheckIn.checkInID,
        passedAssessment: 1,
        comments: $.parseClient().currentTask.RR.comments
      })
    };
    $.jWorking('Completing risk assessment ...', RA, function (resp) {
      data = JSON.parse(resp.d).data[0];
      $.updateTaskInfo('RR', {
        riskStatus: 4
      });
      console.log(_v.renderParams.ramCol);
      _v.sendRams(data.visitRiskAssessmentID, _v.renderParams.ramCol);
      routeSlideController.mainView.trigger('advanceRR');
    }, function (err) {});
  },
  sendRams: function (visitRiskAssessmentID, ramCol) {
    var client = $.parseClient();
    if (client.currentTask.ramDocs && client.currentTask.ramDocs.length) {
      var ramstring = ramCol.reduce(function (memo, ram) {
        if (ram.get('selected') === true) {
          return memo + ram.get('ramsGUID') + ',';
        } else {
          return memo + '';
        }
      }, '');
      var ramData = {
        clientGuid: client.clientGuid,
        auth: localStorage_a.getItem('token'),
        dsName: 'MOBILE_V5_linkVisitToRAMS',
        i: 0,
        j: 0,
        k: 0,
        t: '',
        p1: {
          visitRiskAssessmentID: visitRiskAssessmentID,
          ramsList: ramstring.substring(0, ramstring.length - 1)
        }
      };
      $.jWorking('Sending RAMs data', ramData,
        function (msg) {
          var myData = JSON.parse(msg.d).data;
          console.log('ramComplete');
          console.log(myData);
        },
        function () {

        });
    }
  },
  photoFullscreen: 0,
  events: {
    "tap div.divPhotoContainer": "toggleFullScreenPhotos",
    "tap .btnTaskList": "taskList",
    "tap .btnBeginTask": "beginTask",
    "tap .btnExit": "home",
    "keypress #photoDOC_Desc, #DOC_Desc": "cancelEnterSubmit",
    "focus .inputKill": function(e){ $(e.target).blur(); }
  },
  refooter: function () {
    window.routeSlideController.enable();
    window.footerView.footer(this, 'viewTaskController.html', this.renderParams);
  },
  cancelEnterSubmit: function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      return false;
    }
  },
  home: function () {
    var client = $.parseClient();
    client.currentTask = undefined;
    localStorage_a.setItem('client', client);
    window.location = '#home';
  },
  primeDocumentUpload: function () {
    $('#btnSelectImage').hide();
    $('#btnUploadDocument').show();
    $('#btnUploadDocument').show();
  },
  taskList: function () {
    window.location = '#taskList';
  },
  beginTask: function (event) {
    $('.btnBeginTask').prop('disabled', true);
    var client = $.parseClient();

    var checkInID = client.buildingCheckIn.checkInID;
    var taskGuid = $(event.currentTarget).attr('data-taskGuid');
    var currentPage = this;
    var data = {
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      json: {
        actions: [{
          dsName: 'MOBILE_V5_beginTask',
          i: 0,
          j: 0,
          k: 0,
          t: taskGuid,
          p1: {
            checkInID: checkInID,
            appVersion: localStorage_a.getItem('version').versionID
          }
        }]
      }

    };

    $.jMultiWorking('Starting Task ...', data,
      function (msg) {
        console.log(msg.d.MOBILE_V5_beginTask);
        var myData = msg.d.MOBILE_V5_beginTask;
        var client = $.parseClient();
        if (myData.data[0].messageText === 'OK') {
          //alert(myData.data[0].successMessage);

          var resourceID = myData.data[0].resourceID;
          var taskID = myData.data[0].taskID;

          client.currentTask.taskGuid = taskGuid;
          client.currentTask.taskID = taskID;
          client.currentTask.resourceID = resourceID;
          client.currentTask.RR = {
            riskStatus: 0
          };
          $.geoLocator(function () {});

          client.currentTask.beginTime = myData.data[0].successMessage;
          var emptyFinishTask = {
            closureStatus: 'NotClosed',
            workNotes: '',
            matsUsedYN: 'N',
            matsUsed: '',
            milesHome: 0,
            travelHome: 0,
            serviceSheet: '',
            worksSeverity: 'G',
            allowClosure: 0,
            incompleteAudits: 0
          };

          client.currentTask.finishTask = emptyFinishTask;
          localStorage_a.setItem('client', client);
          currentPage.initialize(currentPage.renderParams.mode, routeSlideController.activeSlides[1]);
        }

      },
      function (msg) {
        console.log(msg);
        //alert('could not connect to server');
      }
    );
  },
  getTasks: function () {
    $('#divClientList, #divUpdateClients').hide();
    $('#divLoadingQRList').show();

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
        client.taskList = myData.data;
        localStorage_a.setItem('client', client);
        window.location = '#taskFinished';
      },
      function (msg) {
        console.log(msg);
        //alert('could not connect to server');
      }
    );
  },
  cleanup: function () {
    routeSlideController.mainView.cleanup();
    routeSlideController.mainView = null;
    $(document).off('keypress');
    this.undelegateEvents();
    $(this.el).empty();
  }
});
