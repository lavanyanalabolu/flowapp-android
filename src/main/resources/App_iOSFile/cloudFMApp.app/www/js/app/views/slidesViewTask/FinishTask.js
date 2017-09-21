App.SlideConstructors.FinishTaskSlide = baseView.extend({ __name__:'App.SlideConstructors.FinishTaskSlide',
  events: {
    "tap #btnSubmitFinishTask": "submitFinishTask",
    "tap .iCertify": function (e) {
      $(e.currentTarget).toggleClass('btn-default').toggleClass('btn-success')
    },
    "tap .overlayCancel": "renderFooter",
    "tap #btnSubmitFinishTaskValidate": "unlockClosure",
    "tap .liLinkToTab": function (e) {
      console.log('linktoTab');
      //window.location = '#viewTask/' + this.renderParams.mode + '/' + $(e.currentTarget).attr('data-buttonset')
      window.routeSlideController.slideTo($(e.currentTarget).attr('data-buttonSet'));
    }
  },
  initialize: function () {
    this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/FinishTask.html']);

    localStorage_a.sub('storageEvent', function () {
      this.render();
      console.log('storageEvent');
    }.bind(this), 'renderFinish');
  },
  render: function (mode) {

    var currentPage = this;
    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {
      var headerTmp = $.headerTmp;
      var client = $.parseClient(),
        currentTask = client.currentTask;
      console.log(currentTask, 'finishTaskScreen>currentTask')
      var renderParams = this.renderParams = {
        mode: mode,
        headerTmp: headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        events: currentTask.events
      }

      var tmp = this.templates.main;
      var pageBody = tmp(renderParams);
      this.$el.html(pageBody);
      this.renderFinishScreen();


      return this;
    }
  },
  renderFooter: function (taskStarted) {
    $('.finishScreen').show();
    $('.finishCertify').hide();
    taskStarted && window.footerView.footer(this, 'FinishTaskSlide.html', this.renderParams);
  },
  unlockClosure: function (event) {
    //console.log('unlock')
    //$('#btnSubmitFinishTask').hide();

    $('.iCertify').removeClass('btn-success').addClass('btn-default');
    var el = $(event.currentTarget);
    //console.log(event);

    $(event.currentTarget).hide();
    if (this.validateClosure() === 0) {
      $.jAlert('Task closure not permitted.  Please check.');
      el.show();
      return (false);
    } else {
      $('.finishScreen').hide();
      $('.finishCertify').show();
      if (!$(event.currentTarget).hasClass('forRealz')) {
        $.overlayer('#certify', true, '#mainSection, #divTaskCardFooter');
        window.footerView.footer(this, 'FinishCertify.html', this.renderParams);

        return false;
      } else {
        console.log('forRealz')
      }
      //console.log('renderRdiosjoifjdsoifjdos ----------')

      if (!$('.iCertify').hasClass('btn-success')) {
        $('.iCertify')
          .css({
            'border-color': 'rgba(193, 46, 42,.3)',
            'background-color': '#c12e2a',
            '-webkit-transition': 'background-color 200ms, border-color 200ms',
            'transition': 'background-color 200ms, border-color 200ms'
          })
          .delay(1000, 'fx')
          .queue('fx', function (next) {
            $(this).css({
              'border-color': '#e0e0e0',
              'background-color': '#e0e0e0',
              '-webkit-transition': 'background-color 200ms, border-color 200ms',
              'transition': 'background-color 200ms, border-color 200ms'
            })
            next()
          })
          .delay(200, 'fx')
          .queue('fx', function (next) {
            $(this).attr({
              style: ""
            })
            next()
          })
        return false
      }
      $.overlayer('#certify', false, '#mainSection, #divTaskCardFooter');

    }

    //$('#pClosureLocked').hide();
    //$('#btnSubmitFinishTask').show();
  },
  submitFinishTask: function (event) {
    if ($('.iCertify').hasClass('btn-default')) {
      $('.iCertify')
        .css({
          'border-color': 'rgba(193, 46, 42,.3)',
          'background-color': '#c12e2a',
          '-webkit-transition': 'background-color 200ms, border-color 200ms',
          'transition': 'background-color 200ms, border-color 200ms'
        })
        .delay(1000, 'fx')
        .queue('fx', function (next) {
          $(this).css({
            'border-color': '#e0e0e0',
            'background-color': '#e0e0e0',
            '-webkit-transition': 'background-color 200ms, border-color 200ms',
            'transition': 'background-color 200ms, border-color 200ms'
          })
          next()
        })
        .delay(200, 'fx')
        .queue('fx', function (next) {
          $(this).attr({
            style: ""
          })
          next()
        })
      return false
    }

    $('.divSubmittingTask').show();
    $('.reshowFinishButton').hide();

    $('#btnSubmitFinishTask').hide(); /* Hide finish button when attempting to contact server to avoid duplication when non responsive */
    var client = $.parseClient();
    if(!client.currentTask){
      return;
    }
    var taskID = $.getCurrentTaskID(client),
      taskStatus = client.currentTask.finishTask.taskStatus,
      taskNotes = client.currentTask.finishTask.workNotes,
      finishMatsUsedYN = client.currentTask.finishTask.finishMatsUsedYN,
      finishMatsUsed = client.currentTask.finishTask.finishMatsUsed,
      finishMilesHome = 0,
      finishTravHome = 0,
      finishSheetNum = '',
      finishReactiveAssets = '',
      severity = client.currentTask.finishTask.worksSeverity,
      signatory = client.currentTask.finishTask.signatory,
      sigData = client.currentTask.finishTask.sigData,
      RES_CSE_Key = client.currentTask.finishTask.reasonForFailure || null,
      RES_EquipStatus = client.currentTask.finishTask.equipStatus,
      assets = client.currentTask.assets,
      oddJobs = _.filter(client.currentTask.oddJobs, function (oj) {
        return (oj.mins && oj.comments);
      }),
      appPermissions = localStorage_a.getItem('appPermissions'),
      contractor = _.findWhere(appPermissions, {
        n: 'contractorName'
      }).appPermissionName,
      data = {
        clientGuid: client.clientGuid,
        auth: localStorage_a.getItem('token'),
        userName: localStorage_a.getItem('userName'),
        clientName: client.clientName,
        contractor: contractor,
        taskNum: client.currentTask.task[0].taskNum,
        "resource": {
          "type": "Task",
          "id": parseInt(taskID)
        },
        json: {
          actions: [{
            dsName: 'MOBILE_V5_finishTask_with_signature',
            i: parseInt(taskID),
            j: 0,
            k: 0,
            t: '',
            p1: {
              finishTaskCheckInID: client.buildingCheckIn.checkInID,
              finishTaskResourceID: client.currentTask.resourceID,
              resStatus: taskStatus,
              taskNotes: taskNotes,
              finishMatsUsedYN: finishMatsUsedYN,
              finishMatsUsed: finishMatsUsed,
              severity: severity,
              signatory: signatory,
              RES_EquipStatus: RES_EquipStatus,
              RES_CSE_Key: RES_CSE_Key,
              appVersion: localStorage_a.getItem('version').versionID
            },
            txt: sigData
          }]
        }
      };


    _.each(assets, function (a) {
      a.resourceID = client.currentTask.resourceID;
      a.mins_spent_on_asset = 0;
      var thisAsset = {
        dsName: 'MOBILE_V5_ppmFinishAsset',
        i: 0,
        j: 0,
        k: 0,
        t: '',
        p1: {
          compliant: a.compliant,
          status: a.status,
          condition: a.condition,
          mins_spent_on_asset: a.mins_spent_on_asset,
          comments: a.comments,
          resourceID: a.resourceID,
          operational: a.operational,
          talID: a.talID
        }
      }
      data.json.actions.push(thisAsset);
    });

    _.each(oddJobs, function (oj) {
      var thisOJ = {
        comments: oj.comments,
        mins: oj.mins,
        status: oj.status
      }
      var thisAsset = {
        dsName: 'MOBILE_V5_oddJobSave',
        i: oj.PK_Clip_Key,
        j: client.currentTask.taskID,
        k: 0,
        t: '',
        p1: thisOJ
      }
      data.json.actions.push(thisAsset);
    });

    var nextVisitNote = localStorage_a.getItem('nextVisitNote')
    if (nextVisitNote) {
      data.json.actions.push({
        dsName: 'MOBILE_V5_noteForNextVisit',
        i: taskID,
        j: client.buildingCheckIn.buildingID,
        k: 0,
        t: nextVisitNote,
        p1: {}
      });
    }

    /* Meter Readings */


    if (client.currentTask.meterReadings.length > 0) {
      _.each(client.currentTask.meterReadings, function (mr) {
        var thisMeterReading = {
          dsName: 'MOBILE_V5_meterReadingsSave',
          i: mr.meterReadingID,
          j: client.buildingCheckIn.buildingID,
          k: 0,
          t: mr.meterReading,
          p1: {}
        }
        data.json.actions.push(thisMeterReading);
      });
    }

    /* Tap Temps */

    var tapTemps = client.currentTask.tapTemperatures || [];

    if (tapTemps.length > 0) {
      _.each(tapTemps, function (tt) {
        var thisMeterReading = {
          dsName: 'MOBILE_V5_addTapTemp',
          i: tt.meterReadingID,
          j: client.buildingCheckIn.buildingID,
          k: 0,
          t: '',
          p1: tt
        }
        data.json.actions.push(thisMeterReading);
      });
    }

    /* fGas */

    var fGasData = client.currentTask.fGasData || [];

    if (fGasData.length > 0) {
      _.each(fGasData, function (fg) {
        var thisMeterReading = {
          dsName: 'MOBILE_V5_fGasSave',
          i: client.currentTask.taskID,
          j: client.buildingCheckIn.buildingID,
          k: client.currentTask.resourceID,
          t: client.currentTask.task[0].taskNum,
          p1: fg
        }
        data.json.actions.push(thisMeterReading);
      });
    }

    var currentPage = this;
    window.footerView.$('.btnSubmitFinishTask').prop('disabled', true);
    // $('#divFinishScreen').html('<pre>'+ JSON.stringify( data, null, 4 ) +'</pre>' )
    var defed = $.Deferred();
    $.jSuccess('Submitting task ...', defed);
    $.post(serverPath + "/batchProcess", data)
      .done(function (res) {
        //alert('Task submitted');
        defed.resolve('Task submitted')
        $('.divSubmittingTask').hide();
        $('#btnSubmitFinishTask').show();
        $('.reshowFinishButton').show();
        var taskList = _.filter(client.taskList, function (t) {
          return (t.taskID != client.currentTask.task[0].taskID);
        });
        client.taskList = taskList;
        client.currentTask = undefined;
        localStorage_a.cached = {};
        localStorage_a.setItem('client', client);
        localStorage_a.removeItem('nextVisitNote');
        localStorage_a.removeItem('taskTime');
        !!App.taskTimer && App.taskTimer.replaceWith(App.curVerEl || localStorage_a.getItem('curVerEl'));
        delete App.curVerEl;
        currentPage.getTasks();

      }).fail(function (res) {
        $('#btnSubmitFinishTask').show();
        $('.divSubmittingTask').hide();
        $('.reshowFinishButton').show();

        window.footerView.$('.btnSubmitFinishTask').prop('disabled', false);
        //console.log(res)
        if (res && res.responseJSON) {
          defed.resolve(res.responseJSON.err + ' please try again', true);
        } else {
          defed.resolve(res.statusText || 'Problem submitting task data.', true);
        }
      });

  },
  validateClosure: function () {

    var closureAllowed = 1,
      client = $.parseClient(),
      taskID = $.getCurrentTaskID(client),
      currentTask = client.currentTask,
      taskStatus = currentTask.finishTask.taskStatus;

    if (!taskStatus) {
      closureAllowed = 0;
    }

    var taskNotes = currentTask.finishTask.workNotes; //$('#txtWorkNotes').val();
    if (!taskNotes || taskNotes < 30) {
      closureAllowed = 0;
    }

    var finishMatsUsedYN = currentTask.finishTask.finishMatsUsedYN || 'N',
      finishMatsUsed = currentTask.finishTask.finishMatsUsed;

    if (finishMatsUsedYN === 'Y' && finishMatsUsed === '') {
      closureAllowed = 0;
    }

    var signatory = currentTask.finishTask.signatory; //$('#txtSignatory').val();
    var sigData = currentTask.finishTask.sigData;

    if (!signatory) {
      closureAllowed = 0;
    }
    if (!sigData) {
      closureAllowed = 0;
    }

    var severity = currentTask.finishTask.worksSeverity;
    if (!severity) {
      closureAllowed = 0;
    }
    if ($.getAppPermission('reasonForFailure') && ['PPM', 'AutoPPM', 'QuotedWorks'].indexOf(currentTask.task[0].taskType) === -1) {
      if (!currentTask.finishTask.reasonForFailure || currentTask.finishTask.equipStatus === undefined) {
        closureAllowed = 0;
      }
    }
    if ($.getAppPermission('forceQuoteDoc') !== 0 && currentTask.finishTask.taskStatus === 'QuoteRequired') {
      if (!currentTask.quoteUpload) {
        closureAllowed = 0;
      }
    }

    if ($.getAppPermission('fGas') && parseInt(currentTask.task[0].isFGas)) {
      if (currentTask.fGasStream === 0) {
        closureAllowed = 0;
      } else if (currentTask.fGasStream === 1) {
        closureAllowed = 0;
      }
    }

    console.log(currentTask.assets);
    _.each(currentTask.assets, function (a) {
      if (currentTask.finishTask.taskStatus !== 'AnotherVisit') {
        if ((a.compliant === "" && a.PassFail === "") || a.status == "Pending" || a.operational == null) {
          closureAllowed = 0;
        }
      }
    });

    var finishMilesHome = 0;
    var finishTravHome = 0;
    var finishSheetNum = '';
    var finishReactiveAssets = '';

    var meterReadingsValid = 1;
    if (currentTask.meterReadings.length > 0) {
      var intRegex = /^\d+$/;

      _.each(currentTask.meterReadings, function (mr) {
        if (!intRegex.test(mr.meterReading)) {
          meterReadingsValid = 0;
        }
      });
    }

    if (!meterReadingsValid) {
      closureAllowed = 0;
    }

    var tapTemperaturesValid = 0;
    if (!!currentTask.tapTemperatures && currentTask.tapTemperatures.length > 0) {
      var temps = currentTask.tapTemperatures,
        reger = /\d+(\.\d{1})?/;

      if (_.filter(temps, function (t) {
          return ((t.HotTap && reger.test(t.TapDataH)) || !t.HotTap) && ((t.ColdTap && reger.test(t.TapDataC)) || !t.ColdTap);
        }).length === temps.length) {
        tapTemperaturesValid = 1;
      }
    } else {
      tapTemperaturesValid = 1;
    }

    if (!tapTemperaturesValid) {
      closureAllowed = 0;
    }

    console.log(currentTask.finishTask);


    if (closureAllowed === 1) {
      console.log('Closure permitted');
    } else {
      console.log('Closure not permitted');
    }
    return (closureAllowed);
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
        window.location = '#taskFinished';
        //alert('could not connect to server');
      }
    );
    localStorage_a.unsub('storageEvent', 'renderFinish');
    routeSlideController.closeAll();
  },
  renderFinishScreen: function () {
    var tmp = window.App.viewTaskSlides['finishScreen.html'];
    this.$('#divFinishScreen').html(tmp());
  }
});
