;
(function () {
  /*var assetView = baseView.extend({ __name__:'assetView',

  });*/
  window.viewConstructors.transferAssetData = baseView.extend({
    __name__: 'window.viewConstructors.transferAssetData',
    className: 'fullHeightAlt',
    initialize: function (params) {
      _.extend(this, params);
      this.renderFooter = this.renderFooter.bind(this);
      routeSlideController.disable();
      $.getPageHtmlAsync('buildingAssets/transferAssetData.html', true, function (tmp) {

        var tmpReg = /(?:<script.*?id\=")(.+?)".*>([.\s\S]*?)(?:<\/script)/g;
        this.templates = {};
        tmp.replace(tmpReg, function (m, $1, $2, i) {
          this.templates[$1] = _.template($2);
          return;
        }.bind(this))

        this.pullDowner();

        this.render(function () {
          $('.asset').hide();
          $(".transferAsset").show();
          this.toggleTop(undefined, this.toggleState);
          this.renderFooter();
        }.bind(this));

      }.bind(this));

      if (!!this.assetList.models[0] && typeof (this.assetList.models[0].get('locationString')) !== 'string') {
        this.getAssetList(true);
      }
      this.on('stateChange', function (s) {
        this.render(function () {
          var hasSticker = this.$('#hasOrigY');
          this.renderFooter();
          if (s == 2) {
            this.fancybit($('.assetReGlyph'), 500);
            this.fancybit($('.assetReText'), 500);
          }
          hasSticker.prop('checked', this.state === parseFloat(hasSticker[0].value));

        }.bind(this));
      });

      $('#transferAsset').html(this.$el);
      this.listenTo(this.assetList, 'choose', function (m) {
        //console.log(a,b,c)
        this.setQROne(m.get('qrCode'));
      })
    },
    render: function (cb) {
      this.$('#mainSection').html(this.templates['state' + this.state](this.serialize()))
      console.log(this.state);
      this.$('.toggleTopBtn').toggleClass('disabled', (this.state === 0 || this.state > 1));
      !!cb && cb();
    },
    events: {
      //"tap label": function(e){ e.preventDefault(); $(e.currentTarget).trigger('click') ;return false; },
      "tap .hasOrig": function (e) {
        e.currentTarget.previousElementSibling.checked = true;
        $(e.currentTarget.previousElementSibling).change();
      },
      "change [name='hasOrig']": "existingSticker",
      "tap .scanExisitingAsset": "scanQR",
      "tap .scanNewSticker": "scanQR",
      'tap .backToMain': 'backToMain',
      "tap .toggleTopBtn": 'toggleTop',
      "tap .btnStepBack": function () {
        this.state = 1;
      }
    },
    viewState: 0,
    bit: 1,
    toggleState: 0,
    renderFooter: function () {
      window.footerView.footer(this, 'transferAssetData' + this.state + '.html', {});
    },
    serialize: function () {
      return {
        state: this.state
      };
    },
    pullDowner: function () {
      this.$el.html(this.templates.pullDown());

    },
    toggleTop: function (e, a) {

      var u = this.toggleState = a === undefined ? !this.toggleState : a;

      var st = this.$('.toggleBottom')[0].style,
        h = this.$('.toggleTop>div')[0].offsetHeight;

      st.transform = st.webkitTransform = ''.concat('translate3d(0,', (u ? 0 : h), 'px, 0)');

    },
    existingSticker: function (e) {
      var bit = this.state = this.bit = parseFloat(e.target.value);
      console.log('this.state', this.state, this.viewState)
      if (this.state === 0.5) {
        this.subView = new window.viewConstructors.searchableAssetList({
          assetList: this.assetList,
          model: clientModelToken(),
          client: $.parseClient(),
          backToMain: this.backToMain.bind(this),
          parentEl: this.$('#mainSection'),
          padTop: true
        });
      }
      this.toggleTop(undefined, 1);
    },
    scanQR: function (e) {
      var that = this;
      this.undelegateEvents();

      var Success = function (res) {
        this.delegateEvents();
        if (res.cancelled) return false;

        var pu = $.parseURI(res.text),
          guid = pu.vars.c.substring(7).toUpperCase(),
          hostname = pu.hostname,
          qrClient = pu.vars.c.substring(0, 7);
        if (hostname != 'qrcloud.co.uk' || qrClient.toUpperCase() != $.parseClient().qrIdentity.toUpperCase()) {
          $.jAlert('This QR label is not associated with the current client (' + $.parseClient().clientName + ')');
          return false;
        } else {
          that[this.state === 1 ? 'scanResultOne' : 'scanResultTwo'](guid);
        }
      }.bind(this);
      var Error = function (err) {
        this.delegateEvents();
      }.bind(this);
      try {
        var inBrowser = document.URL.indexOf('http://') !== -1 || document.URL.indexOf('https://') !== -1;
        var scanner = window.cordova.plugins.barcodeScanner || window.cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan(Success, Error);
      } catch (err) {
        this.delegateEvents();
        $.jAlert(err.message);
      }
    },
    fancybit: function (jqCol, t) {
      var glyphs = jqCol,
        rev;

      function setOpacity(node, i) {
        var c = function () {
          rev !== undefined && rev();
          node.style.opacity = 0.4;
          setOpacity(glyphs[i + 1], i + 1);
        };
        if (i !== 0 && !!glyphs[i + 1]) {
          node.addEventListener('webkitTransitionEnd', c, false);
          node.addEventListener('transitionend', c, false);
          rev = function () {
            node.removeEventListener('webkitTransitionEnd', c, false);
            node.removeEventListener('transitionend', c, false);
          };
        }
        if (i === 0) {
          console.log('doC');
          setTimeout(c, t);
        } else {
          node.style.opacity = 1;
        }
      }
      setOpacity(glyphs[0], 0);
    },
    scanResultOne: function (guid) {
      console.log(guid);
      var asset = this.assetList.findWhere({
        'qrCode': guid
      });
      console.log(asset)
      if (!asset) {
        this.$('.noAsset').show();
        setTimeout(function () {
          this.$('.noAsset').hide()
        }.bind(this), 2200)
      } else {
        this.setQROne(guid)
      }
    },
    setQROne: function (guid) {
      this.model.set('QRGuid_1', guid);
      console.log(this.model, 'thisisthis');
      this.state = 2;
    },
    getAssetList: function (newAsset) {
      //localStorage_a.removeItem('assetList');
      var assetList = localStorage_a.getItem('assetList');
      if (assetList && !newAsset) {
        this.assetList.reset(assetList, {
          silent: true
        }).trigger('sync');
      } else {
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
      }
    },
    scanResultTwo: function (guid) {

      var callback = function (model, response, xhr, error) {
        if (!!response && !!JSON.parse(response.d).data[0].error) {
          this.$('.existingAsset').show();
          return;
        }
        /*console.log('addingNew Model', model, this.assetList, !error);

        !error && this.assetList.add(model);
        localStorage_a.setItem('assetList', this.assetList.toJSON() );*/

        this.state = !!error ? 3 : 4;
        this.getAssetList(true);

      }.bind(this);

      this.model.set('QRGuid_2', guid);

      this.model.save({
        auth: localStorage_a.getItem('token'),
        clientGuid: this.client.clientGuid,
        dsName: 'MOBILE_V5_assetTagTransfer',
        p1: this.model.toJSON()
      }, {
        error: function (xhr, statusTxt, thrown) {

          var e = new Error('Problem transferring asset data');
          $.jAlert('Problem transferring asset data');
          return callback(null, null, null, e);
        },
        deferMessage: 'Tansferring tag data ...'
      });
      this.listenToOnce(this.model, 'sync', callback);
    }
  });
})();
