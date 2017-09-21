App.SlideConstructors.ClosingStatusSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.ClosingStatusSlide',
  events: {
    "tap .input-label": function(e){ $(e.currentTarget.previousElementSibling).click(); },
    "tap .btnChooseStatus": "chooseStatus",
    "change .causeSel": "chooseDamage",
    "change [name='equipStatus']": "chooseEquipStatus",
    //"tap .btn-group-vertical" : "genrealStatusNote",
    "tap .damage": "chooseDamage"
  },
  initialize: function () {
    _.extend(this, {
      causeList: clientCollectionToken()
    });
    var client = this.client = $.parseClient();

    if (['PPM', 'AutoPPM'].indexOf($.parseClient().currentTask.task[0].taskType) !== -1) {
      this.listenTo(window.routeSlideController.mainView, 'assetStatus', function (status) {
        if (status === 'QuoteRequired' && !!client.currentTask.finishTask) {
          client.currentTask.finishTask.taskStatus = 'QuoteRequired';
          localStorage_a.setItem( 'client', client );
        }
        this.render();
      }.bind(this));
    }

    this.listenToOnce(this.causeList, 'sync', this.trigger.bind(this, 'cse'));

    this.on('cse', function (c) {
      var html = _.reduce(c.toJSON(), function (mem, cse) {
        return mem + ['<option ',
          (parseInt(this.client.currentTask.finishTask.reasonForFailure) === cse.PK_CSE_KEY ? 'selected' : ''),
          ' value="', cse.PK_CSE_KEY, '">',
          cse.CSE_Name,
          '</option>'
        ].join('');

      }, '<option value="">please select</option>', this);

      this.$('#causeSel').html(html);

    });

    this.causeList.fetch({
      auth: localStorage_a.getItem('token'),
      clientGuid: this.client.clientGuid,
      dsName: 'MOBILE_V5_causes'
    }, {
      silent: true
    });

    var headerTmp = $.headerTmp,
      currentTask = client.currentTask;

    this.templateFn = window.App.viewTaskSlides['viewTaskSlides/ClosingStatus.html'];
    this.renderParams = {
      headerTmp: headerTmp,
      client: client,
      currentTask: currentTask,
      task: currentTask.task,
      events: currentTask.events,
      QuoteReqLock: _.where(client.currentTask.assets, {
        status: 'QuoteRequired'
      }).length !== 0,
      equipStatus: currentTask.finishTask.equipStatus
    };
  },
  render: function () {
    var currentPage = this;
    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {

      var tmp = this.templateFn;
      var renderParams = this.renderParams = _.extend({
        causes: this.causeList.toJSON()
      }, this.renderParams);

      this.$el.html(tmp(this.renderParams));

      this.trigger('cse', this.causeList);

      return this;
    }
  },
  renderFooter: function (taskStarted) {
    taskStarted && window.footerView.footer(this, 'ClosingStatusSlide.html', this.renderParams);
  },
  genrealStatusNote: function () {
    $('#divStatusTextNotset').hide();
  },
  /*
  	dHash: { 0:'weartear', 1:'misuse', 2:'malicious' },*/
  chooseDamage: function (event) {
    var tar = $(event.currentTarget),
      reasonForFailure = tar.val(), //tar.attr('data-cfmrff'),
      client = this.client;

    console.log('reasonForFailure', reasonForFailure);

    client.currentTask.finishTask.reasonForFailure = reasonForFailure;

    localStorage_a.setItem('client', client);
    //$('.damage').removeClass('btn-success').addClass('btn-default');
    //tar.removeClass('btn-default').addClass('btn-primary');
  },
  chooseEquipStatus: function (e) {
    var equipStatus = parseInt(e.target.value);
    var client = this.client;
    client.currentTask.finishTask.equipStatus = equipStatus;
    localStorage_a.setItem('client', client);
  },
  chooseStatus: function (e) {
    var taskStatus = $(e.currentTarget).attr('data-status');
    var client = this.client;

    if (_.where(client.currentTask.assets, {
        status: 'QuoteRequired'
      }).length !== 0 && taskStatus !== 'QuoteRequired') {
      return false;
    }
    console.log('chooseStatus', client.currentTask);
    client.currentTask.finishTask.taskStatus = taskStatus;
    client.currentTask.finishTask.allowClosure = 1;

    localStorage_a.setItem('client', client);
    // $('.btnChooseStatus').not('.btnTaskStatus' + taskStatus).removeClass('btn-primary');
    $('.btnChooseStatus').removeClass('list-group-item-primary').addClass('list-group-item-default');
    $('.btnTaskStatus' + taskStatus).removeClass('list-group-item-default').addClass('list-group-item-primary');
    $('div.divStatusText').not('#divStatusText' + taskStatus).hide();
    $('div#divStatusText' + taskStatus).show();
  }
});
