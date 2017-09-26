App.SlideConstructors.PPMAssetListSlide = baseView.extend({
  __name__:'App.SlideConstructors.PPMAssetListSlide',
  events: {
    "tap .input-label":function(e){ $('input', e.currentTarget).click(); },
    "tap .btnServiceAsset": "serviceAsset",
    "tap .btn-assetList": "filterAssetList",
    "tap .assetHistory": "assetHistory",
    "tap .btnBackToAsset": "backToAsset",
    "tap .btnBackToAssetHistory": "backToAssetHistory",
    "change .chooseAssetCondition": "assetCondition",
    'tap .btnDelegateAsset': 'delegateAsset',
    "tap .btnDelegateAssetNo": "delegateAssetNo",
    "tap .btnDelegateAssetYes": "delegateAssetYes",
    "tap .btnEditAsset": "editAssetEvent",
    "tap .btnCancelAsset": "cancelAsset",
    "tap .btnNextAsset": "nextAsset",
    "tap .btnChooseAssetStatus": "chooseAssetStatus",
    "tap .btnChooseAssetCondition": "chooseAssetCondition",
    //"tap .btnChooseAssetOperational": "chooseAssetOperational",
    "change [name='operational']": "chooseAssetOperational",
    "tap .btnChooseAssetCompliant": "chooseAssetCompliant",
    "change textarea.txtAssetDetails": "cacheAssetDetails",
    "tap .showAssetHistory": "showAssetHistory",
    "tap .scanAsset": "scanAsset",
    "tap .btnDelegateAll": "delegateAllAssets",
    "tap .btnDelegateAllConfirm": "delegateAllConfirm",
    "tap .btnDelegateAllCancel": "delegateAllCancel"
  },
  initialize: function () {
    this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/PPMAssetList.html']);
  },
  render: function (mode) {
    var currentPage = this;
    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {
      var headerTmp = $.headerTmp;
      var client = $.parseClient(),
        currentTask = client.currentTask;
      //console.log(headerTmp)
      var renderParams = this.renderParams = {
        mode: mode,
        headerTmp: headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        assets: currentTask.assets
      };

      var tmp = this.templates.main;
      var pageBody = tmp(renderParams);
      this.$el.html(pageBody);
      this.renderPPMAssetList();


      return this;
    }
  },
  renderFooter: function (taskStarted) {
    taskStarted && window.footerView.footer(this, 'PPMAssetListSlide.html', this.renderParams);
  },
  showAssetHistory: function (e) {
    var id = $(e.currentTarget).attr('data-historyid');

    var assetHistory = $.parseClient().currentTask.assetHistory;
    console.log('assetHistory', assetHistory);
    var thisHistory = _.filter(assetHistory, function (h) {
      return h.task_asset_link_id == id;
    }).shift();

    $.getPageHtmlAsync('ppmAssets/assetHistoryFull.html', false, function (template) {
      $('.ppmAssetHistory').hide();
      $('.ppmAssetHistoryFull').html(template(thisHistory)).show();

    })
    window.footerView.footer(this, 'PPMAssetHistDeet.html', this.renderParams);
  },
  cacheAssetDetails: function (event) {
    var assetDetails = $(event.currentTarget).val();
    var talID = $(event.currentTarget).attr('data-talID');
    var client = $.parseClient();

    for (var i = 0; i < client.currentTask.assets.length; i++) {
      console.log(i);
      if (client.currentTask.assets[i].talID == talID) {
        pos = i;
      }
    }

    client.currentTask.assets[pos].comments = assetDetails;
    //client.currentTask.finishTask.allowClosure = 1;
    localStorage_a.setItem('client', client);
  },
  filterAssetList: function (e) {
    var el = $(e.currentTarget);
    var btnList = $('.btn-assetList');
    var status = el.attr('data-assetStatus');
    if (status == "completed") {
      $('#completedAssets').show();
      $('#pendingAssets').hide();
    } else {
      $('#completedAssets').hide();
      $('#pendingAssets').show();
    }

    if (btnList.hasClass("btn-primary")) {
      btnList.removeClass('btn-primary').addClass('btn-default');
    }
    el.addClass('btn-primary').removeClass('btn-default');
  },
  delegateAsset: function (e) {
    var talID = $(e.currentTarget).attr('data-talID');
    $('.btnDelegateAssetYes').attr('data-talID', talID);

    $(e.currentTarget).hide();
    $.overlayer('#delegateAssetConfirm', true, '#mainSection, #divTaskCardFooter');
  },
  delegateAssetNo: function (e) {
    $.overlayer('#delegateAssetConfirm', false, '#mainSection, #divTaskCardFooter');
    $('.btnDelegateAsset').show();
  },
  delegateAssetYes: function (e) {

    var pos = 0;
    var talID = $(e.currentTarget).attr('data-talID');
    var client = $.parseClient();

    for (var i = 0; i < client.currentTask.assets.length; i++) {
      console.log(i);
      if (client.currentTask.assets[i].talID == talID) {
        pos = i;
      }
    }

    var a = client.currentTask.assets;
    a.splice(pos, 1);
    client.currentTask.assets = a;

    localStorage_a.setItem('client', client);

    $.overlayer('#delegateAssetConfirm', false, '#mainSection, #divTaskCardFooter');
    $('.btnDelegateAsset').show();

    this.cancelAsset();
  },
  delegateAllAssets: function(){
    window.footerView.footer(this, 'PPMAssetConfirmDelegateAll.html', {});
  },
  delegateAllConfirm: function(){
    var client = $.parseClient();
    client.currentTask.assets = [];
    localStorage_a.setItem('client', client);
    this.cancelAsset();
  },
  delegateAllCancel: function(){
    window.footerView.footer(this, 'PPMAssetListSlide.html', this.renderParams);
  },
  backToAsset: function (e) {
    $('.ppmAssetHistory').hide();
    $('.ppmAssetDetails').show();
    $('.assetcontainer').animate({
      scrollTop: 0
    });
    window.footerView.footer(this, 'PPMAssetEdit.html', this.renderParams);
  },
  backToAssetHistory: function (e) {
    $('.ppmAssetHistoryFull').hide();
    $('.ppmAssetHistory').show();
    window.footerView.footer(this, 'PPMAssetHist.html', this.renderParams);
  },

  serviceAsset: function (event) {
    var talID = $(event.currentTarget).attr('data-talID');
    var client = $.parseClient();
    client.currentTask.talID = talID;
    localStorage_a.setItem('client', client);
    window.location = '#serviceAsset';
  },
  assetHistory: function (e) {
    var assetId = $(e.currentTarget).attr('data-assetid');
    var data = {
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_assetHistory',
      j: 0,
      k: 0,
      t: '',
      p1: {},
      i: assetId
    };
    var currentPage = this;
    $.jWorking('Loading Asset History ... ', data,
      function (msg) {
        var data = JSON.parse(msg.d).data;
        currentPage.renderAssetHistory({
          history: data
        });
        console.log('lhistoire');
        window.footerView.footer(currentPage, 'PPMAssetHist.html', this.renderParams);
        var client = $.parseClient();
        client.currentTask.assetHistory = data;
        localStorage_a.setItem('client', client);
      },
      function (msg) {
        console.log(msg);
        //alert('could not connect to server');
      }
    );
  },
  renderAssetHistory: function (data) {
    $.getPageHtmlAsync('ppmAssets/assetHistory.html', false, function (tmp) {
      $('.ppmAssetDetails').hide();
      $('.ppmAssetHistory').show()
      $('.assetHistoryContainer').html(tmp(data));
    });
  },
  chooseAssetStatus: function (event) {
    var assetStatus = $(event.currentTarget).attr('data-status');
    var talID = $(event.currentTarget).attr('data-talID');
    var client = $.parseClient();

    for (var i = 0; i < client.currentTask.assets.length; i++) {
      console.log(i);
      if (client.currentTask.assets[i].talID == talID) {
        pos = i;
      }
    }
    //console.log(assetStatus, 'transferThis');

    client.currentTask.assets[pos].status = assetStatus;
    //client.currentTask.finishTask.allowClosure = 1;
    localStorage_a.setItem('client', client);

    window.routeSlideController.mainView.trigger('assetStatus', assetStatus);

    $('.btnChooseAssetStatus').removeClass('btn-primary').addClass('btn-default');
    $('.btnAssetStatus' + assetStatus).removeClass('btn-default').addClass('btn-primary');
    $('div.divAssetStatusText').not('#divAssetStatusText' + assetStatus).hide();
    $('div#divAssetStatusText' + assetStatus).show();
    return (false);

  },
  assetCondition: function (event) {
    var assetCondition = $(event.currentTarget).val();
    console.log(assetCondition);
    var talID = $(event.currentTarget).attr('data-talID');
    var client = $.parseClient();

    for (var i = 0; i < client.currentTask.assets.length; i++) {
      console.log(i);
      if (client.currentTask.assets[i].talID == talID) {
        pos = i;
      }
    }

    client.currentTask.assets[pos].condition = assetCondition;

    localStorage_a.setItem('client', client);
  },
  chooseAssetCondition: function (event) {
    var assetCondition = $(event.currentTarget).attr('data-condition');
    var talID = $(event.currentTarget).attr('data-talID');
    var client = $.parseClient();

    for (var i = 0; i < client.currentTask.assets.length; i++) {
      console.log(i);
      if (client.currentTask.assets[i].talID == talID) {
        pos = i;
      }
    }

    client.currentTask.assets[pos].condition = assetCondition;
    //client.currentTask.finishTask.allowClosure = 1;
    localStorage_a.setItem('client', client);
    $('.btnChooseAssetCondition').removeClass('btn-primary').addClass('btn-default');
    //$('.btnAssetCondition' + assetCondition).removeClass('btn-default').addClass('btn-primary');
    $('div.divAssetConditionText').not('#divAssetConditionText' + assetCondition).hide();
    $('div#divAssetConditionText' + assetCondition).show();

    var $buttonParent = $(event.currentTarget).parent();
    console.log(assetCondition);
    switch (assetCondition) {
    case 'Poor':
      $buttonParent.find('.btnAssetConditionPoor').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $('.assetConditionSet' + talID).html('Poor');
      break;
    case 'Fair':
      $buttonParent.find('.btnAssetConditionPoor').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionFair').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $('.assetConditionSet' + talID).html('Fair');
      break;
    case 'Good':
      $buttonParent.find('.btnAssetConditionPoor').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionFair').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionGood').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $('.assetConditionSet' + talID).html('Good');
      break;
    case 'Excellent':
      $buttonParent.find('.btnAssetConditionPoor').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionFair').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionGood').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionExcellent').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $('.assetConditionSet' + talID).html('Excellent');
      break;
    case 'New':
      $buttonParent.find('.btnAssetConditionPoor').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionFair').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionGood').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionExcellent').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $buttonParent.find('.btnAssetConditionNew').removeClass('btn-default').addClass('btn-primary').find('span').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      $('.assetConditionSet' + talID).html('New');
      break;
    }

    return (false);

  },

  chooseAssetOperational: function (e) {

    var assetOperational = e.currentTarget.value;
    var talID = $(e.currentTarget).attr('data-talid');
    var client = $.parseClient();
    var asset = _.findWhere(client.currentTask.assets, { talID: parseInt(talID) });

    asset.operational = assetOperational;
    localStorage_a.setItem('client', client);

    return (false);
  },
  chooseAssetCompliant: function (event) {
    var assetCompliant = $(event.currentTarget).attr('data-Compliant');
    var talID = $(event.currentTarget).attr('data-talID');
    var client = $.parseClient();

    for (var i = 0; i < client.currentTask.assets.length; i++) {
      console.log(i);
      if (client.currentTask.assets[i].talID == talID) {
        pos = i;
      }
    }

    client.currentTask.assets[pos].compliant = assetCompliant;
    //client.currentTask.finishTask.allowClosure = 1;
    localStorage_a.setItem('client', client);
    $('.btnChooseAssetCompliant').removeClass('btn-primary').addClass('btn-default');
    $('.btnAssetCompliant' + assetCompliant).removeClass('btn-default').addClass('btn-primary');
    $('div.divAssetCompliantText').not('#divAssetCompliantText' + assetCompliant).hide();
    $('div#divAssetCompliantText' + assetCompliant).show();
    return (false);

  },
  cancelAsset: function (e) {
    $('.divRefreshPPMAssets').hide();
    $('.ppmAssetDetails, .ppmAssetHistory, .ppmAssetHistoryFull').hide();
    $('.ppmAssetList').show();
      //this.swipe.enable()
    window.footerView.footer(this, 'blank.html', this.renderParams);
    window.routeSlideController.enable();
    this.renderPPMAssetList();
  },

  nextAsset: function (e) {
    var talID = $(e.currentTarget).attr('data-talID');
    var currentTask = $.parseClient().currentTask;
    var pos = 0;
    for (var i = 0; i < currentTask.assets.length; i++) {
      console.log(i);
      if (currentTask.assets[i].talID == talID) {
        console.log('a=' + i);
        pos = i + 1;
      }
      if (pos >= currentTask.assets.length) pos = 0;

    }

    var nextTalID = currentTask.assets[pos].talID;
    this.editAsset(nextTalID);

  },
  editAssetEvent: function (e) {
    console.log('editAssetEvent');
    this.editAsset($(e.currentTarget).attr('data-talID'));
  },
  editAsset: function (talID) {
    $('.assetcontainer').animate({
      scrollTop: 0
    });
    window.footerView.footer(this, 'PPMAssetEdit.html', this.renderParams);
    $('.btnDelegateAsset').attr('data-talID', talID);
    $('.divRefreshPPMAssets').show();
    console.log('talID', talID);
    $.getPageHtmlAsync('ppmAssets/asset.html', false, function (tmp) {
      var currentTask = $.parseClient().currentTask;
      window.routeSlideController.disable();
      var thisAsset = _.filter(currentTask.assets, function (a) {
        return (a.talID == talID);
      });
      $('.ppmAssetList').hide();
      $('.assetcontainer').html(tmp(thisAsset[0]));
      $('.ppmAssetDetails').show();
      var assetCondition = thisAsset[0].condition;
      if (!!assetCondition && assetCondition !== "") {
        console.log('thisAsset.condition', assetCondition);
        $('.chooseAssetCondition').val(assetCondition);
      }
      console.log(tmp);
    }.bind(this));

  },
  renderPPMAssetList: function () {
    var tmp = window.App.viewTaskSlides['ppmAssets/assetList.html'];
    //$.getPageHtmlAsync('ppmAssets/assetList.html', false, function (tmp) {
      this.$('.divPPMAssetContainer').html(tmp());
    //}.bind(this));
  },
  scanAsset: function (e) {
    var that = this;
    that.undelegateEvents();

    function Success(res) {
      that.delegateEvents();
      if (res.cancelled) return false;

      var pu = $.parseURI(res.text),
        guid = pu.vars.c.substring(7).toUpperCase(),
        hostname = pu.hostname,
        qrClient = pu.vars.c.substring(0, 7);
      if (hostname != 'qrcloud.co.uk' || qrClient.toUpperCase() != $.parseClient().qrIdentity.toUpperCase()) {
        $.jAlert('This QR label is not associated with the current client (' + $.parseClient().clientName + ')');
        return false;
      } else {
        that.scanResult(guid);
      }
    }

    function Error(err) {
      that.delegateEvents();
    }
    try {
      var inBrowser = document.URL.indexOf('http://') !== -1 || document.URL.indexOf('https://') !== -1;
      var scanner = window.cordova.plugins.barcodeScanner || window.cordova.require("cordova/plugin/BarcodeScanner");
      scanner.scan(Success, Error);
    } catch (err) {
      that.delegateEvents();
      $.jAlert(err.message);
    }

    //    var qrCode = '358671A3-FC58-460A-B03D-2330CE02639E';  // use for testing
    //this.scanResult( qrCode );
  },
  scanResult: function (guid) {
    var asset = _.where($.parseClient().currentTask.assets, {
      'qrCode': guid
    })[0];
    console.log(asset);
    if(!asset){
      $.jAlert('No associated PPM asset');
    }else{
      //console.log(this.$('.ppmAssetList [data-talid="'+asset.talID+'"]'));
      this.editAsset(asset.talID);
    }
    /*if (!asset) {
      $('.main').hide();
      $('.createAsset').show();
      if (this.subView !== null) {
        this.subView.close();
      }
      this.subView = new createAsset({
        collection: this.assetList,
        qrCode: guid,
      });
    } else {
      $('.createAsset').hide();
      var assetGuid = asset.get('assetGuid');

      this.getAssetDitails(assetGuid);

    }*/
  }
});
