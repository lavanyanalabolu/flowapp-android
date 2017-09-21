;
(function () {
  var assetView = baseView.extend({
    __name__: 'assetView',
    initialize: function (params) {
      _.extend(this, {
        assetPhotos: clientCollectionToken(),
        clientGuid: $.parseClient().clientGuid
      }, params);
      this.listenTo(this.model.collection, "filter", function () {
        this.$el.css('display', this.model.get('hidden') ? 'none' : 'initial');
      });
      this.render();
    },
    detailState: 0,
    render: function () {
      this.$el.html(this.template(this.serialize()));
    },
    serialize: function () {
      return _.defaults(this.model.toJSON(), {
        locationString: ''
      });
    },
    getAssetPhotos: function () {
      this.assetPhotos.fetch({
        clientGuid: this.clientGuid,
        auth: localStorage_a.getItem('token'),
        dsName: 'MOBILE_V5_assetDetailPhotos',
        t: this.model.get('assetGuid')
      }, {
        deferMessage: "Downloading asset photos ..."
      });
    },
    renderPhotos: function () {
      var tpl = 'buildingAssets/assetDetailsPhotos.html',
        pLen = this.assetPhotos.size(),
        r = this.photosRemaining = 3 - pLen;

      $.getPageHtmlAsync(tpl, false, function (template) {
        this.$('.assPics>.pics').html(template({
          clientGuid: this.clientGuid,
          photos: this.assetPhotos.toJSON(),
          r: r
        }));
      }.bind(this));

    },
    events: {
      "tap .btnAssDeets": function () {
        var st = this.el.querySelector('.assBody').style;
        if (!this.detailState) {
          st.transform = st.webkitTransform = 'translate3d(-100%,0,0)';
          if (!this.assetPhotos.models.length) {
            this.listenToOnce(this.assetPhotos, 'sync', this.renderPhotos);
            this.getAssetPhotos();
          }
        } else {
          st.transform = st.webkitTransform = 'translate3d(0,0,0)';
        }
        this.detailState = !this.detailState;

      },
      "tap .assPicker": function () {
        this.model.trigger('choose', this.model);
      }
    }
  });
  window.viewConstructors.searchableAssetList = baseView.extend({
    __name__: 'window.viewConstructors.searchableAssetList',
    className: 'sectionBody scroll',
    initialize: function (params) {

      _.extend(this, params);
      //this.renderFooter = this.renderFooter.bind(this);

      $.getPageHtmlAsync('buildingAssets/searchableAssetList.html', true, function (tmp) {

        var tmpReg = /(?:<script.*?id\=")(.+?)".*>([.\s\S]*?)(?:<\/script)/g;
        this.templates = {};
        tmp.replace(tmpReg, function (m, $1, $2, i) {
          this.templates[$1] = _.template($2);
          return;
        }.bind(this))

        this.render();
        this.afterRender();

        this.parentEl.html(this.$el);

      }.bind(this));
      this.listenToOnce(this.assetList, 'choose', this.trigger.bind(this, 'choose'));
    },
    subviews: [],
    render: function (cb) {
      console.log(this.serialize());
      this.$el.html(this.templates['state' + this.state](this.serialize()))
      this.renderAssetList();
      !!cb && cb();
    },
    afterRender: function () {
      if (this.padTop) {
        this.$('.addPad').css({
          'padding-top': '40px'
        });
      }
    },
    renderAssetList: function () {
      console.log('assetLister');
      this.$('.assetList').html(
        this.assetList.reduce(function (memo, a) {
          return memo.add(
            this.subviews[this.subviews.push(
              new assetView({
                model: a,
                template: this.templates.assetStub
              })
            ) - 1].$el
          );
        }, $([]), this)
      );
    },
    matesquei: function (e) {
      if (!e.target.value) {
        e.currentTarget.previousElementSibling.style.opacity = 0;
      } else {
        e.currentTarget.previousElementSibling.style.opacity = 1;
      }
    },
    filterCollection: function (e) {
      /*var val = e.target.value,
          name = e.target.name;
          */
      this.assetList.each(function (man) {
        var hide = false;
        _.each(this.$('.filterList>input'), function (inp) {
          if (inp.value) {
            hide = hide || (man.get(inp.name) || '').toLowerCase().indexOf(inp.value.toLowerCase()) === -1;
          }
        });
        if (hide) {
          man.set({
            'hidden': true
          });
        } else {
          man.set({
            'hidden': false
          });
        }
      });
      //this.$('.filterList>input')
      //this.assetList.map(function(){})
      this.assetList.trigger('filter');
    },
    events: {
      "input .filterList>input": "filterCollection",
      "input .matesquei": "matesquei",
      "blur .matesquei": "matesquei",
      'tap .backToMain': 'backToMain',
      "tap .btnStepBack": function () {
        this.state = 1;
        this.render(this.renderFooter);
      }
    },
    viewState: 1,
    renderFooter: function () {
      window.footerView.footer(this, 'searchableAssetList' + this.state + '.html', {});
    },
    serialize: function () {
      console.log(this, 'is this');
      return {
        state: this.state,
        building: $.parseClient().buildingCheckIn.buildingName
      };
    }
  });
})();
