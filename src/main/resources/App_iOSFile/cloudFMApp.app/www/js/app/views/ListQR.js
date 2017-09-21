window.viewConstructors.ListQRView = Backbone.View.extend({
  __name__: 'window.viewConstructors.ListQRView',
  el: '#nebulousContainer',

  qrColl: new(Backbone.Collection.extend({
    maxRow: 0,
    startRow: 0,
    filterTerm: "",
    pageLength: parseInt((((window.sectionBodyHeight - 150) - window.iosStatusBarHeight) / 38).toFixed(0)),
    model: Backbone.Model.extend({
      defaults: {
        b: null,
        f: "",
        i: 0,
        k: null,
        qr: "",
        r: null,
        x: null,
        y: null
      }
    }),
    initialize: function () {},
    allFilters: function (filterTerm) {
      var _c = this;
      this.filterTerm = filterTerm;
      var re = new RegExp(filterTerm, "i");
      var filtered = _c.filter(
          function (ob) {
            return ob.get('b') != null &&
              ob.get('f') != 'A' &&
              (!!re.test(ob.get('b')) || !!re.test(ob.get('r')));
          }
        )
        .map(function (ob) {
          return ob.attributes
        });
      _c.maxRow = filtered.length;

      return filtered.slice(_c.startRow, _c.startRow + _c.pageLength);
    }
  }))(),
  initialize: function () {
    var client = {};
    if (localStorage_a.getItem('client')) {
      client = $.parseClient();
    }
    if (client.qrCodes === undefined) {
      window.location = '#setClient';
      return;
    }
    //$('.divFooter').remove();
    this.qrColl.set(client.qrCodes);
    this.qrColl.allFilters('');
    this.render();
  },

  render: function (filterTerm) {
    var currentPage = this;
    filterTerm = filterTerm || "";
    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {
      var startRow = currentPage.qrColl.startRow;
      var pageLength = currentPage.qrColl.pageLength;
      var maxRow = currentPage.qrColl.maxRow;
      var qrLi = currentPage.qrColl.allFilters(filterTerm);

      try {
        var qrCodes = qrLi;
      } catch (e) {
        var qrCodes = [];
      }
      var showNext = 1;
      var showPrevious = 0;
      var lastRow = startRow + pageLength;

      if (lastRow > maxRow - 1) {
        lastRow = maxRow;
        showNext = 0;
      }
      if (startRow !== 0) {
        showPrevious = 1;
      }

      var renderParams = {
        showNext: showNext,
        qrCodes: qrCodes,
        showPrevious: showPrevious,
        startRow: startRow,
        lastRow: lastRow,
        pageLength: pageLength,
        qrLi: qrLi,
        maxRow: maxRow
      };

      $.getPageHtmlAsync('listQR.html', false, function (tmp) {

        window.footerView.footer(this, 'listQR.html', renderParams);

        var pageBody = tmp(renderParams);

        this.$el.empty();
        this.$el.html(pageBody);

      }.bind(this));
      return this;
    }

  },

  events: {
    "tap .btnQRNext": "nextPage",
    "tap .btnQRPrevious": "previousPage",
    "tap .btnHome": "cleanup",
    "tap a.remoteBuildingCheckIn": "selectQR",
    "tap #filterDont": function () {
      this.qrColl.startRow = 0;
      this.render();
      return (false);
    },
    "submit form.frmFilterQR": function () {
      this.qrColl.startRow = 0;
      this.render($('#txtFilterBuilding').val());
      return (false);
    }
  },

  cleanup: function () {
    //console.log('clean')

    this.undelegateEvents();
    this.$el.replaceWith(this.$el.clone(false));
    this.qrColl.reset();
    this.$el.empty();
    this.remove();
    //window.App.routerInstance.navigate('#home', {trigger: true});
  },
  nextPage: function () {
    //console.log(this.qrColl.startRow+this.qrColl.pageLength)
    this.qrColl.startRow = this.qrColl.startRow + this.qrColl.pageLength;
    this.render(this.qrColl.filterTerm);
    return (false);
  },
  previousPage: function () {
    this.qrColl.startRow = this.qrColl.startRow - this.qrColl.pageLength;
    this.render(this.qrColl.filterTerm);
    return (false);
  },
  selectQR: function (event) {
    var qrGUID = $(event.currentTarget).attr('data-qrGUID');
    this.cleanup();
    window.location = '#qrScan/' + qrGUID;
    return (false);
  }

});
