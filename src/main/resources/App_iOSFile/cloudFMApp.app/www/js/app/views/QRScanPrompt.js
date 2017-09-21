window.viewConstructors.QRScanPromptView = Backbone.View.extend({ __name__:'window.viewConstructors.QRScanPromptView',
  el: '#nebulousContainer',
  initialize: function (ob, subroute) {
    var omitSlides = [];
    var qrData = ob.qrData;
    console.log(qrData, !qrData.get('k'), !qrData.get('f'), qrData.get('i') == 0, 'qrrrrrrrrrr')
    if (!qrData.get('k') && !qrData.get('f') && qrData.get('i') == 0) {
      qrData.set('status', "not installed")
      omitSlides.push('AssetType', 'AssetQuestions');

    } else if (qrData.get('k') != null && qrData.get('f') == "" && qrData.get('i') == (0 || 1)) {
      qrData.set('status', "assigned to a building but does not have a type assigned")
      omitSlides.push('SetBuilding', 'AssetType', 'AssetQuestions');

    } else if (qrData.get('k') == null && qrData.get('f') != "" && qrData.get('i') == (0 || 1)) {
      qrData.set('status', "not assigned to a building")
      omitSlides.push('AssetType', 'AssetQuestions');

    } else if (qrData.get('k') != null && qrData.get('f') != "" && qrData.get('i') == 0) {
      qrData.set('status', "assigned but not installed")
      omitSlides.push('SetBuilding');
      if (qrData.get('f') != 'A' || !!qrData.assetTagCategoryID) omitSlides.push('AssetType', 'AssetQuestions');

    } else if (qrData.get('k') != null && qrData.get('f') == "" && qrData.get('i') == 0) {
      qrData.set('status', "assigned to building but not installed")
      omitSlides.push('AssetType', 'AssetQuestions')

    } else if (qrData.get('k') == null && qrData.get('f') == "" && qrData.get('i') == 1) {
      qrData.set('status', "registered as installed but is not assigned")
      omitSlides.push('AssetType', 'AssetQuestions')
    }
    console.log(omitSlides, 'I wont show these slides', subroute)
    routeSlideController.slideFilter(omitSlides, true, subroute) //.slideTo(subroute || 0);

    _.each(qrData.attributes, function (v, k) {
        console.log(k, 'namekey')

        this.$el.on('change', '[name="' + k + '"]', function (e) {
          console.log('I listened')
          qrData.set(k, $(e.currentTarget).val())
          console.log(qrData.toJSON())
        })
      }, this)
      //console.log(qrData.toJSON());
    this.formModel = qrData
    this.renderFooter();
  },
  events: {
    "tap .input-label": function(e){ $('input', e.currentTarget).click(); },
    "tap .btnQRCancel": "QRCancel",
    "tap .btnQRAssign": "QRAssign"
      /* "change .f": "QFChange",
       "tap .btnNextSection" : "nextSection",
       "tap .btnPrevSection" : "prevSection",*/
      /*"change .fInput": "updateModel",
      "tap label": "replaceEvent"*/
  },
  renderFooter: function () {
    console.log('RENEERFooter');
    window.footerView.footer(this, 'qrPrompt.html', {});
  },
  QRCancel: function (e) {
    this.cleanup();
    window.location = '#home';
  },
  cleanup: function () {
    routeSlideController.closeAll();
  },
  location: function (callback, ctx) {
    var options = {
      maximumAge: 600000,
      timeout: 5000,
      enableHighAccuracy: true
    };
    var defed = $.Deferred();

    function success(pos) {
      defed.resolve();
      var location = {
        latitude: "" + pos.coords.latitude + "",
        longitude: "" + pos.coords.longitude + "",
        timestamp: pos.timestamp
      };
      localStorage_a.setItem('location', location);
      callback.call(ctx, null, location);
    }

    function error(err) {
      if (err.code === 1 && !!$.parseClient().currentTask) {

        this._m = new Model({
          'locationServices': 0
        })

        this._m.once('sync', function (m) {
          m.destroy();
        }.bind(this))

        this._m.save({
          clientGuid: $.parseClient().clientGuid,
          auth: localStorage_a.getItem('token'),
          dsName: 'MOBILE_V5_updateLocationServices',
          t: '',
          i: _m.get('locationServices'),
          k: $.parseClient().currentTask.resourceID,
          p1: {}
        }, {
          url: serverPath + '/dataClientToken'
        });

      }
      defed.resolve(err.message, true);
      callback.call(ctx, err.message, null);
    }
    $.jSuccess('Finding your location...', defed);
    try {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } catch (err) {
      error(err);
      throw err;
    }
  },
  QRAssign: function () {
    var _v = this;
    var formData = _v.formModel.toJSON();
    console.log(formData);
    var yn = true;
    _.each(_.pick(formData, ['k', 'f']), function (v, k) {
      var mess = (function () {
        switch (k) {
        case 'k':
          return 'building'
          break;
        case 'f':
          return 'QR type'
          break;
        }
      })();
      if (v === null) {
        $.jAlert('Please select a ' + mess)
        yn = false;
      }
    });
    if (yn) {
      this.location(carryOn)
    } else {
      return false;
    }

    function carryOn(err, loc) {
      if (err) {
        return false;
      }
      formData.lng = loc.longitude;
      formData.lat = loc.latitude;
      //$.serverLog(formData);
      //return false;
      var data = {
        clientGuid: $.parseClient().clientGuid,
        auth: localStorage_a.getItem('token'),
        dsName: 'MOBILE_V5_QR_Assign',
        i: formData.k,
        j: 0,
        k: 0,
        t: formData.qr,
        p1: {
          qf: formData.f || "",
          installed: formData.i || 0,
          lat: formData.lat || null,
          lng: formData.lng || null
        }
      };

      $.jWorking('Assigning QR ...', data,
        function (msg) {
          var myData = JSON.parse(msg.d);
          var client = $.parseClient();
          //$.serverLog(myData.data);
          if (myData.data[0].messageText === 'New QR assigned') {
            $.refreshQRList(function () {
              $.jSuccess('QR Updated');
              window.location = '#home';
            });

          }
        },
        function (msg) {
          //$.serverLog(msg);
          ////alert('could not connect to server');
        }
      );
    }
  }
});
