(function () {
  var commonMethods = baseView.extend({
    uploadPhoto: function (photo, model, callback) {
      var that = this,
        fileURL = photo.imageURI;

      model = model || this.model;
      console.log(photo, 'thePhoto');
      try {
        var options = new FileUploadOptions();
        options.headers = {
          Connection: "close"
        };
        options.fileKey = "file";
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.params = _.extend({
          auth: localStorage_a.getItem('token'),
          clientGuid: this.client.clientGuid,
          taskGuid: this.client.currentTask.taskGuid
        }, model.toJSON());

        var Success = function (r) {
          console.log(r);
          var photos = _.map(model.get('photos'), function (p) {
            if (p.imageURI == fileURL) {
              p.submited = true;
            }
            return p;
          });

          model.set('photos', photos, {
            silent: true
          });
          return callback(null, true);
        };

        var Error = function (error) {
          return callback(error, false);
        };
        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI(serverPath + "/uploadAsset"), Success, Error, options);
      } catch (err) {
        return callback(err, false);
      }
    },
    submitPhotos: function (model, processFileCallback) {
      var that = this,
        i = 1;
      async.each(model.get('photos'), function (photo, cb) {
        var defd = $.Deferred();
        $.jSuccess('Submiting Photo No ' + i, defd);
        that.uploadPhoto(photo, model, function (err, status) {
          if (err) {
            defd.resolve('Photo ' + i + ' failed');
            console.log(err);
            i++;
            return cb(err);
            //return   processFileCallback( err, null);
          }
          //!!window.App.magFailDeferred && window.App.magFailDeferred.resolve('Connection established');
          defd.resolve('Photo ' + i + ' submited');
          i++;
          cb();
        });
      }, function (err) {
        console.log(err);
        processFileCallback(err || null, true);
      });
    }
  });

  var assetDefaults = {
    AS_NAME : null,
    AS_CreatedBy: null,
    AS_CreatedDate: null,
    AS_MANUFACTURER: null,
    AS_MODEL_TYPE: null,
    AS_SERIAL_NUM: null,
    assetGuid: null,
    assetID: null
  };
  //test qr http://qrcloud.co.uk?c=wol2015B37B5EC5-76A4-41BB-90E3-4AF5E430D550
  App.SlideConstructors.BuildingAssetsSlide = commonMethods.extend({ __name__:'BuildingAssetsSlide',
    events: {
      "tap .scanAsset": "scanAsset",
      "tap .backToCreateAsset": 'backToCreateAsset',
      "tap .resubmit": "submitAsset",
      "tap .backToMain": "backToMain",
      "tap .transferAssetData": "transferAssetData",
      "tap .removeTaskAsset": "removeTaskAsset",
      "tap .noTaskAsset" : "noTaskAsset",
      "tap .assetNa" : "assetNa"
    },
    backToMain: function () {
      if (this.subView !== null && !!this.subView.close) {
        this.subView.close();
        this.renderBody();
        $(_.values(this.constructedSections)).hide();
        this.$('.asset').show();
      }
      console.log('backToMain');
      window.footerView.footer(this, 'BuildingAssetsSlide.html', {});
      routeSlideController.enable();
    },
    editAsset: function () {
      this.trigger('editAsset');
    },
    initialize: function () {
      this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/BuildingAssets.html']);
      _.extend(this, {
        assetList: clientCollectionToken({
          getAssetList: function(newAsset){
            //localStorage_a.removeItem('assetList');
            var assetList = localStorage_a.getItem('assetList');
            if (assetList && !newAsset) {
              this.reset(assetList, {
                silent: true
              }).trigger('sync');
            } else {
              this.fetch({
                auth: localStorage_a.getItem('token'),
                clientGuid: $.parseClient().clientGuid,
                dsName: 'MOBILE_V5_taggedAssetsOnBuilding',
                i: $.parseClient().buildingCheckIn.buildingID
              }, {
                deferMessage: "Downloading asset list ...",
                silent: true
              });
            }
          }
        },
          {
            defaults: assetDefaults
        }),
        client: $.parseClient(),
        subView: null
      });
      this.listenTo(this.assetList, 'sync add', this.renderAssetList);
    },
    serialize: function () {
      var headerTmp = $.headerTmp,
        client = $.parseClient(),
        currentTask = client.currentTask;

      return _.defaults({
        headerTmp: headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        assets: client.buildingCheckIn.assets,
        servicingAsset : parseInt(currentTask.currentAsset) === 0 ? 0 : currentTask.currentAsset
      }, { servicingAsset: '' });
    },
    render: function (mode) {
      var currentPage = this;
      if (!localStorage_a.getItem('client')) {
        window.location = '#setClient';
      } else {

        var renderParams = this.renderParams = this.serialize();

        var tmp = this.templates.main;

        var pageBody = tmp(this.renderParams);

        this.$el.html(pageBody);
        this.renderBody();

        //this.getAssetList();
        this.once('idle', this.getAssetList);
        return this;
      }
    },
    renderBody: function () {
      this.renderParams = this.serialize();

      this.$('.asset .sectionBody').html(this.templates.sectionBodyInner(this.renderParams));
    },
    renderAssetList: function () {
      this.$('.assetList').html('');
      var tpl = window.App.viewTaskSlides['buildingAssets/asset.html'];
      //$.getPageHtmlAsync('buildingAssets/asset.html', false, function (tpl) {
        this.assetList.each(function (model) {
          this.$('.assetList').prepend(tpl({
            model: model.toJSON()
          }));
        }, this);
      //}.bind(this));
    },
    getAssetList: function (newAsset) {
      this.assetList.getAssetList(newAsset);
    },
    backToCreateAsset: function () {
      $('.assetPhotos').fadeOut();
      $('.createAsset').show();
    },
    removeTaskAsset: function(){
      $.updateTaskInfo('currentAsset', '');
      this.renderBody();
    },
    assetNa: function(){
        this.subView.trigger('cancel');
        this.backToMain();
    },
    noTaskAsset: function(e){
      window.routeSlideController.disable();

      var model = clientModelToken();

			this.subView = new window.viewConstructors.searchableAssetList( {
        assetList : this.assetList,
        client: $.parseClient(),
        backToMain: this.backToMain.bind(this),
        parentEl: this.$('.pickAsset')
      });

      this.listenToOnce(this.subView, 'cancel', function(){
        this.stopListening(this.subView, 'choose');
        $.updateTaskInfo('currentAsset', 0);
      }.bind(this));

      this.listenToOnce(this.subView, 'choose', function(m){
        $('.pickAsset').hide();
        $('.asset').show();
        window.footerView.footer(this, 'BuildingAssetsSlide.html', {});
        this.stopListening(this.subView, 'cancel');
        this.scanResult(m.get('qrCode'));
      }.bind(this));

      $('.pickAsset').show();
      $('.asset').hide();
      window.footerView.footer(this, 'BuildingAssetsChoose.html', {});
		},
    scanAsset: function (e) {
      var that = this;
      that.undelegateEvents();

      function Success(res) {
        that.delegateEvents();
        if (res.cancelled) return;

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
    scanAssetTest: function (res) {
      this.delegateEvents();
      var pu = $.parseURI(res.text),
        guid = pu.vars.c.substring(7).toUpperCase(),
        hostname = pu.hostname,
        qrClient = pu.vars.c.substring(0, 7);
      if (hostname != 'qrcloud.co.uk' || qrClient.toUpperCase() != $.parseClient().qrIdentity.toUpperCase()) {
        $.jAlert('This QR label is not associated with the current client (' + $.parseClient().clientName + ')');
        return false;
      } else {
        this.scanResult(guid);
      }
    },
    scanResult: function (guid) {
      var asset = this.assetList.where({
        'qrCode': guid
      })[0];
      console.log(asset);
      if (!asset || !asset.get('assetGuid')) {
        $('.asset').hide();
        $('.createAsset').show();
        if (this.subView !== null) {
          this.subView.close();
        }
        this.subView = new createAsset({
          model: asset,
          collection: this.assetList,
          qrCode: guid,
        });
      } else {
        $('.createAsset').hide();
        var assetGuid = asset.get('assetGuid');

        this.getAssetDitails(assetGuid);

      }
    },
    transferAssetData: function () {
      this.subView = new window.viewConstructors.transferAssetData({
        assetList: this.assetList,
        model: clientModelToken(),
        client: $.parseClient(),
        backToMain: this.backToMain.bind(this)
      });
    },
    getAssetDitails: function (assetGuid, taskGuid) {
      console.log('getAssetDitails');
      var details = dataClientToken();
      details.fetch({
        clientGuid: $.parseClient().clientGuid,
        auth: localStorage_a.getItem('token'),
        dsName: 'MOBILE_V5_assetGuidLookup',
        t: assetGuid
      }, {
        deferMessage: "Downloading asset details ..."
      });


      this.listenToOnce(details, 'sync', function (model) {
        if (this.subView !== null && this.subView.remove) {
          this.subView.remove();
        }

        model.set('taskGuid', this.options.currentTask.taskGuid);

        this.subView = new assetDetails({
          parentView: this,
          model: details,
          assetList: this.assetList,
          backToMain: this.backToMain.bind(this)
        });
      });
    },
    renderFooter: function (taskStarted) {
      taskStarted && window.footerView.footer(this, 'BuildingAssetsSlide.html', {});
    },
    submitAsset: function (e) {
      var that = this;
      var el = $(e.currentTarget),
        qrCode = el.attr('data-qrCode');
      var thisModel = that.assetList.findWhere({
        qrCode: qrCode
      });

      async.waterfall([
        function submitAsset(callback) {
          console.log('themodel',thisModel);
          thisModel.save({
            auth: localStorage_a.getItem('token'),
            clientGuid: that.client.clientGuid,
            dsName: 'MOBILE_V5_assetTagCreate',
            p1: _.extend(_.omit(thisModel.toJSON(), 'photos'), {
              taskGuid: that.client.currentTask.taskGuid
            })
          }, {
            error: function (xhr, statusTxt, thrown) {
              var e = new Error('Problem submitting Asset');
              $.jAlert('Problem submitting Asset');
              return callback(e, null);
            },
            deferMessage: 'Submiting assset ...'
          });

          that.listenToOnce(thisModel, 'sync', function (model) {

            return callback(null, model);
          });
        },
        that.submitPhotos.bind(that)
      ], function (error, status) {
        if (error) {
          $.jAlert(error.message || JSON.stringify(error));
          return;
        }
        localStorage_a.setItem('assetList', that.assetList.toJSON());
        that.$('li').find('[data-qrCode="' + qrCode + '"]').remove();
      });
    }
  });

  var assetDetails = registerAssetDetails(commonMethods);

  var assetPhotos = registerAssetPhotos(commonMethods);

  var createAsset = registerCreateAsset(commonMethods, assetPhotos);



  function debug(msg) {
    $('.debug').text(msg);
  }
})();
