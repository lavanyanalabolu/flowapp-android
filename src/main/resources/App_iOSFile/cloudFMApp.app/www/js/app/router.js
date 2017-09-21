Backbone.View.buildWithArray = function (aArgs) {
  var oNew = Object.create(this.prototype);
  this.apply(oNew, aArgs);
  return oNew;
}; //very cool bit of code https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply

(function () {
  window.vievManager = {
    views: {},
    loadView: function () {
      console.log(this.views);
      var params = _.values(arguments).slice(1);
      var viewName = arguments[0];

      if (!!this.views[viewName] && !_.isEmpty(this.views[viewName])) {
          //this.close(viewName);
          this.views[viewName].render();
      }else{

        if (!!window.viewConstructors[viewName]) {
          window.viewConstructors[viewName].__name__ = viewName;
          this.views[viewName] = window.viewConstructors[viewName].buildWithArray(params);

          !!this.views[viewName] && !!this.views[viewName] && (this.views[viewName].viewUrl = window.location.hash);

        } else {
          alert('could not locate view');
        }
      }
    },
    close: function (viewName) {
      if (!!this.views[viewName]) {
        this.views[viewName].unbind();
        console.log('close -----------------------', viewName);
        this.views[viewName].$el.empty();
        //console.log(this.views[viewName].el)
        if (!!this.views[viewName].el.parentNode) {
          this.views[viewName].el.parentNode.replaceChild(this.views[viewName].$el.clone(false, false)[0], this.views[viewName].el);
        }
        !!this.views[viewName].cleanup && this.views[viewName].cleanup();
        this.views[viewName].undelegateEvents();
        this.views[viewName].remove();
        this.views[viewName].off(null, null, this);

        this.views[viewName].inactive = true;

        if (typeof this.views[viewName].close === 'function') {
          this.views[viewName].close();
        }
        delete this.views[viewName];
        !!this.views[viewName] && (delete this.views[viewName]);

      }
    },
    destroy: function (viewName) {
      _.each(this.views[viewName], function (v) {
        console.log('des ', viewName);
        this.close(viewName);
      }, this);
    },
    destroyAll: function () {
      _.each(this.views, function (v, viewName) {
        this.close(viewName);
      }, this);
      App.routerInstance = new App.Router();
    }
  };
})();

(function () {

  App.Router = Backbone.Router.extend({
    el: $('body'),
    initialize: function () {},
    routes: {
      "": "home",
      "home": "home",
      "update": function () {
        $.setHashChain();
        window.cfmUpdateView.render();
      },
      "login": "signIn",
      "logout": "logout",
      "setClient": "home",
      "setClient2": "setClient",
      "prox": "proximityCheckin",
      "qrScan/:qr": "qrScan",
      "qrAssign(/*subroute)": "qrAssign",
      "test": "test",
      "listQR": "listQR",
      "telCheckIn": "telCheckIn",
      "register": "register",
      "qrCheckIn": "qrCheckIn",
      "taskList": "taskList",
      "viewTask/:mode(/*subroute)": "viewTask",
      "serviceAsset": "serviceAsset",
      "taskFinished": "taskFinished",
      "settings": "settings",
      "timesheets": "timeSheets",
      "allocation": "allocation",
      "allocateEngineer": "allocateEngineer",
      "htmlQRScan": "htmlQRScan"
    },
    home: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {

        $.setHashChain();

        //window.vievManager.destroyAll();
        window.vievManager.loadView('HomeView');
      }
      console.log('Loading HomeViewssss');
    },
    signIn: function () {
      console.log('Loading SignIn');
      $.setHashChain();
      window.vievManager.destroyAll();
      window.vievManager.loadView('SignInView');
    },
    logout: function () {

      var m = localStorage.mobileNumber,
        v = localStorage_a.getItem('version'),
        uploadCache = {
          eventNotes: []
        };

      this.res = localStorage_a.getItem('resources');

      localStorage_a.cached = {};
      localStorage.clear();
      localStorage_a.setItem('version', v);
      window.footerView.footer({
        events: {}
      }, 'blank.html', {});
      localStorage.mobileNumber = m;

      localStorage_a.setItem('uploadCache', uploadCache);

      window.vievManager.destroyAll();
      this.navigate('login', {
        trigger: true,
        replace: true
      });
    },
    setClient: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('SetClientView');
      }
    },
    proximityCheckin: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('OptionsView');
      }
      console.log('Loading OptionsView');
    },
    qrScan: function (qr) {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('QRScanView', {
          qr: qr
        });
      }
      console.log('Loading QR Scan');
    },
    qrAssign: function (subroute) {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();
        if (!App.Subrouters.qrAssign) {
          App.Subrouters.qrAssign = new App.SubrouteConstructors.qrAssign("qrAssign/");
        }
        window.vievManager.destroyAll();
        var q = dataClientToken();
        subroute = subroute || 0;
        q.set($.parseClient().qrAssign);
        routeSlideController.setRouter(App.Subrouters.qrAssign, subroute, {
          qrData: q
        });
        window.vievManager.loadView('QRScanPromptView', {
          qrData: q
        }, subroute);
      }

    },
    test: function () {
      console.log('Test');
    },
    listQR: function () {
      console.log('List QR');
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();
        window.vievManager.destroyAll();
        window.vievManager.loadView('ListQRView');
      }
      console.log('Loading QR Scan');
    },
    telCheckIn: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();
        window.vievManager.destroyAll();
        window.vievManager.loadView('TelCheckInView');
      }
    },

    htmlQRScan: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();


        window.vievManager.destroyAll();
        window.vievManager.loadView('htmlQRScanView');
      }
    },
    register: function () {
      console.log('Loading Register');
      $.setHashChain();
      new RegisterView();
    },
    qrCheckIn: function (qr) {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('ScanQRView', {
          qr: qr
        });
      }
      console.log('Loading QR Scan');
    },
    taskList: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('taskListView');
      }
      console.log('Loading Task List');
    },
    viewTask: function (mode, subroute) {
      console.log('viewingTask', mode, subroute, routeSlideController);
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {

        $.setHashChain();

        if (!App.Subrouters.viewTask) {
          App.Subrouters.viewTask = new App.SubrouteConstructors.viewTask("viewTask/" + mode + "/");
        } else {}
        window.vievManager.destroyAll();
        window.vievManager.loadView('viewTaskControllerView', {
          mode: mode
        }, subroute);
      }
    },
    serviceAsset: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('serviceAssetView');
      }
      console.log('Loading View Finish Task');
    },
    taskFinished: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('TaskFinishedView');
      }
      console.log('Loading View Finish Task');
    },
    settings: function () {
      console.log('ShowmeSettings');
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('SettingsView');
      }
      console.log('Loading Settings');
    },
    timeSheets: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('TimesheetsView');
      }
      console.log('Loading Settings');
    },
    allocation: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('AllocationView');
      }
      console.log('Loading Settings');
    },
    allocateEngineer: function () {
      if (!localStorage_a.getItem('token')) {
        window.location = '#login';
      } else {
        $.setHashChain();

        window.vievManager.destroyAll();
        window.vievManager.loadView('AllocateEngineerView');
      }
      console.log('Loading Settings');
    }

  });

})();
