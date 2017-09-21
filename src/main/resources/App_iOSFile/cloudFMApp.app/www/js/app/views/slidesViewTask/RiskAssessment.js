App.SlideConstructors.RiskAssessmentSlide = baseView.extend({
  __name__: 'App.SlideConstructors.RiskAssessmentSlide',
  initialize: function () {
    this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/RiskAssessment.html']);

    var client = $.parseClient(),
      currentTask = client.currentTask,
      renderParams = this.renderParams = {
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        t: currentTask.task[0],
        taskGuid: currentTask.taskGuid
      };
    this.RR = client.RR;
    this.contractorGUID = localStorage_a.getItem('contractorGUID');

    var riskAss_C = Collection.extend({
      initialize: function () {
        this.on('change', function(){
          if (!_.contains(this.pluck('value'), null)) {
            this.filled = true;
            this.trigger('full');
            var cli = $.parseClient();
            cli.currentTask = _.extend(cli.currentTask, {
              riskAssessment: _.map(this.toJSON(), function (ob) {
                return _.omit(ob, 'text');
              })
            });
            localStorage_a.setItem('client', cli);
          }
        });
        this.listenTo(routeSlideController.mainView, 'RAMLo', function () {
          this.RAMLoaded = true;
          this.trigger('full');
        });
      },
      RAMLoaded: false,
      filled: false,
      passed: false,
      model: Model.extend({
        idAttribute: 'name',
        defaults: {
          value: null
        }
      })
    });

    this.collection = new riskAss_C(_.shuffle(this.qs));

    this.listenTo(this.collection, 'full', function () {
      this.renderFooter(true);

    }.bind(this));

    if (!!currentTask.riskAssessment) {
      _.each(currentTask.riskAssessment, function (q) {
        !!this.collection.get(q.name) && this.collection.get(q.name).set('value', q.value);
      }, this);
    } else {

    }

    renderParams.qs = this.collection.toJSON();

  },
  events: {
    "tap .input-label": "selectRisk",
    "tap #saveRiskBtn": function () {
      $.updateTaskInfo('RR', {
        riskStatus: 1.5,
        passedAssessment: +this.collection.passed,
        comments: this.$('#deferTaskReason').val()
      });
      routeSlideController.mainView.trigger('advanceRR');
    },
    "tap #toRams": function () {
      var _v = this;
      var guidcheck = ['5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38', 'FD705377-B172-49B6-805F-05E7C916BFB8'].indexOf(this.contractorGUID) !== -1;
      $.updateTaskInfo('RR', {
        riskStatus: (guidcheck ? 1 : (this.collection.passed ? 4 : 2)),
        passedAssessment: +this.collection.passed,
        comments: ''
      });
      routeSlideController.mainView.trigger('advanceRR');
    },
    "tap .deferTaskBtn": function () {

      if ($('#deferTaskReason').val().length < 30) {
        var cn = $('#deferTaskReason');
        var cnString = cn.val()
        var textMax = 30
        var length = cnString.length;
        var remaining = textMax - length;
        if (length < textMax) {
          cn.css({
              "border-color": "#a94442",
              "background-color": "rgba(255, 0, 0, 0.2)"
            })
            .val('')
            .attr('placeholder', 'Please give a reason for deferring this task, at least 30 characters.' + remaining + ' characters remaining')
          cn.on('click', function (event) {
            $(event.currentTarget).val(cnString).attr({
              style: ""
            }).off('click')
          });
        }
        return false;
      } else {

        var client = $.parseClient();
        //var appPermissions = localStorage_a.getItem('appPermissions');
        var contractor = $.getAppPermissionByName('contractorName');
        var taskID = $.getCurrentTaskID(client);
        var RA = {
          clientGuid: $.parseClient().clientGuid,
          auth: localStorage_a.getItem('token'),
          dsName: 'MOBILE_V5_completeHSVisit',
          i: 0,
          j: 0,
          k: 0,
          t: this.renderParams.taskGuid,
          p1: _.extend(_.object(_.map(this.collection.toJSON(), function (ob) {
            return [ob.name, ob.value];
          })), {
            comments: this.$('#deferTaskReason').val(),
            checkInID: this.renderParams.client.buildingCheckIn.checkInID,
            passedAssessment: 0
          })
        };
        var data = {
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
                resStatus: 'AnotherVisit',
                taskNotes: this.$('#deferTaskReason').val(),
                finishMatsUsedYN: 'N',
                finishMatsUsed: '',
                severity: 'A',
                signatory: 'NA'
              },
              txt: 'NA'
            }]
          }
        };
        data.json.actions.push(RA);
        var defed = $.Deferred();
        $.jSuccess('Deferring task ...', defed);
        $.post(serverPath + "/batchProcess", data)
          .done(function (res) {
            defed.resolve('Task deferred');
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

            localStorage_a.setItem('client', client);
            window.location = '#taskFinished';

          }).fail(function (res) {
            $('#btnSubmitFinishTask').show();
            $('.divSubmittingTask').hide();
            $('.reshowFinishButton').show();
            if (res && res.responseJSON) {
              alert(res.responseJSON.err);
            } else {
              alert('Network timeout - please check your internet connection');
            }
          });
      }
    }
  },
  render: function (mode) {

    _.each(this.collection.models, function (v, k) {
      this.$el.on('change', '[name="' + v.get('name') + '"]', function (e) {

        v.set('value', $(e.currentTarget).val());
      }.bind(this));
    }, this);

    var currentPage = this;

    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {
      var headerTmp = $.headerTmp;

      var renderParams = this.renderParams = _.extend(this.renderParams, {
        mode: mode,
        headerTmp: headerTmp
      });

      var tmp = this.templates.RiskAssessmentSlide;

      var pageBody = tmp(renderParams);

      this.$el.html(pageBody);



      return this;
    }
  },
  qs: [{
    "text": "Is the site person in charge fully aware of what is to be done and given permission to start work?",
    "correct": "1",
    "name": "clientAwareOfWork"
  }, {
    "text": "If applicable has the relevant permit to work been obtained from centre management? (Select yes if N/A)",
    "correct": "1",
    "name": "permitObtained" // not in db yet
  }, {
    "text": "Is all PPE, tools etc. suitable and in good working order?",
    "correct": "1",
    "name": "equipmentInGoodOrder"
  }, {
    "text": "Is the working area secure with barriers erected where required to ensure others safety",
    "correct": "1",
    "name": "workAreaSecure"
  }, {
    "text": "If working at height is necessary, do you have the correct access equipment? (Select yes if N/A)",
    "correct": "1",
    "name": "workingAtHeightRisk"
  }, {
    "text": "If relevant have you checked the asbestos register? (Select yes if N/A)",
    "correct": "1", //not in db yet
    "name": "asbestosRegister"
  }, {
    "text": "Is poor lighting or lone working likely to pose a risk to your safety?",
    "correct": "0",
    "name": "poorLightingLoneWorkingRisk"
  }, {
    "text": "Will any vehicles operating in your work area pose a risk to your safety?",
    "correct": "0",
    "name": "vehiclesOperatingRisk"
  }, {
    "text": "Are there any significant risks of manual handling injuries?",
    "correct": "0",
    "name": "manualHandlingInjuryRisk"
  }, {
    "text": "If hot works are involved have you obtained the necessary hot works permit? (Select yes if N/A)",
    "correct": "1",
    "name": "hotWorks" // not in db
  }, {
    "text": "Will weather conditions cause a risk? (e.g. wind, rain, lightning, ice, snow etc.)",
    "correct": "0",
    "name": "weatherConditionsRisk"
  }, {
    "text": "If working on electrical systems confirm you are isolating the electrical source (Select yes if N/A)",
    "correct": "1",
    "name": "electricalIsolation" //not in db
  }, {
    "text": "Any other site risks to consider, ie: asbestos exposure, electricity cables etc?",
    "correct": "0",
    "name": "otherRisks"
  }, {
    "text": "I can confirm that I am able to work safely in accordance with the relevant RAM(S)?",
    "correct": "1",
    "name": "workingSafely"
  }],
  renderFooter: function (taskStarted) {
    if (this.collection.filled === false) {
      taskStarted && (window.footerView.footer(this, 'RiskAssessmentSlideIncomplete.html', this.renderParams));
      return;
    }
    var pass = true;

    if (!this.collection.RAMLoaded) {
      _.each(this.collection.models, function (_m) {
        _m.get('value') !== _m.get('correct') && (pass = false);
      }, this);
    }
    this.collection.passed = pass;
    this.$('#deferTaskReason')[!pass ? 'show' : 'hide']();
    taskStarted && window.footerView.footer(this, pass ? 'RiskAssessmentSlidePass.html' : 'RiskAssessmentSlideFail.html', this.renderParams);
  },
  selectRisk: function (e) {
    e.preventDefault();
    e.currentTarget.previousElementSibling.checked = true;
    $(e.currentTarget.previousElementSibling).change();
    return false;
  }

});
