(function ($) {

  Number.prototype.toRangeVal = function (min, max) {
    return min > this || this > max ? this > max ? max : min > this ? min : void 0 : this;
  };

  var winW = window.innerWidth;

  window.routeSlideController = function () {

    _.extend(this, Backbone.Events);


    var idleCallbackArray = [];
    function cancelIdleCallbacks(){
      clearTimeout( idleCallbackArray.pop() );
    };

    function registerSlideBase(){
      return window.App.viewTaskSlides['viewTaskSlides/slideBase.html']({});
    }

    this.replaceWithClone = function(el){
      if(!el) return;
      var clone = el.cloneNode(false);
      clone.innerHTML = this.slideBase;
      if(el.parentNode) el.parentNode.replaceChild(clone, el);
    }

    this.preload = 2;
    this.mult = 1.3;

    this.activeSlides = [];
    this.slidesOrdered = [];

    this.loadedViews = {};
    this.routeEls = {};

    this.finishTask = false;

    this.orientation = window.orientation;

    this.resizeReslide = function () {
      if (window.orientation !== this.orientation && this.mainView) {
        this.mainView.slideAnimate(true, this.activeSlide);
      }
      this.orientation = window.orientation;
    };

    window.addEventListener('resize', this.resizeReslide);

    this.setRouter = function (router, subroute, params) { // initialize
      this.router = router;
      this.params = params;
      this.slides = _.values(router.routes).reverse();

      if (!!this.mainView) {
        this.stopListening();
        this.mainView.cleanup();
      }

      this.mainView = new viewConstructor({ mult: this.mult, preload: this.preload });

      this.listenTo(this.mainView, 'slideComplete', this.slideCompleteFn);
      this.listenTo(this.mainView, 'transmitDirection', this.setRoute);
      this.listenTo(this.mainView, 'transmitTransform', this.rafLoop);
      this.listenTo(this.mainView, 'panStart', this.cancelIdleCallbacks);

      console.log('initialized');
    };

    this.slideFilter = function (array, omit, route) {

      this.closeAll();
      this.enable();

      if (!array || !array.length) {
        this.slides = _.values(this.router.routes).reverse();
      } else {

        omit = (omit === undefined) ? true : omit;

        this.slides = _[omit ? 'difference' : 'intersection'](_.values(this.router.routes).reverse(), array);

        _.each(_.omit(this.loadedViews, _.values(this.slides)), function (s) {
          if (this.activeSlides.indexOf(s) !== -1) {
            this.slideTo(this.slides.pop().split('__')[0]);
          }
          this.closeView(this.loadedViews[s], s);
        }, this);
      }

      this.slideLength = this.slides.length;

      if(this.slides.length!==1){
        for (; this.slides.length < 3 ;) {
          this.slides = this.slides.concat(this.slides);
          this.slides.splice(3);
        }
        console.log('ENABLE');
        this.enable();
      }else{
        this.disable();
      }

      var routeValid = 0;

      this.slides = _.map(this.slides, function (s) {
        if (s === route) routeValid = 1;
        return s + '__' + _.uniqueId();
      });

      if (routeValid === 0) route = 0;

      var len = this.slideLength = this.slides.length;

      this.half = len / 2;

      this.halfF = Math.floor(this.half);
      this.halfC = Math.ceil(this.half);

      this.min = this.halfF - this.preload;
      this.max = this.halfF + this.preload;

      this.activeSlides = new Array(len);
      this.slidesOrdered = new Array(len);

      this.generateSlideEls(this.slides)
          .updateSlides(route)
          .preloadClose();

      this.mainView.render();

      $(this.mainView.slideContainer).html($(_.values(this.routeEls)));

      return this;
    };

    this.generateSlideEls = function (routes) {
      var routeEls = this.routeEls = {};

      //console.log('BASE',base);
      _.each(routes, function (routeName) {
        var r = routeName.split('__')[0];

        var frag = document.createElement('div');

        setAttributes(frag, {
          'id': r + 'Slide',
          'class': 'section ' + routeName
        });

        frag.innerHTML = this.slideBase || ( this.slideBase = registerSlideBase() );
        frag.style.width = winW + 'px';

        routeEls[r] = frag;

      }, this);

      return this;
    };

    this.birthView = function (r) {
      var render = false;

      if(!this.loadedViews[r]){
        render = true;
        this.loadedViews[r] = new App.SlideConstructors[r + 'Slide'](this.params);
      }

      var view = this.loadedViews[r];

      if(render){
        view.setElement(this.routeEls[r]);
      }

      if(render && view.render){
        view.render(this.params);
      }
    };

    this.birthViews = function () {
      _.each(this.slides, function (s) {
        var r = s.split('__')[0];
        this.birthView(r);
      }, this);
    };

    this.closeView = function (view, s) {

      if(!view) return;

      //this.replaceWithClone(view.$el[0]);

      for (var k in view) {
        if (view[k] instanceof Backbone.View && !view[k].isClosed) {
          view[k].isClosed = true;
          this.closeView(view[k]);
        }
      }

      if(s) delete this.loadedViews[s];


      view.stopListening();
      view.undelegateEvents();

      view.$el.html( this.slideBase );

      //$(_.values(view.constructedSections)).remove();
    };

    this.closeAll = function () {
      _.each(this.loadedViews, function (v, s) {
        this.closeView(v, s);
      }, this);
    };

    this.updateSlides = function (route) {
      if (!this.slides) {
        return;
      }

      route = (typeof route == 'number') ? this.slides[route.toRangeVal(0, this.slides.length - 1)] : route;
      route = route || this.slides[0];

      var r = route.split('__')[0];

      this.activeSlide = r;
      this.slideOrder();
      this.activeSlides = new Array(this.slides.length);

      for( var n = this.min; n < this.max; n++){
        this.activeSlides[n] = this.slidesOrdered[n];
      }

      this.mainView.slideAnimate(false, route);

      return this;

    };

    this.slideOrder = function () {
      var slIndex,
        len = this.slides.length,
        h = this.halfC,
        slidesSplit = new Array(len),
        i = len,
        n,
        v = this.max - this.min;

      for (; i--;) {

        slidesSplit[i] = this.slides[i].split('__')[0];

        if (slidesSplit[i] === this.activeSlide) {
          slIndex = i;
        }
      }
      i = len;
      n = (slIndex + h) <= len ? (slIndex + h) : (slIndex + h - len);

      for (; n-- && i--;) {
        this.slidesOrdered[i] = slidesSplit[n];
        n = n === 0 ? len : n;
      }
    };

    this.updateHist = _.bind(raf, null, _.bind(function () {

      idleCallbackArray.push(this.preloadClose());

      //console.log(JSON.stringify(idleCallbackArray));
      this.router.navigate(this.activeSlide);
      $.setHashChain();

    }, this));

    this.preloadClose = function(){
      var i = 0,
          len = this.slides.length;

      for( ; i < len; i++ ){
        var r = this.slidesOrdered[i];

        if(this.activeSlides.indexOf(r) !== -1 && !this.loadedViews[r]){
          console.log('birth', r);
          this.birthView(r);
          //console.log(r, 'open');
        }else if(this.activeSlides.indexOf(r) === -1 && this.loadedViews[r]){
          //console.log('death',r);
          this.closeView(this.loadedViews[r], r);
          //console.log(r, 'close');
        }
      }
      this.activeView = this.loadedViews[this.activeSlide];
      return this.footerCallback();
    };

    this.footerCallback = _.bind(setTimeout, null, _.bind(function () {

      idleCallbackArray.pop();

      var view = this.activeView;

      if(!view || !view.renderFooter){ window.footerView.enable(); return; }

      view.trigger('idle');

      view.renderFooter(this.finishTask);
      window.footerView.enable();

      //console.log(view.$el, view.el);
      if(view.constructedSections) view.$el.prepend($(_.values(view.constructedSections)));

    }, this), 320);

    this.rafLoop = function(x,dur){
      var so = this.slidesOrdered,
          l = so.length,
          h = this.halfF,
          predicate, predicate2,
          style,
          transformStr,
          durStr = (dur || '0') + 'ms',
          dstr;

        for( var i = 0; i<l; i++ ){
          style = this.routeEls[so[i]].style;
          predicate = (Math.abs(i - h) <= this.preload);
          predicate2 =  i !== this.min && i !== this.max;
          dstr = (predicate && predicate2) ? durStr : '0ms';

          transformStr =
            'translate3d(' +
            (predicate ? ( winW*(i-h) + x ) : ( winW * l )) +
            'px,0, 0)';

          if ( style.transitionDuration !== dstr ) {
             style.webkitTransitionDuration =
                   style.transitionDuration = dstr;
          }

          if(style.webkitTransform !== transformStr){
            style.webkitTransform = transformStr;
          }
        }
    };

    this.slideTo = function (slide) {
      slide = (typeof slide == 'number') ? this.slides[slide.toRangeVal(0, this.slides.length - 1)].split('__')[0] : slide;
      this.updateSlides(slide);
    };

    this.setRoute = function(direction){
      this.updateSlides(this.slidesOrdered[this.halfF+direction]);
    };

    this.slideCompleteFn = function(resizeEv){
      //console.trace();
      //window.footerView.enable();
      if (!resizeEv) window.footerView.trigger('slideComplete');
      this.updateHist();
    };

    this.disable = function () {
      this.mainView.locked = true;
    };

    this.enable = function () {
      if (this.slideLength > 1) {
        this.mainView.locked = false;
      }
    };

    _.bindAll(this, 'updateSlides', 'resizeReslide');
    return this;
  }.apply({});

  var viewConstructor = Backbone.View.extend({
    __name__: 'viewConstructor',
    el: '#nebulousContainer',
    initialize: function (options) {
      _.extend(this, options);

      this.clonedElRef = this.$el.clone(false);
      this.actionQueue = [];

      _.bindAll(this,
        'runCb',
        'runActionQueue',
        'setPositionData'
      );

      this.setRafTime = _.bind(function () {
        this.rafTime = 0;
      }, this);

      this.buildSlideContainer();
    },
    buildSlideContainer: function () {
      this.slideContainer = document.createElement('div');

      setAttributes(this.slideContainer, {
        'id': 'myDavid'
      });

      this.slideContainer.style.width = winW + 'px';

      this.slideContainer.addEventListener('webkitTransitionEnd', this.runActionQueue, false);
      this.slideContainer.addEventListener('transitionend', this.runActionQueue, false);

      return this.slideContainer;
    },
    runCb: function (resizeEv, cb) {

      this.directionInt = 0;

      //$('input').blur();

      this.trigger('slideComplete');

      !!cb && cb();
    },
    runActionQueue: function (e) {
      this.evCount ++;
      this.addedDir = 0;

      if( this.evCount !== 2 && e ){
        return;
      }else{
        var l = this.actionQueue.length, i = 0;
        for(;i<l;i++){
          this.actionQueue[i]();
        }
        this.actionQueue = [];
      }
    },
    setPositionData: function() {
      this.storedX = 0;
      this.velocity = 1.5;
      this.movement = 0;
    },
    slideAnimate: function(resizeEv, route){

      var velocity = Math.abs(this.velocity * this.mult).toRangeVal(1.2, 3.2),
          animTime = (Math.abs( this.storedX - winW) / velocity).toFixed(0);

      //console.log(this.storedX, winW, velocity.toFixed(0), this.velocity, this.mult);

      this.slide(0, animTime, animTime > 0, this.setPositionData, resizeEv);
    },
    slide: function (x, dur, slide, cb, resizeEv) {

      var slideContainer = this.slideContainer,
          runCb = this.runCb;

      this.evCount = 0;

      this.trigger('transmitTransform', x, dur);

      if(slide){
        this.actionQueue = [function(){ runCb(resizeEv, cb); }];
      }
    },
    slideM: function(){
      if (Math.abs(this.dx) < 80) {
        this.directionInt = 0;
        this.addedDir = 0;
      }

      this.storedX = this.originX;
      this.originX = 0;
      this.trigger('transmitDirection', this.addedDir);

      //console.log('--slideM');
    },
    events: {
      "tap #myDavid": function (e) {
        if(!$(e.target).is('input') && !$(e.target).is('textarea') && this.currentFocus){
          this.currentFocus.blur();
          this.currentFocus = null;
          //cordova.plugins.Keyboard.close();
        }
        console.log('taptpa');
      },
      "pan .section": "handleSwipe",
      "panend .section": function(){
        //console.log('yoyoyo');
        if(this.locked){ window.footerView.enable(); }
      },
      "panstart .section": function(e){
        if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){
          this.trigger('panStart');
          window.footerView.disable();
          if(this.currentFocus){
            this.currentFocus.blur();
            this.currentFocus = null;
          }
        }
      },

      "tap .btnNextSection": function () {
        if (!this.locked){
          this.trigger('transmitDirection', +1);
        }
      },

      "tap .btnPrevSection": function () {
        if (!this.locked){
          this.trigger('transmitDirection', -1);
        }
      },
      "focusin" : function(e){
        this.currentFocus = e.target;
      }
    },
    render: function () {
      this.$el.html(this.slideContainer);
      return this;
    },
    directionInt: 0,
    addedDir: 0,
    dx: 0,
    rafTime: 0,
    velocity: 0,
    storedX: 0,
    originX: 0,
    handleSwipe: function (e) {
      if (!this.locked && !e.srcEvent.stopSlide ) {
        e.preventDefault();

        var ee = e,
          dx = this.dx = ee.deltaX,
          xy = Math.abs(dx) > Math.abs(ee.deltaY),
          di = dx > 0 ? -1 : 1;
        //if(e.isFirst)

        if (this.rafTime === 0) {

          this.rafTime = 1;

          raf(this.setRafTime);

          this.movement = dx; //* rsc.mult;

          this.directionInt = di; //* -1;

          if (this.originX === 0 && xy && Math.abs(dx) > 60) {
            var cleft = this.getCalcLeft(e.currentTarget);
            this.originX = cleft - this.movement;

          } else if (Math.abs(dx) > 60 && xy) {
            window.footerView.wait = true;
            this.slide( +this.originX + this.movement, 0);

          }
        }
        if (ee.eventType === 4 && xy) {

          this.addedDir += di;
          this.velocity = ee.velocityX;
          this.slideM();
          //!!this.touchTimeout && clearTimeout(this.touchTimeout);
        }

        if (xy) {
          return false;
        }
      }
    },
    getCalcLeft: function (el) {
      st = window.getComputedStyle(el, null);

      return parseFloat(
        (st["-webkit-transform"] || st["-moz-transform"] || st.transform)
        .split(',')[4]
      );
    },
    cleanup: function () {
      //console.log('I am closing');
      /*rsc.closeAll();*/
      this.trigger('close');

      this.$el.empty();
      this.$el.replaceWith(this.clonedElRef.clone(false));

      this.remove();
    }

  });

})(jQuery);

