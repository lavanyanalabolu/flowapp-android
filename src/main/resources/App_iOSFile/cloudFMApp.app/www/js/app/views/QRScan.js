window.viewConstructors.QRScanView = Backbone.View.extend({ __name__:'window.viewConstructors.QRScanView',
  parent: '#nebulousContainer',
  className: 'xpanel panel-primary',
  initialize: function (options) {

    $(this.parent).html(this.$el);
    _.extend(this, options, {
      client: $.parseClient()
    });

    if(!this.client){
      window.location = '#home';
    }

    this.buildingInfo();

    if (this.client.buildingCheckIn.onSite == 1) {
      this.checkInStatus();
      this.$('#btnCheckIn').hide()
    } else {
      this.render();
    }
  },
  events: {
    "tap #btnCheckIn": "checkInStatus",
    "tap #btnRetryGeo": "handleLocation",
    "tap #btnCheckInConfirm": 'checkIn',
    "tap #btnProceedAfterTaskList": "proceedToTaskList",
    "tap #btnCheckOut": 'checkOut',
    "tap .alternateBuildingCheckIn": "chooseBuildingOnSite"
  },
  render: function () {
    var currentPage = this;
    var renderParams = {
      currentPage: currentPage,
      qrCode: this.qr
    };
    var template = $.getPageHtmlAsync('qrScan.html', false, function (tmp) {
      this.$el
        .html(tmp(this.serialize()));
      window.footerView.footer(this, 'qrScan.html', renderParams);
      this.handleLocation();
    }.bind(this));
  },
  buildingInfo: function () {
    this.building = _.filter(this.client.qrCodes, function (c) {
      return c.qr.toUpperCase() == this.qr.toUpperCase();
    }, this)[0]

    if (_.isEmpty(this.building)) {
      $.jAlert('Could not determine QR code');
      return;
    }
  },
  chooseBuildingOnSite: function (e) {
    var buildingID = $(e.currentTarget).attr('data-buildingID');
    this.alternateBuildingID = buildingID;
    this.building = _.filter(this.client.qrCodes, function (c) {
      return c.k == buildingID;
    })[0];
    this.checkInStatus();

  },
  checkInStatus: function () {
    var model = dataClientToken();
    var location = localStorage_a.getItem('location') || {
      longitude: 0,
      latitude: 0
    };
    model.fetch({
      clientGuid: this.client.clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_buildingCheckInStatus',
      p1: {
        lng: location.longitude || 0,
        lat: location.latitude || 0
      }
    }, {
      error: this.fetchError,
      deferMessage: 'Acquiring check in status ...'
    });

    this.listenToOnce(model, 'sync', function (m) {
      m.defd.resolve();
      if (_.isEmpty(m.attributes)) {
        this.confirmCheckInView();
      } else {
        _.extend(this.client.buildingCheckIn,
          m.toJSON(), {
            onSite: 1,
            qrCode: this.qr
          });
        localStorage_a.setItem('client', this.client);

        var params = _.extend({
          qrCode: this.qr
        }, m.toJSON());
        this.checkInStatusView(params);
      }
    }, this);
  },
  checkInStatusView: function (model) {
    $.getPageHtmlAsync('checkInStatus.html', false, function (tmp) {
      window.footerView.footer(this, 'blank.html', this.renderParams);
      this.$el.html(tmp(model));
    }.bind(this));
    return this;
  },
  confirmCheckInView: function () {
    var location = localStorage_a.getItem('location') || {
      longitude: 0,
      latitude: 0
    };
    var renderParams = {
      qr: this.qr,
      x: location.longitude || 0,
      y: location.latitude || 0,
      building: this.building,
      client: this.client
    };
    $.getPageHtmlAsync('confirmCheckIn.html', false, function (tmp) {
      this.$el //.addClass('xpanel panel-primary')
        .html(tmp(renderParams));
      var agenda = _.extend(contractorPortal.collection.multiClient(), {
        comparator: function (m) {
          return m.get('etaDate');
        }
      });

      var fetchParams = {
        auth: localStorage_a.getItem('token'),
        contractorGuid: localStorage_a.getItem('contractorGUID'),
        dsName: "CLOUDFM_allocatedVisitsMobile",
        p1: {
          engineerGuid: localStorage_a.getItem('token'),
          j: 1
        }

      };
      //console.log('Approximating',window.footerView.$('#btnCheckInConfirm'));

      $.when(
        agenda.fetch(fetchParams, { deferMessage: 'Approximating mileage ' })
      ).done(function(){
        //console.log(agenda);
        var job = agenda.sortBy(function(j) {
          return j.get("RES_ArriveDate") || '0';
          return j.get("RES_ArriveDate") || '0';
        }).pop();

        var ljd = 0, ljtt = 0, resArrive;

        if(job){
          resArrive = job.get("RES_ArriveDate");
          if(location.latitude && resArrive && new Date().toDateString() === new Date(job.get("RES_DepartDate")).toDateString()){
            console.log('isToday', job);
            ljtt = new Date() - new Date(job.get("RES_DepartDate"));
            ljd = getDistance({
              latitude: parseFloat(parseFloat(job.get('BLD_LATITUDE')) || 0),
              longitude: parseFloat(parseFloat(job.get('BLD_LONGITUDE')) || 0)
            }, {
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude)
            }) * 0.621371192;
          }
          //console.log(job,this.proximity);
        }

        var miles = Math.round(ljd+(this.proximity || 0));
        var time = Math.round(ljtt/1000/60);

        //this.$('#txtMileageToSite').val( miles );
        this.$('#txtTravelTime').val( time );

      }.bind(this))
      .always(function(){
        window.footerView.$('#btnCheckInConfirm').removeClass('disabled');
      });

      window.footerView.footer(this, 'confirmCheckIn.html', renderParams);

    }.bind(this));
    return this;
  },
  serialize: function () {
    return {
      building: this.building
    };
  },
  fetchError: function () {
    $.connectionRecovery();
  },
  location: function (callback, ctx) {
    this.proximity = null;
    // var cachedLocation = localStorage_a.getItem('location') || { longitude: 0, latitude: 0 };
    // var expire =  new Date().getTime() - (600000)
    // if ( !_.isEmpty( cachedLocation )  && cachedLocation.timestamp > expire ) {
    //     $.jSuccess('Used cached location...')
    //     return callback.call( ctx, null, cachedLocation )
    // }
    var options = {
      maximumAge: 600000,
      timeout: 6000,
      enableHighAccuracy: true
    };
    var defed = $.Deferred();

    function success(pos) {
      defed.resolve();
      var p = pos.coords || pos;
      var location = {
        latitude: "" + p.latitude + "",
        longitude: "" + p.longitude + "",
        timestamp: pos.timestamp
      };

      localStorage_a.setItem('location', location);
      callback.call(ctx, null, location);
    }

    function error(err) {
      if (err.code === 1 && !!$.parseClient().currentTask) {

        var _m = new Model({
          'locationServices': 0
        },{ url : serverPath + '/dataClientToken' });


        _m.save({
          clientGuid: $.parseClient().clientGuid,
          auth: localStorage_a.getItem('token'),
          dsName: 'MOBILE_V5_updateLocationServices',
          t: '',
          i: _m.get('locationServices'),
          k: $.parseClient().currentTask.resourceID,
          p1: {}
        },{
          error: function (xhr, statusTxt, thrown) {
            console.log(statusTxt, 'STATUSTEXT');
          }
        });

      }
      defed.resolve(err.message || err.code, true);
      callback.call(ctx, err.message || err.code , null);
      throw err.message || err.code;
    }

    $.jSuccess('Finding your location...', defed);
    try {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } catch (err) {
      error(err);
    }
  },
  checkProximity: function (position) {
    var proximity = getDistance({
      latitude: parseFloat(this.building.x || 0),
      longitude: parseFloat(this.building.y || 0)
    }, {
      latitude: parseFloat(position.longitude),
      longitude: parseFloat(position.latitude)
    }) * 0.621371192;
    this.proximity = proximity;

    if (proximity <= window.proximityMax) {
      this.$('#alerts').html(
        '<div style="font-size:16px;margin-bottom:10px;" class="btn btn-success btn-block">You are ' + (proximity).toFixed(1) + ' miles away</div>'
      ).show();
    } else {
      this.$('#alerts').html(
        '<div style="font-size:16px;margin-bottom:10px;" class="btn btn-danger btn-block">You are ' + (proximity).toFixed(1) + ' miles away</div><p>Too far away.  Location will be verified.</p>'
      ).show();
    }
    $('#btnCheckIn').fadeIn();
    return proximity;
  },
  handleLocation: function () {
    this.location(function (err, location) {
      console.log('yep',err,location);
      if (err) {
        this.$('#alerts').html('<div class="alert alert-danger">Could not access your location!<br/>If you are using an Android device you may need to change your location settings to &quot;High accuracy&quot; mode. This can be enabled in Settings&gt;Personal&gt;Location</div>').show();
        $('#btnRetryGeo').show();
        $('#btnCheckIn').fadeIn();
        return;
      }else{
        this.checkProximity(location);
      }
    }, this);
  },

  checkIn: function () {
    var travelTime = $('#txtTravelTime').val();
    var mileage = $('#txtMileageToSite').val();
    if (mileage === '') return $('#txtMileageToSite').focus();
    if (travelTime === '') return $('#txtTravelTime').focus();
    var location = localStorage_a.getItem('location') || {
      longitude: 0,
      latitude: 0
    };
    var model = dataClientToken();

    /* JMB Dec 2016 - i: this.alternateBuildingID, Used as an override if multiple sites available via one QR Code - if NULL then ignored */

    model.save({
      clientGuid: this.client.clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_buildingCheckIn',
      t: this.qr,
      i: this.alternateBuildingID,
      p1: {
        lng: location.longitude || 0,
        lat: location.latitude || 0,
        milage: mileage,
        travelTime: travelTime
      }
    }, {
      error: this.fetchError,
      deferMessage: "Checking in ..."
    });
    this.listenToOnce(model, 'sync', this.handleCheckin);
  },
  handleCheckin: function (m) {
    if (_.isEmpty(m.attributes)) {
      $.jAlert('Error checking in');
      return
    } else {
      console.log(m.attributes)
      _.extend(this.client.buildingCheckIn,
        m.toJSON(), {
          onSite: 1,
          qrCode: this.qr
        });

      this.buildingAssetList();
      localStorage_a.setItem('client', this.client);

      $.getPageHtmlAsync('downloadingAvailableTasks.html', false, function (tmp) {
        this.$el.html(tmp());
        window.footerView.footer(this, 'blank.html', {});
      }.bind(this));

    }
  },
  buildingAssetList: function () {
    this.assetList = clientCollectionToken();
    this.listenToOnce(this.assetList, 'sync', function (c) {
      localStorage_a.setItem('assetList', c.toJSON());
    });
    this.assetList.fetch({
      auth: localStorage_a.getItem('token'),
      clientGuid: this.client.clientGuid,
      dsName: 'MOBILE_V5_taggedAssetsOnBuilding',
      i: this.client.buildingCheckIn.buildingID
    }, {
      deferMessage: "Downloading asset list ...",
      silent: true
    });

  },
  proceedToTaskList: function () {
    window.location = '#taskList';
  },
  checkOut: function () {
    this.location(function (err, location) {
      location = !err ? location : localStorage_a.getItem('location') || {
        longitude: 0,
        latitude: 0
      };
      var model = dataClientToken();
      var checkInID = this.client.buildingCheckIn.checkInID;
      if (checkInID !== '') {
        model.save({
          clientGuid: this.client.clientGuid,
          auth: localStorage_a.getItem('token'),
          dsName: 'MOBILE_V5_buildingCheckOut',
          i: checkInID,
          t: this.qr,
          p1: {
            lng: location.longitude || 0,
            lat: location.latitude || 0
          }
        }, {
          error: this.fetchError,
          deferMessage: "Checking out ..."
        })
        this.listenToOnce(model, 'sync', this.handleCheckOut)
      }
    }.bind(this));
  },
  handleCheckOut: function (m) {
    console.log(m);
    var myData = m.get('messageText') || ''; // JSON.parse(msg.d);

    if (myData === 'OK') {
      var client = $.parseClient();
      _.each(client.buildingCheckIn, function (f, k) {
        client.buildingCheckIn[k] = 0;
      });
      localStorage_a.setItem('client', client);
      //$.jSuccess('Checked out');
      window.location = '#home';
    } else {
      $.jAlert('Error checking out');
      window.location = '#home';
    }

  }
});
if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  };
}

function getDistance(start, end, decimals) {
  //console.log('distance worker outer', start, end, decimals)
  decimals = decimals || 2;
  var earthRadius = 6371; // km
  lat1 = parseFloat(start.latitude);
  lat2 = parseFloat(end.latitude);
  lon1 = parseFloat(start.longitude);
  lon2 = parseFloat(end.longitude);

  var dLat = (lat2 - lat1).toRad();
  var dLon = (lon2 - lon1).toRad();
  var lat1 = lat1.toRad();
  var lat2 = lat2.toRad();

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = earthRadius * c;
  return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
