App.SlideConstructors.SetBuildingSlide = Backbone.View.extend({
  __name__: 'App.SlideConstructors.SetBuildingSlide',
  initialize: function (p) {
    //$.serverLog(typeof qrData.parent.formModel );
    console.log(p, 'setbuildingSlide')
    var _v = this;
    _v.model = p.qrData;
    _v.buildColl = new(Backbone.Collection.extend({
      maxRow: 0,
      startRow: 0,
      filterTerm: "",
      pageLength: parseInt((($('#nebulousContainer')[0].clientHeight - 173) / 37).toFixed(0)),
      model: Backbone.Model.extend({
        idAttribute: "i",
        defaults: {
          /*BLD_NAME: "",
          i: 0,
          n: ""*/
        },
        initialize: function () {

        }
      }),
      initialize: function () {},
      pageCollection: [],
      allFilters: function (filterTerm, findSelected) {
        var _c = this
        this.filterTerm = filterTerm = filterTerm.toLowerCase() || "";
        console.log(this.filterTerm)

        var c = 0,
          i = 0,
          qrData = _v.model;
        var filtered = _c.filter(
            function (bData, ind) {
              var str = bData.get('n').toLowerCase();
              var ar = str.split(filterTerm);
              return ar[0] !== str && (function () {
                i++;
                if (!!_c.currentSel.length) {
                  c = (_c.currentSel[0].get('i') == bData.get('i')) ? i : c;
                }
                return true;
              })()
            }
          )
          .map(function (bData) {
            return bData.attributes
          });

        //return false;
        _c.maxRow = filtered.length;

        //console.log('Im a c', c)

        while (!!findSelected && _c.startRow < c - _c.pageLength) {
          _c.startRow = _c.startRow + _c.pageLength;
        }

        _c.pageCollection = filtered.slice(_c.startRow, _c.startRow + _c.pageLength);
        console.log('seeelle', _c.currentSel)
        _c.trigger('filter')
      }
    }));

    Object.defineProperty(_v.buildColl, "currentSel", {
      configurable: true,
      get: function () {
        return this.where({
          i: parseInt(_v.model.get('k'))
        });
      }
    }); // oooooh its a getter!

    this.listenTo(_v.buildColl, 'filter', this.render)

    _v.model.on('change', function (model) {
      _v.buildColl.allFilters(_v.buildColl.filterTerm);
    });
    this.buildingList(function (myData) {

      _v.buildColl.add(myData);
      //console.log(_v.buildColl, 'rerender' )

      _v.buildColl.allFilters("");
      _v.render();

    });


  },
  render: function () {
    var _v = this;
    $.getPageHtmlAsync('qrAssignSlides/SetBuilding.html', false, function (tmp) {
      var buildings = _v.buildColl.pageCollection;

      //console.log('buildins', buildings)
      //console.log('buildingscurrent', _v.buildColl.currentSel)
      var params = {
        headerTmp: $.headerTmp,
        startRow: _v.buildColl.startRow,
        pageLength: _v.buildColl.pageLength,
        buildings: buildings,
        maxRow: _v.buildColl.maxRow,
        sel: _v.buildColl.currentSel,
        tmp: 2,
        BA: !!_v.model.get('b')
      };
      var pageBody = tmp(params);

      this.$el.html(pageBody);
    }.bind(this));


  },
  events: {
    "tap .btnBuildingsNext": "nextPage",
    "tap .btnBuildingsPrevious": "previousPage",
    "tap #filterDont": function () {
      this.buildColl.startRow = 0;
      this.buildColl.allFilters("");
      return (false);
    },
    "keypress #txtFilterBuilding": function (e) {
      if (e.which == 13) {
        this.buildColl.startRow = 0;
        this.buildColl.allFilters($('#txtFilterBuilding').val());
        //this.render($('#txtFilterBuilding').val());
        return (false);
      }
    },
    "tap .btnQRCancel": "cleanup"
  },
  id: null,
  startRow: 0,
  pageLength: 5,
  buildingList: function (callb) {
    var data = {
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_buildingList',
      i: 0,
      j: 0,
      k: 0,
      t: '',
      p1: {}
    };

    $.jWorking('Acquiring building list ...', data,
      function (msg) {
        var myData = JSON.parse(msg.d);
        callb(myData.data);

      },
      function (msg) {
        console.log(msg);
        //alert('could not connect to server');
      }
    );

  },
  nextPage: function () {
    this.buildColl.startRow = this.buildColl.startRow + this.buildColl.pageLength;
    this.buildColl.allFilters(this.buildColl.filterTerm);
    return (false);
  },
  previousPage: function () {
      this.buildColl.startRow = this.buildColl.startRow - this.buildColl.pageLength;
      this.buildColl.allFilters(this.buildColl.filterTerm);
      return (false);
    }
    /*cleanup: function() {
        this.undelegateEvents();
        this.buildColl.reset();
        this.$el.empty();
    }*/
});