(function () {
  App.SubrouteConstructors.viewTask = Backbone.SubRoute.extend({
    routes: {
      "TaskInformation(/BuildingDetails)": "TaskInformation",
      //"BuildingDetails" : "BuildingDetails",
      "RiskAssessment": "RiskAssessment",
      "RamsDocuments": "RamsDocuments",
      "SiteSpecificNote": "SiteSpecificNote",
      "EventHistory": "EventHistory",
      "AuditReactive": "AuditReactive",
      "AllocatedVisits": "AllocatedVisits",
      "Photos": "Photos",
      "Documents": "Documents",
      "PPMAssetList(/:Asset)": "PPMAssetList",
      "BuildingAssets": "BuildingAssets",
      "TapTemperatures": "TapTemperatures",
      "MeterReadings": "MeterReadings",
      "OddJobs": "OddJobs",
      "ClosingStatus": "ClosingStatus",
      "ClosureNotes": "ClosureNotes",
      "Materials": "Materials",
      "ClosingSeverity": "ClosingSeverity",
      "Signature": "Signature",
      "NextVisitNotes": "NextVisitNotes",
      "FGas": "FGas",
      "FinishTask": "FinishTask"
    },
    TaskInformation: function () {
      routeSlideController.updateSlides('TaskInformation');
    },
    RiskAssessment: function () {
      routeSlideController.updateSlides('RiskAssessment');
    },
    RamsDocuments: function () {
      routeSlideController.updateSlides('RamsDocuments');
    },
    SiteSpecificNote: function () {
      routeSlideController.updateSlides('SiteSpecificNote');
    },
    BuildingDetails: function () {
      routeSlideController.updateSlides('BuildingDetails');
    },
    BuildingAssets: function () {
      routeSlideController.updateSlides('BuildingAssets');
    },
    AuditReactive: function () {
      routeSlideController.updateSlides('AuditReactive');
    },
    EventHistory: function () {
      routeSlideController.updateSlides('EventHistory');
    },
    AllocatedVisits: function () {
      routeSlideController.updateSlides('AllocatedVisits');
    },
    Photos: function () {
      routeSlideController.updateSlides('Photos');
    },
    Documents: function () {
      routeSlideController.updateSlides('Documents');
    },
    PPMAssetList: function () {
      routeSlideController.updateSlides('PPMAssetList');
    },
    TapTemperatures: function () {
      routeSlideController.updateSlides('TapTemperatures');
    },
    MeterReadings: function () {
      routeSlideController.updateSlides('MeterReadings');
    },
    FGas: function () {
      routeSlideController.updateSlides('FGas');
    },
    OddJobs: function () {
      routeSlideController.updateSlides('OddJobs');
    },
    ClosingStatus: function () {
      routeSlideController.updateSlides('ClosingStatus');
    },
    ClosureNotes: function () {
      routeSlideController.updateSlides('ClosureNotes');
    },
    Signature: function () {
      routeSlideController.updateSlides('Signature');
    },
    Materials: function () {
      routeSlideController.updateSlides('Materials');
    },
    ClosingSeverity: function () {
      routeSlideController.updateSlides('ClosingSeverity');
    },
    NextVisitNotes: function () {
      routeSlideController.updateSlides('NextVisitNotes');
    },
    FinishTask: function () {
      routeSlideController.updateSlides('FinishTask');
    }
  });
})();
