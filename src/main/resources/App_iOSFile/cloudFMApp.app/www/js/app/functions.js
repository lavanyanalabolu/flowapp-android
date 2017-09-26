;(function(){

      /*(function () { //add classnames to backbone classes for debugging.

      function createNamedConstructor(name, constructor) {
          var fn = new Function('constructor',
              'return function '+ name + '(){'
                  + 'constructor.apply(this, arguments);'
              + '};'
          );
          return fn(constructor);
      }

      var originalExtend = Backbone.View.extend;
      var nameProp = '__name__';

      var newExtend = function (protoProps, classProps) {
          if (protoProps && protoProps.hasOwnProperty(nameProp)) {
              var name = 'aa_'+protoProps[nameProp].replace(/\./g,'_');

              var constructor = protoProps.hasOwnProperty('constructor') ?
                protoProps.constructor : this;

              protoProps = _.extend(protoProps, {
                  constructor: createNamedConstructor(name, constructor)
              });
          }
          return originalExtend.call(this, protoProps, classProps);
      };

      Backbone.Model.extend = Backbone.Collection.extend =
      Backbone.Router.extend = Backbone.View.extend = newExtend;
    })();*/

    //polyfills

    // element-closest | CC0-1.0 | github.com/jonathantneal/closest

    if (typeof Element.prototype.matches !== 'function') {
    	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches(selector) {
    		var element = this;
    		var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
    		var index = 0;

    		while (elements[index] && elements[index] !== element) {
    			++index;
    		}

    		return Boolean(elements[index]);
    	};
    }

    if (typeof Element.prototype.closest !== 'function') {
    	Element.prototype.closest = function closest(selector) {
    		var element = this;

    		while (element && element.nodeType === 1) {
    			if (element.matches(selector)) {
    				return element;
    			}

    			element = element.parentNode;
    		}

    		return null;
        };
    }
})();
(function(){

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame){
      window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };
  }

  if (!window.cancelAnimationFrame){
      window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
      };
  }

  window.raf = window.requestAnimationFrame;

  window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    var start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 50);
  };

  window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };
})();

(function(){
    Hammer.defaults.touchAction = 'pan-y';
    //Hammer.defaults.domEvents = true;
    Hammer.defaults.cssProps = { userDrag: 'element' };
    Hammer.defaults.recognizers = ['pan', 'panstart', 'panend', 'tap'];

    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    Backbone.View.prototype._hammerListener = function(eventName, selector, listener){
        this._hammerListeners[eventName][selector] = {
                selector : selector,
                fn : listener
            };
    };
    Backbone.View.prototype._hammerMethod = function(e){
        var listenerGroup = this._hammerListeners[e.type];
        var methods = [],
            i = 0;
        for(var n in listenerGroup){
          listenerGroup[n].el = e.target.closest(listenerGroup[n].selector);
          !!listenerGroup[n].el && (methods[i++] = listenerGroup[n]);
          //console.log(i);
        }
        if(!methods.length) return;
        /*methods.sort(function(m, n){
            if( m.el === e.target ) return -1;
            return m.el.compareDocumentPosition(n.el) & Node.DOCUMENT_POSITION_CONTAINED_BY;
        });*/
        i = 0;
        for(var l = methods.length; i<l; i++){
            //delete e.currentTarget;

            e.currentTarget = methods[i].el || null;
            methods[i].fn(e);
        }

        if(methods.length>1) console.warn('more than 1 event listeners', methods);
        return this;
    };
    Backbone.View.prototype.undelegateEvents = function() {
        var evs = _.keys(this._hammerListeners).join(' ');
        if(evs){
            this._hammer.off(evs);
            this._hammer.destroy();
        }
        this._hammerListeners = {};
        this.$el.off('.delegateEvents' + this.cid);
        return this;
    };
    Backbone.View.prototype.naughtyUndelegateEvents = function() {
        var evs = _.keys(this._hammerListeners).join(' ');
        if(evs){
            this._hammer.off(evs);
            this._hammer.destroy();
        }
        this._hammerListeners = {};
        if (this.$el) this.$el.off(['.delegateEvents' , this.publisher.cid].join(''));
        return this;
    };
    Backbone.View.prototype.delegateEvents = function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;

      var recogs = Hammer.defaults.recognizers;

      this.undelegateEvents();
      this._hammer = new Hammer(this.el);
      this._hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold:30 });

      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        var eventName = match[1];
        this.delegate(eventName, match[2], method, recogs.indexOf(eventName) === -1);
      }
      var evs = _.keys(this._hammerListeners).join(' ');
      if(evs) this._hammer.on(evs, this._hammerMethod.bind(this));
      return this;
    };
    Backbone.View.prototype.naughtyDelegateEvents = function(events){
        if (!(events || (events = _.result(this, 'events')))) return this;

        var recogs = Hammer.defaults.recognizers;

        this.naughtyUndelegateEvents();
        this._hammer = new Hammer(this.el);
        this._hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold:30 });

        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this.publisher[method];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            var eventName = match[1];
            this.delegate(eventName, match[2], method, recogs.indexOf(eventName) === -1, this.publisher);
        }
        var evs = _.keys(this._hammerListeners).join(' ');
        if(evs) this._hammer.on(evs, this._hammerMethod.bind(this));
        return this;
    };
    Backbone.View.prototype.delegate = function(eventName, selector, listener, jq, publisher){
        if( !publisher ){
            publisher = this;
        }
        listener = _.bind( listener, publisher );

        if(jq){ eventName += '.delegateEvents' + publisher.cid; }
        if(jq){
            if (selector === '') {
              this.$el.on(eventName, listener);
            } else {
              this.$el.on(eventName, selector, listener);
            }
        }else{
            if (selector === '') {
                this._hammer.on(eventName, listener);
            }else{
                this._hammerListeners[eventName] = this._hammerListeners[eventName] || {};
                this._hammerListener(eventName, selector, listener);
            }
        }

        return this;
    };

    Backbone.View.prototype.naughtySetElement = function(element) {
        this.naughtyUndelegateEvents();
        this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
        this.el = this.$el[0];
        this.naughtyDelegateEvents();
        return this;
    };

})();

function setAttributes(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
    return el;
}


(function(){
    var readFromFile = function(fileName, callBack) {

        console.log('readd');
        //console.trace();
        var readers = {};
        var results = {};

        if(typeof fileName !== 'string'){
            for(var i = fileName.length; i--;){
                readers[fileName[i]] = new FileReader();
            }
        }else{
            readers[fileName] = new FileReader();
            fileName = [fileName];
        }

        var loopFn = function(fName){
            //console.log('this defo happens', !!window.resolveLocalFileSystemURL);
            var pathToFile = [cordova.file.applicationDirectory , ( window.device.platform == 'browser' ? '' : 'www/' ) ,'html/' , fName].join('');
            var errorHandler = function(err){
                console.log(JSON.stringify(err), 'What?');
                console.log([cordova.file.applicationDirectory , ( window.device.platform == 'browser' ? '' : 'www/' ) ,'html/' , fName].join(''));
            };
            var otherErrorHandler = function(err){
                console.log(JSON.stringify(err), 'I am other');
                console.log([cordova.file.applicationDirectory , ( window.device.platform == 'browser' ? '' : 'www/' ) ,'html/' , fName].join(''));
            };
            window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                console.log('FILEREAD',pathToFile);
                fileEntry.file(function (file) {
                    readers[fName].onloadend = function (e) {
                        results[fName] = this.result;
                        for(var n = fileName.length; n--;){
                            if( readers[fileName[n]]._readyState !== 2 ){
                                return;
                            }
                        }
                        callBack(results);
                    };
                    readers[fName].readAsText(file);
                }, otherErrorHandler );
            }, errorHandler );
        };

        for( var o = fileName.length; o--; ){
            loopFn(fileName[o]);
        }
    };

    var multiAjax = function(fileName, callBack){
        var readers = {};
        var results = {};

        if(typeof fileName !== 'string'){
        }else{
            fileName = [fileName];
        }

        var errorHandler = function(err){
            console.log(err)
        };
        var loopFn = function(fName, o){
            readers[fName] = $.ajax({
                method: 'GET',
                url: ['html/', fName, '?', +new Date()].join(''),
                cache: false,
                timeout: 2000,
                dataType: 'html',
                success: function(data){
                    results[fName] = data;
                    for(var n = fileName.length; n--;){
                        if( readers[fileName[n]].readyState !== 4 ){
                            return;
                        }
                    }
                    callBack(results);
                },
                error: function(err){
                    console.log('I am error',err);
                }
            });
        };
        for(var o = fileName.length; o--;){
            loopFn(fileName[o]);
        }
    };

    function serializeTemplates(tmp) {
      var templates = { };
      var tmpReg = /<script.*?type\="text\/template[\/]{0,1}(.*?)".*?id\="(.+?)".*>([.\s\S]*?)<\/script/g;
      tmp.replace(tmpReg, function (m, $1, $2, $3, i) {

        if($1 === 'section'){
          templates['_section_' + $2] = _.template($3);
        }else{
          templates[$2] = _.template($3);
        }
      });
      return templates;
    }

    $.getPageHtmlAsync = function (htmlFileName, raw, cb) {
      //console.trace()
      //console.log('htmlFileName', htmlFileName);

      var temp,
        runner = function (data) {
          if (typeof htmlFileName !== 'string') {
            cb(raw ? data : _.mapObject(data, function (string, k) {
              return /\<script/.test(string) ?
                serializeTemplates(string) :
                _.template(string);
            }));
          } else {
            cb(raw ? data[htmlFileName] : _.template(data[htmlFileName]));
          }
        };

      if (typeof cordova !== 'undefined' && window.device.platform != 'browser' && window.ENVIRONMENT !== 'DEV') {
        //console.log('im multi readFromFile');
        readFromFile(htmlFileName, runner);
      } else {
        //  console.log('im multi ajax');
        multiAjax(htmlFileName, runner);
      }

    };

    $.getPageHtml = function(htmlFileName, raw) {
        var temp;
        $.ajax({
            method: 'GET',
            url: ['html/', htmlFileName, '?', +new Date()].join('') ,
            async: false,
            timeout: 2000,
            dataType: 'html',
            success: function(data){
                temp = data;
            },
            error: function(err){
                console.log('I am error',err);
            }
        });
        if(raw) return temp;
        return _.template(temp);
    };
})();

jQuery(document).on('ready', function(){

    (function($){

        var AlertBox = setAttributes(document.createElement('div'), {
          'id': 'divAlertBox',
          'class': 'alert alert-danger'
        });

        var docFragment = document.createDocumentFragment();

        docFragment.appendChild(AlertBox);

        document.querySelector('.navbar').appendChild(docFragment);

        var tboMessages = {},
            tboDeferreds = {},
            tboFhash = [],
            tbouidAr = [],
            tboTQueue = [],
            state = { busy: false };

        function processTQueue(){ !!tboTQueue[0] && (tboTQueue.shift())(); };
        AlertBox.addEventListener('webkitTransitionEnd', processTQueue, false);
        AlertBox.addEventListener('transitionend', processTQueue, false);

        window.jBo = function (box, correctCol) {

          var context = {
            timeCapsule: function (diu) {
              return setTimeout(function () {
                !!tboDeferreds[diu] && tboDeferreds[diu].resolve('Message timeout ...', true);
                $(box).trigger('mtimeout');
              }, 90000);
            },
            begin: function (h, msg, dyn, uid, delay) {
              state.busy = true;
              var s = this.box.style;
              s.color = 'rgba(255,255,255,1)';
              s.backgroundColor = undefined;
              s.borderColor = undefined;
              this.box.innerHTML = msg;

              this.ico.innerHTML = this.hg.outerHTML;
              dyn && this.box.appendChild(this.ico);
              this.slideDown(h, uid, delay);
            },
            finalCb: function (delay) {
              //console.log('finalCBRun', _t.sTO, delay);
              var s = this.box.style,
                  _t = this;

              !!this.sTO && clearTimeout(this.sTO);
              this.sTO = setTimeout(function () {
                if (_.isEmpty(tboDeferreds) && !tboFhash.length) {
                  s.webkitTransform = s.transform = 'scale3d(1,0,1)';
                  tboTQueue.length = 0;
                  !!tboFhash.length && (tboFhash.shift())();
                }
                state.busy = false;
              }, delay);

              setTimeout(function () {
                if (!!_t.uidAr.length) {
                  s.color = '#fff';
                  s.backgroundColor = tboMessages[_t.uidAr[(_t.uidAr.length - 1)]].col;
                  s.borderColor = tboMessages[_t.uidAr[(_t.uidAr.length - 1)]].col;
                  _t.box.textContent = tboMessages[_t.uidAr[(_t.uidAr.length - 1)]].text;
                  _t.ico.innerHTML = _t.hg.outerHTML;
                  ssb.appendChild(_t.ico);
                  //!!tboFhash.length && (tboFhash.shift())(); //-- maybe
                } else {}!!tboFhash.length && (tboFhash.shift())();
              }, tboFhash.length > 0 ? 600 : delay);
            },
            slideUpBit: function (bmsg, newMessage, error, delay) {
              state.busy = true;
              var s = this.box.style;
              requestAnimationFrame(_.bind(function () {
                s.color = 'rgba(255,255,255,.5)';
                s.backgroundColor = error ? '#C12E2A' : '#12B3D3';
                s.borderColor = error ? '#C12E2A' : '#12B3D3';
                this.box.innerHTML = bmsg;

                if (!!newMessage) {
                  this.box.textContent = newMessage;
                } else {
                  this.box.textContent = bmsg;
                };

                this.ico.innerHTML = error ? this.rm.outerHTML : this.ti.outerHTML;
                this.box.appendChild(this.ico);
                this.finalCb(delay);

              },this));
            },
            slideDown: function (h, uid, delay) {
              var s = this.box.style;
              s.backgroundColor = correctCol;
              s.borderColor = correctCol;
              console.log(delay);
              tboTQueue.push(_.bind(function () {
                if (!!tboDeferreds[uid]) {} else {
                  if (!h || !tboFhash.length) {
                    this.finalCb(delay);
                  } else if (!!tboFhash.length) {
                    (tboFhash.shift())();
                  }
                }
              }, this));

              s.webkitTransform =
                s.transform = 'scale3d(1,1,1)';

              if (state.busy) {
                this.srTO = setTimeout(processTQueue, 600);
              }

            },
            triggerSlideUp: function (newMessage, error, uid, msg, delay) {

              // /console.log(newMessage, error, uid);

              if (!!tboMessages[uid]) {
                clearTimeout(tboMessages[uid].to)
                delete tboMessages[uid];
                delete tboDeferreds[uid];
              }

              if (tboFhash.length) {
                tboFhash.push(_.bind(this.slideUpBit, this, msg, newMessage, error, delay));
                if (!tboDeferreds.length) {
                  (tboFhash.shift())()
                }
              } else {
                this.slideUpBit(msg, newMessage, error, delay);
              }

            },
            transitionCB: function(){

            }
          }

          context.sTO = null;
          context.srTO = null;
          context.box = box;

          //context.tboFhash = tboFhash;
          //tboDeferreds = tboDeferreds;

          context.ti = setAttributes(document.createElement('span'), {
            'class': 'glyphicon glyphicon-ok'
          });
          context.rm = setAttributes(document.createElement('span'), {
            'class': 'glyphicon glyphicon-remove'
          });
          context.hg = setAttributes(document.createElement('span'), {
            'class': 'glyphicon glyphicon-refresh rotating'
          });
          context.ico = setAttributes(document.createElement('span'), {
            'class': 'leftabit'
          });

          Object.defineProperty(context, "uidAr", {
            get: function () {
              return _.keys(tboDeferreds);
            }
          });

          var ssb = context.box;

          _.bindAll(context, 'timeCapsule', 'begin', 'slideUpBit', 'finalCb', 'slideDown', 'triggerSlideUp');

          return _.bind(function (msg, defer, d, hold) {
            d = d || 1600;
            var delay = (!!defer) ? 1200 : d;
            var dyn = !!defer;
            var style = this.box.style;
            var uid = _.uniqueId('dfd');

            if (!!defer) {
              tboDeferreds[uid] = defer;
              tboMessages[uid] = {
                text: msg || '',
                col: correctCol,
                to: this.timeCapsule(uid, tboDeferreds)
              };
              console.log(uid, msg);
              //this.uidAr.push(uid);
            }
            var defdFn = _.bind(function(newMessage, error){ context.triggerSlideUp(newMessage, error, uid, msg, delay); }, this);

            defer = (!!defer) ? defer.then(defdFn) : null;

            //!!this.sTO && clearTimeout(this.sTO);
            !!this.srTO && clearTimeout(this.srTO);
            //console.log(state.busy, ' busy')

            if (!hold && state.busy) {
              tboFhash.push(_.bind(this.begin, this, false, msg, dyn, uid, delay));
            } else {
              this.begin( hold, msg, dyn, uid, delay);
            }
          }, context);
        };

        $.jSuccess = new jBo(AlertBox, '#12B3D3');
        $.jAlert = new jBo(AlertBox, '#C12E2A');


        var connectionRecoveryFn = function(){
            this.fail = false;
            this.started = false;

            $(AlertBox).on('mtimeout', function(){
                console.log('conrecover', this.fail);
                this.fail = false;
            }.bind(this));

            return function(bsXhr, bsDef){
                if(this.started === true){
                    return;
                }else{
                    this.started = true;
                }

                var errorFn = function(){
                    if(!this.fail){
                        !!this.defed && this.defed.resolve('Connection error', true);
                        delete this.defed;
                        this.defed = $.Deferred();
                        $.jAlert('Connection dropped', this.defed, undefined);
                        this.reconFailTO = setTimeout(function(){
                            console.log('failed to reconnect')
                            clearTimeout(this.reconTO);
                            this.reconFailTO = null;
                            this.fail = false;
                            this.started = false;
                            !!this.defed && this.defed.resolve('Reconnect failed', true);
                            delete this.defed;
                        }.bind(this), 20000);
                        this.giveUp = Date.now() + 20000;
                    }
                    this.fail = true;
                    !!this.reconTO && clearTimeout(this.reconTO);
                    !!this.reconFailTO && (Date.now()+4700) < this.giveUp && (this.reconTO = setTimeout(ServerPing, 4500));
                }.bind(this);

                var successFn = function(){
                    console.log('pingSucces');
                    this.fail = false;
                    this.started = false;
                    clearTimeout(this.reconFailTO);
                    !!this.defed && this.defed.resolve('Connection established');
                    delete this.defed;
                }.bind(this);

                function ServerPing(){
                    console.log('piiing')
                    var url = serverPath + "/pingroute";
                    if (window.XMLHttpRequest){
                        var reqXML = new XMLHttpRequest();
                        reqXML.onreadystatechange = function(event){

                            if(reqXML.readyState == 4 && reqXML.status == 200 ){
                                successFn();
                            } else if (reqXML.readyState == 4 && reqXML.status != 200) {
                                /*console.log('readyStatechange is ', event, JSON.stringify(reqXML) )*/
                                !!bsXhr && bsXhr.abort();
                                !!bsDef && bsDef.resolve('Connection Error', true);
                                errorFn();
                            }
                        };
                        reqXML.open("HEAD", url, true);
                        reqXML.timeout = 4500;
                        console.log('sendPing')
                        reqXML.send(null);
                    }
                }
                ServerPing();
            }.bind(this);
        };

        $.connectionRecovery = new connectionRecoveryFn();

        $.renderUpdateButton = function(version){
            /*console.log('renderUpdateButton', version)*/
            var currentVersion;
            if(!version){
                version = {
                    versionID:0,
                    majorRelease:0,
                    minorRelease:0
                };
            }
            try{
                currentVersion = localStorage_a.getItem('version') || window.mobileAppVersion;
            }catch(e){
                console.log(e);
            }

            try{
                var currentVersionText =  [(currentVersion.releaseTier || 'v') , currentVersion.majorRelease , '.' , currentVersion.minorRelease].join('');
                $('.spanCurrentVersion').html(currentVersionText).hide().show();
                if(parseInt(version.versionID)>parseInt(currentVersion.versionID)){
                    $('.spanCurrentVersion').hide();
                    $('.spanUpdateAvailable').show();

                } else {
                    $('.spanUpdateAvailable').hide();
                    $('.spanCurrentVersion').show();
                }
            } catch(e){

            }

        };
        $.loadMobileAppVersion = function(cb, cbFail) {
            var currentVersion = {
                versionID:0,
                majorRelease:0,
                minorRelease:0
            };
            try {
                currentVersion = localStorage_a.getItem('version') || window.mobileAppVersion;
            } catch(e){

            }

            //console.log('mobileAppVersionGet...');

            var data = {
                betaAuto: !!$.getAppPermission && $.getAppPermission('betaAuto'),
                alphaAuto: !!$.getAppPermission && $.getAppPermission('alphaAuto'),
                UA: navigator.userAgent
            };

            $.ajax({
                method: "POST",
                async: true,
                timeout: 5000,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(data),
                url: serverPath + "/downloads/ver",
                dataType: "json",
                beforeSend: function(xhr){
                    if($.connectionRecovery.fail === true){
                        xhr.abort();
                    }else{
                        //$.connectionRecovery(xhr)
                    }
                },
                cache: false,
                success: function(latestVersion) {
                    $.renderUpdateButton(latestVersion);
                    cb(latestVersion);
                },
                error: function(err) {
                    //$.connectionRecovery()
                    cbFail(err);
                }
            });
        };

    window.cfmUpdateView = new(Backbone.View.extend({
        initialize:function(){

        },
        className: "xpanel",
        events: {
            "tap .btnSettings" : "settingsMenu",
            "tap .btnUpdateStart" : function(event){
                event.preventDefault();
                $(event.currentTarget).trigger('click');
            },
            "tap .btnHide": function (event) {
                console.log('goooback');
                window.App.goBack();
            }
        },
        settingsMenu: function() {
            window.location="#settings";
        },
        render: function(){
            var _v = this;
            //window.App.routerInstance.navigate('#update'); //this is necessary
            _v.undelegateEvents();
            var tmp = _.template( document.getElementById('updateAppTemplate').innerHTML );
            this.$el.html(tmp());
            $('#nebulousContainer').html(this.$el);
            $('.divUpdatingAppStages').append('<div class=" divInternetCheck alert alert-primary" role="alert">Checking internet connection</div>');

            !!window.footerView && window.footerView.footer(this, 'update.html', {} );

            window.App.vChecker.locked = true;
            $.loadMobileAppVersion(
                function(x){
                    console.log(x)
                    $('.divInternetCheck').hide();
                    $('.divUpdatingAppStages').html(['<h4>Release date : ' , x.releaseDate , '</h4>', x.releaseNotes.join('')].join(''));
                    var btnUpdate = $('.btnUpdateStart').wrap(['<a ' , x.link , '></a>'].join('')).parent();
                    if(x.linkTwo){
                        var btnRollback = $('.btnUpdateStart').clone().insertAfter(btnUpdate).wrap(['<a class="small" style="margin-left:10px" ' , x.linkTwo , '></a>'].join('')).text('Roll back to previous version').show();
                    }
                    if(parseInt( x.versionID ) !== parseInt(localStorage_a.getItem('version').versionID) ){
                        btnUpdate.children(0).show();
                    }else{
                        $('.uptodate').show();
                    }
                    _v.delegateEvents();
                },
                function(x){}
            );
        }
    }))();

    $("body").on("click", ".btnUpdateApp", function(){ window.location = "#update" } ); // function(event){

        $.serverLog = function() {
            //var args = [].push.call(arguments, new Date() );
            //console.log('args',args)
            arguments[arguments.length] = new Date();
            $.ajax({
                type: "POST",
                async: true,
                timeout: 3000,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({a:arguments}),
                url: serverPath + "/serverLog",
                dataType: "json",
                success: function(latestVersion) {
                },
                error: function(latestVersion) {

                }
            });
        };

    })(jQuery);

(function($){
    $.fn.log = function(message) {
        console.log('log',message)
        //$("#divSuccessBox").text(message)
    }

    $.fn.Lazy = function( opt ) {
        console.log('Lazy ')
        opt = opt || {}
        var lastScrollTop = 0;
        var options =  {
            preload :  opt.preload || 2,
            interval : opt.interval || 400
        }
        var elements = $(this).find('[data-original]');

        elements.slice(0, options.preload ).each( function() {
            onElement($(this))
        })
        $(this).off('scroll');
        $(this).scroll(function() {
            var st = $(this).scrollTop();
            if (st > lastScrollTop) {
                elements = $(this).find('[data-original]')
                if( elements.length > 0 ) {
                    elements.each(function() {
                        var el = $(this)
                        if ( el.isOnScreen() ) {
                            el.attr('src',serverPath+'/ajax-loader.gif')
                            setTimeout( function() {
                                onElement( el );
                            }, options.interval  )
                        }
                    })
                }  else {
                    $(this).unbind('scroll');
                }
            }
            lastScrollTop = st;
        })
        function onElement( el ) {

            el.attr("src", el.attr("data-original")).removeAttr("data-original").addClass('img-thumbnail')
        }
    };

    $.fn.isOnScreen = function(){

        var win = $(window);

        var viewport = {
            top : win.scrollTop(),
            left : win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

    };

    $.serverLog('client -> server log operational');

    $.setHashChain = function(){
        var newHash = window.location.hash,
        hashChain = localStorage_a.getItem('hashChain') || [],
        alreadyStored = hashChain.indexOf(newHash);

        localStorage_a.setItem('currentURL', newHash);

        if(newHash !== hashChain[hashChain.length-1]){
            hashChain.push(newHash);
        }

        if(hashChain.length > 5){
            hashChain.shift();
        }
        localStorage_a.setItem('hashChain', hashChain)
    };

    $.parseClient = function() {
        return localStorage_a.getItem('client') || {};
    }

    $.parseURI = function(url) {
        var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
        // Let the browser do the work
        parser.href = url;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            vars: searchObject,
            hash: parser.hash
        };
    }

    $.dataURItoBlob = function(dataURI) {
        $.serverLog('hererr')
        $.jSuccess('Processing Image [2]', undefined, 10)
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
        else
        byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }
    $.getOnSiteStatus = function(client) {
        var onSite = 0;
        if (client.buildingCheckIn) {
            onSite = client.buildingCheckIn.onSite;
        }
        return (onSite);
    }

    $.getStartedTaskStatus = function(client) {
        var startedTask = 0;
        if (localStorage_a.getItem('client')) {
            var client = $.parseClient();
            if (client.currentTask) {
                if (client.currentTask.resourceID !== undefined) {
                    startedTask = 1;
                }
            }
        }

        return (startedTask);
    }

    $.getCurrentTaskGuid = function() {
        var taskGuid = undefined;
        if (localStorage_a.getItem('client')) {
            var client = $.parseClient();
            if (client.currentTask) {
                //if (client.currentTask.resourceID !== undefined) {
                taskGuid = client.currentTask.task[0].taskGuid;
                //}
            }
        }

        return (taskGuid);
    }

    $.getCurrentTaskID = function() {
        var taskID = undefined;
        if (localStorage_a.getItem('client')) {
            var client = $.parseClient();
            if (client.currentTask) {
                //if (client.currentTask.resourceID !== undefined) {
                taskID = client.currentTask.taskID;
                //}
            }
        }

        return (taskID);
    }
    $.updateTaskInfo = function(k,v,overwrite){
        var client = $.parseClient()
        var currentTask = client.currentTask;
        currentTask[k] = (typeof currentTask[k] === 'object' && typeof v === 'object' && !(v instanceof Array) && !overwrite) ? _.extend(currentTask[k], v) : v;
        client.currentTask = currentTask;
        localStorage_a.setItem('client', client);
    }

    $.jWorking = function(msg, data, fnSuccess, fnError, useMessage) {
        localStorage_a.setItem('ajaxActive','1');

        var defd = $.Deferred();
        $.jSuccess(msg, defd);
        $.ajax({
            type: "POST",
            async: true,
            timeout:25000,
            contentType: "application/json; charset=utf-8",
            url: serverPath + '/dataClientToken',
            data : JSON.stringify(data),
            dataType: "json",
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    defd.resolve('Connection error', true);
                }else{
                    console.log('send in the xhr', JSON.stringify( xhr ) )
                    $.connectionRecovery(xhr, defd);
                }
            },
            success: function(msg, t, m) {
                localStorage_a.setItem('ajaxActive','0');
                defd.resolve(useMessage? msg : undefined);
                return(fnSuccess(msg));
            },
            error: function(msg, t, m) {
                if(m==='timeout'){
                    console.log('Network timeout');
                }
                $.connectionRecovery();
                localStorage_a.setItem('ajaxActive','0');
                defd.resolve(m, true);
                console.log(msg)
                $.jAlert('error')
                return(fnError(msg));
            }
        });


    }

    $.jMultiWorking = function(msg, data, fnSuccess, fnError) {
        localStorage_a.setItem('ajaxActive','1');
        var defd = $.Deferred();
        $.jSuccess(msg, defd);
        $.ajax({
            type: "POST",
            async: true,
            timeout: 20000,
            contentType: "application/json; charset=utf-8",
            url: serverPath + '/dataMultiToken',
            data : JSON.stringify(data),
            dataType: "json",
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    defd.resolve('Connection error', true);
                }else{
                    $.connectionRecovery(xhr, defd)
                }
            },
            success: function (msg) {
                localStorage_a.setItem('ajaxActive','0');
                /*$('#divLoadingBox').fadeOut().remove();*/
                defd.resolve();
                var data  = {}
                _.each(msg,function(i){
                    _.extend(data,i)
                })
                //                !!window.App.magFailDeferred && window.App.magFailDeferred.resolve('Connection established');
                return (
                    fnSuccess( { d :data } )
                );
            },
            error: function(msg, t, m) {
                if(t==='timeout'){
                    console.log('Network timeout');
                    //window.App.magFailDeferred = $.Deferred();
                    //$.jAlert('Connection dropped', undefined, undefined, true);
                    $.connectionRecovery()
                }
                localStorage_a.setItem('ajaxActive','0');
                /*$('#divLoadingBox').fadeOut().remove();*/
                defd.resolve(m, true);
                return(fnError(msg));
            }
        });

    }
    $.jAdminWorking = function(msg, data, fnSuccess, fnError) {
        $.ajax({
            type: "POST",
            async: true,
            timeout: 200000,
            contentType: "application/json; charset=utf-8",
            url: serverPath + "/dataMetaToken",
            data: JSON.stringify(data),
            dataType: "json",
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    //defd.resolve('Connection error');
                }else{
                    //$.connectionRecovery(xhr)
                }
            },
            success: function(msg, t, m) {
                window.requestActive = 0;
                //                !!window.App.magFailDeferred && window.App.magFailDeferred.resolve('Connection established');
                return (fnSuccess(msg));
            },
            error: function(msg, t, m) {
                if (t === 'timeout') {
                    console.log('Network timeout');
                }
                window.requestActive = 0;
                return (fnError(msg));
            }
        });
    }

    $.jGeneric = function(msg,url, data, fnSuccess, fnError) {

        $.ajax({
            type: "POST",
            async: true,
            timeout: 30000,
            contentType: "application/json; charset=utf-8",
            url: serverPath + "/" + url,
            data: JSON.stringify(data),
            dataType: "json",
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    //defd.resolve('Connection error');
                }else{
                    $.connectionRecovery(xhr)
                }
            },
            success: function(msg, t, m) {
                //                !!window.App.magFailDeferred && window.App.magFailDeferred.resolve('Connection established');
                return (fnSuccess(msg));
            },
            error: function(msg, t, m) {
                if (t === 'timeout') {
                    $('#networkError').html('<div style="width:100%; position:relative; top:0; background-color: #C12E2A; padding: 1px 0 1px 0;"><h5 style="text-align:center;">Network timeout. Please refresh your browser.</h5></div>');
                    //alert('Network timeout');
                }
                window.requestActive = 0;
                return (fnError(msg));
            }
        });
    }

    $.jmultiClientContractor = function(msg, data, fnSuccess, fnError) {

        var defd = $.Deferred();
        $.jSuccess(msg, defd);
        data.p1['contractorGuid'] = '5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38';
        $.ajax({
            type: "POST",
            async: true,
            timeout: 30000,
            contentType: "application/json; charset=utf-8",
            url: serverPath + "/multiClientContractorMobile",
            data: JSON.stringify(data),
            dataType: "json",
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    defd.resolve('Connection error', true);
                }else{
                    $.connectionRecovery(xhr, defd)
                }
            },
            success: function(msg, t, m) {
                if ( msg.status ==0 ) {
                    localStorage_a.setItem('ajaxActive','0');
                    /*$('#divLoadingBox').fadeOut().remove();*/
                    defd.resolve();
                } else {
                    localStorage_a.setItem('ajaxActive','0');
                    /*$('#divLoadingBox').fadeOut().remove();*/
                    defd.resolve();
                }
                //                !!window.App.magFailDeferred && window.App.magFailDeferred.resolve('Connection established');
                return(fnSuccess(msg));
            },
            error: function(msg, t, m) {
                localStorage_a.setItem('ajaxActive','0');
                /*$('#divLoadingBox').fadeOut().remove();*/
                defd.resolve(undefined, true);
                return (fnError(msg));
            }
        });

    }

    $.jContractorDBToken = function(msg, data, fnSuccess, fnError) {

        var defd = $.Deferred();
        $.jSuccess(msg, defd);
        //data.p1['contractorGuid'] = '5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38';
        console.log('dbtoke', data)
        $.ajax({
            type: "POST",
            async: true,
            timeout: 200000,
            contentType: "application/json; charset=utf-8",
            url: serverPath + "/dataContractorDBToken",
            data: JSON.stringify(data),
            dataType: "json",
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    defd.resolve('Connection error', true);
                }else{
                    $.connectionRecovery(xhr, defd)
                }
            },
            success: function(msg, t, m) {
                //                !!window.App.magFailDeferred && window.App.magFailDeferred.resolve('Connection established');
                if ( msg.status ==0 ) {
                    logOut();
                    window.location='login';
                } else {
                    window.requestActive = 0;
                    /*$('#divLoadingBox').fadeOut().remove();*/
                    defd.resolve();
                    return (fnSuccess(msg));
                }
            },
            error: function(msg, t, m) {
                if (t === 'timeout') {
                    //console.log('Network timeout');
                }
                /*$('#divLoadingBox').fadeOut().remove();*/
                defd.resolve(m, true);
                window.requestActive = 0;
                return (fnError(msg));
            }
        });

    }

    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $.taskTimer = function(){
        localStorage_a.setItem('taskTime', localStorage_a.getItem('taskTime') || new Date().getTime());
        this.initialize = (function(){
            startTime = localStorage_a.getItem('taskTime');
            console.log(startTime)
            var timer = (App.taskTimer || $(document.createElement('span')).attr({
                "class" : "",
                "id" : "taskTimer"
            }).css({
                color: '#fff',
                'float': 'right',
                width: 'auto',
                border: '0',
                'font-size': '12px',
                background: 'transparent'
            })).html('<span class="glyphicon glyphicon-time" style="margin-right:4px;" ></span>');
            console.log(timer)
            var tspan = $(document.createElement('span')).attr({'class':'timerval'}).html('00:00:00');
            function pad(num) {
                num = num.toString();
                return (["00" , num].join('')).substr(num.length);
            }
            setTimeout(function tout(){
                var datOb = new Date( new Date().getTime() - parseInt(startTime) ),
                dstring = [pad(datOb.getHours()) , ':' , pad(datOb.getMinutes()) , ':' , pad(datOb.getSeconds()) ].join('');
                tspan[0].textContent = dstring; //.html( dstring/*moment( new Date( new Date().getTime() - parseInt(startTime) ) ).format('HH:mm:ss')*/ );
                setTimeout(tout, 1000);
            }, 1000)
            timer.append(tspan);

            return timer;
        }).bind(this);

        return this.initialize()
    };

    $.overlayer = function(overlay, onoff, blurthis){
        $(overlay).toggle(onoff, 200);
        $(blurthis).toggleClass('blurThis', onoff)
    };

    $('body').delegate('.overlayCancel', 'tap', function(e){
        $.overlayer('.overlay', false, '#mainSection, #divTaskCardFooter')
    })


    $.loadNumberBootsnipp = function(){
        //plugin bootstrap minus and plus
        //http://jsfiddle.net/laelitenetwork/puJ6G/
        $("body").on("click", ".btn-number", function(e){
            e.preventDefault();

            fieldName = $(this).attr('data-field');
            type      = $(this).attr('data-type');
            var input = $("input[name='"+fieldName+"']");
            var currentVal = parseInt(input.val());
            var step = parseInt(input.attr('step')) || 1;
            if (!isNaN(currentVal)) {
                if(type == 'minus') {

                    if(currentVal > input.attr('min')) {
                        input.val(currentVal - step).change();
                    }
                    if(parseInt(input.val()) == input.attr('min')) {
                        $(this).attr('disabled', true);
                    }

                } else if(type == 'plus') {

                    if(currentVal < input.attr('max') || !input.attr('max')) {
                        input.val(currentVal + step).change();
                    }
                    if(parseInt(input.val()) == input.attr('max')) {
                        $(this).attr('disabled', true);
                    }

                }
            } else {
                input.val(0);
            }
        });
        $("body").on("focusin", ".input-number", function(){
            $(this).data('oldValue', $(this).val());
        });
        $("body").on("change", ".input-number", function() {

            minValue =  parseInt($(this).attr('min'));
            maxValue =  parseInt($(this).attr('max'));
            valueCurrent = parseInt($(this).val());

            name = $(this).attr('name');
            if(valueCurrent >= minValue) {
                $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
            } else {
                //alert('Sorry, the minimum value was reached');
                $(this).val(minValue);
            }
            if(!!maxValue && valueCurrent <= maxValue) {
                $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')

            } else if(!!maxValue) {
                $(this).val($(this).data('oldValue'));
                //alert('Please enter a number within the range '+ minValue + '-' + maxValue + '');

            }
        });

        $("body").on( "keydown", ".input-number", function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }

    $.getAppPermissionByName = function(appPermissionName) {
        var appPermissions = localStorage_a.getItem('appPermissions')
        var perm = _.filter(appPermissions, function(p){
            return(p.n===appPermissionName);
        });
        if(!!perm[0]){
            return perm[0].appPermissionName;
        }else{
            return 0;
        }
    }

    var autoUpdate = $.Deferred();
    autoUpdate.done(function(){
        $('.btnUpdateApp').trigger('tap');
        autoUpdate = null;
    });


    $.getAppPermission = function(appPermissionName) {
        var appPermissions = localStorage_a.getItem('appPermissions');
        var permCount = _.filter(appPermissions, function(p){
            return(p.appPermissionName===appPermissionName);
        });
        return(permCount.length);
    }

    $.geoLocator = function(callback){
        var slowLocation = window.setTimeout(function(){
            callback({
                position : null,
                lat : undefined,
                lng : undefined
            });
            slowLocation = null;
        }, 3000);

        try{
            navigator.geolocation.getCurrentPosition(

                function(position) {

                    localStorage_a.setItem('position', position);
                    localStorage_a.setItem('lat', "" + position.coords.latitude + "");
                    localStorage_a.setItem('lng', "" + position.coords.longitude + "");
                    $(window).trigger('locationUpdate');
                    if(typeof slowLocation == "number" ){

                        window.clearTimeout(slowLocation);
                        delete slowLocation;
                        callback({
                            position : position,
                            lat : localStorage_a.getItem('lat'),
                            lng : localStorage_a.getItem('lng')
                        });
                    }
                },
                function(err) {
                    if(err.code === 1 && !!$.parseClient().currentTask){

                        var _m = new Model({ 'locationServices': 0 }, {
                          url: serverPath + '/dataClientToken'
                        });

                        _m.save({
                            clientGuid : $.parseClient().clientGuid,
                            auth : localStorage_a.getItem('token'),
                            dsName : 'MOBILE_V5_updateLocationServices',
                            t: '',
                            i: _m.get('locationServices'),
                            k: $.parseClient().currentTask.resourceID,
                            p1:{}
                        },{
                          error: function (xhr, statusTxt, thrown) {
                            var e = new Error('Problem submitting Asset');
                            $.jAlert('Problem saving thing');
                            console.log(statusTxt, 'STATUSTEXT');
                          }
                        });

                    }
                    $.serverLog(err);
                    callback({
                        position : null,
                        lat : undefined,
                        lng : undefined
                    });
                    localStorage_a.setItem('locationErrors', parseInt(localStorage_a.getItem('locationErrors'))+1);
                    if(parseInt(localStorage_a.getItem('locationErrors') % 30 === 0 )){
                      throw err.message || err.code;
                    }
                },

                {
                    enableHighAccuracy: true,
                    timeout : 30000
                }

            );
        } catch(e){
            callback({
                position : null,
                lat : undefined,
                lng : undefined
            });
        }
    }
    $.permissionsPubSub = _.extend({},Backbone.Events);

    $.errorLogging = new (function(){
        var errorHandler = function (fileName, e) {
            window.onerror = null;
            var msg = '';
            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR: msg = 'Storage quota exceeded';
                break;
                case FileError.NOT_FOUND_ERR: case 1: msg = 'File not found';
                break;
                case FileError.SECURITY_ERR: msg = 'Security error';
                break;
                case FileError.INVALID_MODIFICATION_ERR: msg = 'Invalid modification';
                break;
                case FileError.INVALID_STATE_ERR: msg = 'Invalid state';
                break;
                default: msg = 'Unknown error';
                break;
            };
            console.log('Error (' + fileName + '): ' + msg);
        };
        var writeToFile = function(fileName, data, cb) {
            window.resolveLocalFileSystemURL((cordova.file.applicationStorageDirectory || '') + 'Documents/', function (directoryEntry) {
                directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            console.log('Write of file "' + fileName + '"" completed.', data);
                            if(cb) cb();
                        };
                        fileWriter.onerror = function (e) {
                            console.log('Write failed: ' + e.toString());
                        };
                        var blob = new Blob([data], { type: 'text/plain' });
                        fileWriter.write(blob);
                    }, errorHandler.bind(null, fileName));
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        };
        var readFromFile = function (fileName, cb, errorcb) {
            var pathToFile = [(cordova.file.applicationStorageDirectory || '') , 'Documents/' , fileName].join('');
            window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                //console.log('readGromRFile', fileEntry)
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) { cb(this.result); };
                    reader.readAsText(file);
                }, errorHandler.bind(null, fileName));
            }, errorcb.bind(null,fileName) );
        };
        return {
            fileContents : '',
            errorsLogged : 0,
            initialize: function(){
                _.extend(this, Backbone.Events);
                //this.listenToOnce( $.permissionsPubSub, 'sync', this.begin );
                //this.begin();

                return this;
            },
            begin: function(){
                console.log('start error loggger');
                if(/*$.getAppPermission('errorLogging') !== 0 &&*/ device.platform !== 'browser'){
                    window.onerror = function(message, url, line, column, error ){
                        //alert(message+'--'+url+'--'+line+'--'+column+'--'+error);
                        if((message||'').substr(0,37) === 'QuotaExceededError (DOM Exception 22)'){
                          alert("Error: LocalStorage inaccessible, this error is often resolved in iOS by turning off Safari's private browsing mode");
                        }
                        var errorOBJ = {
                            error: error,
                            line: line,
                            message: message,
                            column: column,
                            url: url,
                            time: moment(Date.now()).format('LL HH:mm:ss')
                        };
                        if(error !== undefined){
                            this.logError(errorOBJ);
                        }else{
                            StackTrace.generateArtificially()
                            .then(function(a){
                                errorOBJ.error = JSON.stringify(a);
                                this.logError(errorOBJ);
                            }.bind(this))
                            .catch(function(){
                                this.logError(errorOBJ);
                            }.bind(this))
                        }
                        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!logging error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    }.bind(this);
                }
            },
            mailLogs: function(){
                console.log('mailLogs');
                if(!!this.fileContents){
                    console.log('mailErrorLogs !!fileContents');
                    var data = {
                        clientGuid : $.parseClient().clientGuid,
                        auth : localStorage_a.getItem('token'),
                        dsName : 'MOBILE_V5_emailErrorLogs',
                        i : 0,
                        j: 0,
                        k: 0,
                        t: this.fileContents,
                        p1 : {}
                    };
                    $.jWorking(
                        'Mailing Log',
                        data,
                        function(msg){
                          console.log(msg);
                          $.jSuccess(JSON.parse(msg.d).data[0].result);
                          this.fileContents = '-- Error Log --\n\n';
                          writeToFile('errorLog', this.fileContents, function(){});
                        }.bind(this),
                        function(err){ $.jAlert(err); }
                    );

                }else{
                    readFromFile(
                        'errorLog',
                        function(contents){ this.fileContents = contents || '-- Error Log --\n\n'; this.mailLogs(); }.bind(this),
                        function(fileName, e){
                            if(e.code === FileError.NOT_FOUND_ERR || e.code === 1) $.jAlert('No errors logged');
                        }.bind(this)

                    )
                }
            },
            logError: function(error){
                this.errorsLogged ++;
                if(!!this.fileContents ){
                    console.log('logError !!this.fileContents');
                    this.fileContents = this.fileContents.concat(JSON.stringify(error), '\n\n');
                    writeToFile('errorLog', this.fileContents, function(){
                        //console.log('bbsmailLogs');
                        if( this.errorsLogged % 10 === 0 && this.errorsLogged < 200){ this.mailLogs(); }
                    }.bind(this));
                }else{
                    console.log('logError !this.fileContents');
                    readFromFile(
                        'errorLog',
                        function(contents){
                            this.fileContents = contents || '-- Error Log --\n\n';
                            this.logError(error)
                        }.bind(this),
                        function(fileName, e){
                            console.log('noFileRead', this)
                            if(e.code === FileError.NOT_FOUND_ERR || e.code === 1){
                                writeToFile('errorLog', '-- Error Log --\n\n', this.logError.bind(this, error))
                            }
                        }.bind(this)
                    );
                }
            }
        }.initialize();
    })()

    $.loadPermissions = function(cb, cbFail, verCB) {
        var currentVersion = {
            versionID:0,
            majorRelease:0,
            minorRelease:0
        }
        try {
            currentVersion = localStorage_a.getItem('version') || currentVersion;
        } catch(e){

        }

        currentVersion.userAgent = navigator.userAgent;

        var getPermissions = function(currentVersion){
            if(typeof currentVersion.lat == "undefined" && !!localStorage_a.getItem('lat') ){
                currentVersion.lat = "" + localStorage_a.getItem('lat') + "";
                currentVersion.lng = "" + localStorage_a.getItem('lng') + "";
            }

            if(localStorage_a.getItem('token')){
                var data = {
                    auth : localStorage_a.getItem('token'),
                    dsName : 'CLOUDFM_getAppPermissions',
                    i: 0, j: 0, k: 0, t: '',
                    p1 : currentVersion
                }
                $.jAdminWorking('Checking security...', data,
                function(msg) {
                    var myData = JSON.parse(msg.d);

                    var appPermissions = myData.data;
                    //console.log(appPermissions);
                    var publicGuidArray = _.filter(appPermissions, function(p){return(p.n==='publicGuid');});
                    if(publicGuidArray.length>0){
                        localStorage_a.setItem('publicGUID', publicGuidArray[0].appPermissionName);
                    }
                    var avatarGuidArray = _.filter(appPermissions, function(p){return(p.n==='avatarGuid');});
                    if(avatarGuidArray.length>0){
                        localStorage_a.setItem('avatarGUID', avatarGuidArray[0].appPermissionName);
                    } else {
                        localStorage_a.setItem('avatarGUID', localStorage_a.getItem('token'));
                    }
                    var contractorGuidArray = _.filter(appPermissions, function(p){return(p.n==='contractorGuid');});
                    if(contractorGuidArray.length>0){
                        localStorage_a.setItem('contractorGUID', contractorGuidArray[0].appPermissionName);
                    } else {
                        localStorage_a.setItem('contractorGUID', localStorage_a.getItem('token'));
                    }

                    localStorage_a.setItem('appPermissions', appPermissions);
                    $.permissionsPubSub.trigger('sync', appPermissions);

                    $.loadMobileAppVersion(function(x){ /*console.log(x, 'permissions'); */!!verCB && verCB(x);}, function(x){});
                    cb();
                },
                function(msg) {
                    var appPermissions = [];
                    console.log(msg);
                    localStorage_a.setItem('publicGUID', localStorage_a.getItem('token')); // token is always valid unique identifier
                    localStorage_a.setItem('avatarGUID', localStorage_a.getItem('token')); // token is always valid unique identifier
                    !!cbFail && cbFail();
                });
            } else {
                var appPermissions = [];
                localStorage_a.setItem('appPermissions', appPermissions);
                cb();
            }
        };
        window.plugins.sim.getSimInfo(function(info){
            currentVersion.carrierName = info.carrierName;
            getPermissions(currentVersion);
        }, function(){
            $.jAlert('no network info available');
            getPermissions(currentVersion);
        });

        $.geoLocator(function(geoOb){
            currentVersion.lat = geoOb.lat;
            currentVersion.lng = geoOb.lng;
        });

    }

    $.refreshQRList = function(cb){
        var data = {
            clientGuid : $.parseClient().clientGuid,
            auth : localStorage_a.getItem('token'),
            dsName : 'MOBILE_V5_QR_Sync',
            i : 0,
            j: 0,
            k: 0,
            t: '',
            p1 : {}
        }
        $.serverLog('refreshQRList');

        var client = $.parseClient();
        client.qrCodes = [];
        localStorage_a.setItem('client', client);

        $.jWorking('Downloading QR Codes', data,
        function(msg) {
            client = $.parseClient();
            var myData = JSON.parse(msg.d);
            client.qrCodes = myData.data;
            client.buildingCheckIn = client.buildingCheckIn;
            localStorage_a.setItem('client', client);
            cb();
        },
        function(msg) {
            console.log(msg);
            window.location='#home';
        });
    }

    window.filePart = function( file ) {
        return file.slice ? file.slice(0, 200) : file.webkitSlice ? file.webkitSlice(0, 200) : file.mozSlice ? file.mozSlice( 0, 200) : file;
    }

    $.shrink = function(file, formData, fPath, cB){
        $('body').append('<div id="divProcessingBox" style="border-radius:0px;padding:9px 0;font-size:16px;z-index:3000;display:none;position:fixed;left:0;top:' + parseInt(iosStatusBarHeight+51) + 'px;width:100%;background-color:#12B3D3;color:white;text-align:center;">Compressing Image ...</div>');
        $('#divProcessingBox').slideDown(function(){
            $.serverLog('shrink');
            var image = $('<img src="'+file+'"/>');
            //image.src = file;
            $.serverLog(' shrinkimgcreated');
            image[0].onload = function() {
                //canvas resize
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');


                //always maintains aspect -- only alter w val
                var w = 800;
                var scale = w/image[0].width;
                var h = (image[0].height*scale).toFixed();
                canvas.width = w;
                canvas.height = h;
                EXIF.getData(image[0], function(){
                    var orientation = this.exifdata.Orientation;

                    switch(orientation){
                        case 8:
                        ctx.save();
                        //ctx.translate(200,200);
                        canvas.width = h;
                        canvas.height = w;
                        ctx.translate(h/2, w/2);
                        ctx.rotate(-90*Math.PI/180);
                        ctx.drawImage(image[0], -w/2, -h/2, w, h);
                        ctx.restore();
                        break;
                        case 3:
                        ctx.save();
                        //ctx.translate(200,200);
                        ctx.translate(w/2, h/2);
                        ctx.rotate(180*Math.PI/180);
                        ctx.drawImage(image[0], -w/2, -h/2, w, h);
                        ctx.restore();

                        break;
                        case 6:
                        ctx.save();
                        //ctx.translate(200,200);
                        canvas.width = h;
                        canvas.height = w;
                        ctx.translate(h/2, w/2);
                        ctx.rotate(90*Math.PI/180);
                        ctx.drawImage(image[0], -w/2, -h/2, w, h);

                        ctx.restore();

                        break;

                        default:
                        ctx.save();
                        //ctx.translate(200,200);
                        ctx.translate(w/2, h/2);
                        //ctx.rotate(180*Math.PI/180);
                        ctx.drawImage(image[0], -w/2, -h/2, w, h);
                        ctx.restore();
                        break;

                    }
                });
                //ctx.drawImage(image[0], 0, 0, w, h);
                $.serverLog('imageresized');
                //$.serverLog(EXIF.getData);



                //toDataURL -> toBlob -> callback
                var shrinkedBlob = $.dataURItoBlob(canvas.toDataURL());
                //$.serverLog(shrinkedBlob);
                (function(blob){

                    //var blob = ExifRestorer.restore(file, shrinked);
                    //var blob = new Blob(shrinked);
                    $('#divProcessingBox').fadeOut().remove();
                    formData.append("filUpload", blob, fPath);
                    cB(formData);
                })(shrinkedBlob);
            };
        });
    }

    $.fn.formReset = function(){
        $(this).each (function() { this.reset(); });
    };

    })(jQuery);

    if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {

                var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                len = binStr.length,
                arr = new Uint8Array(len);

                for (var i=0; i<len; i++ ) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback( new Blob( [arr], {type: type || 'image/png'} ) );
            }
        });
    }

    window.shrink = function( img, orientation, blobCb ) {
        $.serverLog('shrink')
        $.jSuccess('Processing Image [3]', undefined, 10)
        var canvas = document.createElement('canvas');
        var w = 800;
        var scale = w/img.width;
        var h = (img.height*scale).toFixed();
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.save();

        switch(orientation){
            case 8:
            canvas.width = h;
            canvas.height = w;
            ctx.translate(h/2, w/2);
            ctx.rotate(-90*Math.PI/180);
            break;
            case 3:
            ctx.translate(w/2, h/2);
            ctx.rotate(180*Math.PI/180);
            break;
            case 6:
            canvas.width = h;
            canvas.height = w;
            ctx.translate(h/2, w/2);
            ctx.rotate(90*Math.PI/180);
            break;
            default:
            ctx.translate(w/2, h/2);
            break;
        }
        ctx.drawImage(img, -w/2, -h/2, w, h);
        //img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        ctx.restore();
        if(!!blobCb){
          canvas.toBlob(blobCb)
          return;
        }else{
          return canvas.toDataURL();
        }
        // return canvas;
    }

    window.filePart = function( file ) {
        return file.slice ? file.slice(0, 15000) : file.webkitSlice  ? file.webkitSlice(0, 15000) : file.mozSlice ? file.mozSlice( 0, 15000) : file;
    }

    window.mobileUpload = function( options ,callback, optionalPath, straightToCallback ) {
        try {
            this.file = options.file;
            this.formData = options.formData;
            this.progresBarId = $(options.progressBarId);
            this.socketPath = options.socketPath;
            console.log('forceNew true');
            var socket = io.connect( serverPath, {
              //"resource": "/test/socket.io"//,
              port:443
             } );
            socket.on('error', function(error){
                console.log(error)
            });
            socket.on('connect_error', function(error){
                console.log(JSON.stringify(error), error.code)
            });

            callback = (function() {
                var cached_function = callback;
                return function() {
                    var result = cached_function.apply(this, arguments);
                    socket.removeAllListeners('error');
                    socket.removeAllListeners('connect_error');
                    return result;
                };
            })();

            this.ajaxDeferred = $.Deferred();

            this.ajaxBefore = function(e) {

                $.jSuccess('Preparing To Upload', this.ajaxDeferred, undefined, 'successcall1');
                console.log('successcall1')
                //$.serverLog('ajaxBefore');
                console.log('ajaxBefore')
                //  this.progresBarId.fadeIn();
            }

            this.ajaxComplete = function ( res ) {
                this.ajaxDeferred.resolve();
                console.log('ajaxComplete');
                //$.serverLog('ajaxComplete', undefined, undefined, 'successcallcompletewheredeferredhappens');
                _.extend(res ,this.formData)
                socket.emit(this.socketPath, res);
                console.log('Socket2Me', this.socketPath);
                this.onFtp( res )
            }
            this.progressBar = function( v , options ) {
                var div = this.progresBarId;

                var progressB = div.find('.progress-bar')
                if ( !progressB.hasClass(options.className) ) {
                    progressB.addClass(options.className)
                }
                progressB.attr('aria-valuenow', v);
                progressB.text(options.title + ' ' + v + ' % ')
                progressB.css('width', v + '%');
            }
            this.progressBarReset = function(  ) {
                var div = this.progresBarId;
                var progressB =div.find('.progress-bar')
                progressB.attr('aria-valuenow', 0);
                progressB.css('width', 0 + '%');
            }

            this.ajaxProgress = function(e) {
                // $.serverLog('ajaxProgress');
                var p = parseInt( (e.loaded / e.total) * 100 );
                $.jSuccess('Preparing To Upload  ' + p + ' %', undefined, undefined, true);
            }

            this.ajaxError =  function ( err ) {
                $.jAlert('ajaxError '+ err );
                $.serverLog('ajaxError',err);
            }

            this.onFtp = function ( res ) {
                this.progresBarId.removeClass('progress-bar-info');
                var that =this;
                socket.on('photoProgress', function(progress){
                    console.log('photoProgress', progress);
                    if ( !!progress.error ) {
                        that.ftpError( progress.error )
                    } else {
                        if ( !!progress.status ) {
                            that.ftpComplete(progress.status)
                            socket.removeAllListeners("photoProgress")
                        } else {
                            that.ftpProgress( progress )
                        }
                    }
                });

            }

            this.ftpProgress = function( e ) {
                // $.serverLog('ftpProgress');
                var p = parseInt( (e.progress / e.total) * 100 );
                $.jSuccess('Uploading  ' + p + ' %', undefined, undefined, true);

            }
            this.ftpComplete = function( res ) {
                $.serverLog('ftpComplete');
                $.jSuccess('Upload Completed', undefined, 100)
                setTimeout(function() {
                    callback(res);
                },500)

            }
            this.ftpError = function( err ) {
                $.jAlert('ftpError '+ err );
                $.serverLog('ftpError',err);
                console.log('ftpError', err )
            }
            this.xhr = function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', this.ajaxProgress.bind(this), true)
                }
                return myXhr;
            }
            $.ajax({
                context: this,
                url: serverPath + (optionalPath || '/mobileUpload'),
                type: 'POST',
                xhr: this.xhr.bind(this),
                beforeSend: this.ajaxBefore,
                success: straightToCallback? callback : this.ajaxComplete,
                error: this.ajaxError,
                data: this.file,
                cache: false,
                contentType: false,
                processData: false
            });
        } catch(e) {
            console.log('err', e.message, e.stack)
            $.serverLog('e',e.message,e.statck);
        }
        return false;
    };

    /*var INITIAL_Y = 0; // Tracks initial Y position, needed to kill Safari bounce effect

    window.kill_safari_bounce = function() {
        $( document ).on( 'touchstart', function( e ){
            INITIAL_Y = e.originalEvent.touches[0].clientY;
        });

        $( document ).on( 'touchmove', function( e ) {
            // Get scrollable ancestor if one exists
            var scrollable_ancestor = $( e.target ).closest( '.scroll' )[0];

            // Nothing scrollable? Block move.
            if ( !scrollable_ancestor ) {
                e.preventDefault();
                return;
            }

            // If here, prevent move if at scrollable boundaries.
            var scroll_delta = INITIAL_Y - e.originalEvent.touches[0].clientY;
            var scroll_pos = scrollable_ancestor.scrollTop;
            var at_bottom = (scroll_pos + $(scrollable_ancestor).height()) == scrollable_ancestor.scrollHeight;

            if ( (scroll_delta < 0 && scroll_pos == 0) ||
            (scroll_delta > 0 && at_bottom) ){
                e.preventDefault();
            }
        });
    };*/
    //kill_safari_bounce();

    (function ($) {

      function scanSuccessAssign(qr) {
        var qrCodeModel = dataClientToken();

        qrCodeModel.save({
          clientGuid: $.parseClient().clientGuid,
          auth: localStorage_a.getItem('token'),
          dsName: 'MOBILE_V5_newQRCode',
          t: qr.qr,
          p1: {}
        }, {
          deferMessage: "Checking new QR ..."
        });

        qrCodeModel.once('sync', function (m) {
          console.log(m.attributes)
          if (_.isEmpty(m.attributes)) {
            $.jAlert('This QR label is not registered');
            return;
          }
          var client = $.parseClient();
          client.qrAssign = m.attributes;
          localStorage_a.setItem('client', client);
          window.location = '#qrAssign';
        })
      }

      function matchQR(qrData, client) {
        if (!client || !client.clientGuid){ window.location = '#home'; }
        if (client.qrCodes.length == 0) {
          $.jAlert('No QR Codes found please re-select ' + client.clientName + ' from the client list');
          window.location = "#setClient";
          return false;
        }

        var QRExist = _.filter(client.qrCodes, function (el) {
          return el.qr.toUpperCase() == qrData.QRCode;
        });

        if (QRExist.length == 0) {

          scanSuccessAssign({
            qr: qrData.QRCode
          });

        } else if (QRExist[0].i == 0 || QRExist[0].b == (0 || null)) {

          scanSuccessAssign(QRExist[0]);

        } else {
          //Success! found matching qr
          window.location = '#qrScan/' + qrData.QRCode;
        }

      }

      $.scanSuccess = function (result) {
        var client = $.parseClient(),
          clients = localStorage_a.getItem('clients');

        if (result.cancelled) {
          window.location = '#home';
        } else {

          var pu = $.parseURI(result.text);

          if (pu.hostname != 'qrcloud.co.uk') {
            $.jAlert('This QR code is not a Cloudfm QR code');
            return;
          }

          var qrData = {
            QRCode: pu.vars.c.substring(7).toUpperCase(),
            QRClient: pu.vars.c.substring(0, 7)
          };

          if (!client || client.qrIdentity.toUpperCase() !== qrData.QRClient.toUpperCase()) {
            client = _.find(
              localStorage_a.getItem('clients'),
              function(c){
                return qrData.QRClient.toUpperCase() === c.qrIdentity.toUpperCase();
              }
            );
            if(!client){
              window.location = '#home';
            }
            $.setClient( client.clientGuid, _.partial(matchQR, qrData)  );
          } else {
            matchQR(qrData, client);
          }

          /* They look like this --
          '0': {  cancelled: false,
          text: 'http://qrcloud.co.uk?c=byron20503c823b-24ea-4eb6-9920-7bc7509bd1c2',
          format: 'QR_CODE' } */
        }
      };

      $.setClient = function(clientGuid, successCB, errorCB) {
        var data = {
          clientGuid: clientGuid,
          auth: localStorage_a.getItem('token'),
          json: {
            actions: [{
              dsName: 'MOBILE_V5_QR_Sync',
              i: 0,
              j: 0,
              k: 0,
              t: '',
              p1: {}
            }, {
              dsName: 'MOBILE_V5_Client_Config',
              i: 0,
              j: 0,
              k: 0,
              t: '',
              p1: {}
            }, {
              dsName: 'CLOUDFM_assetTagCategoriesList',
              i: 0,
              j: 0,
              k: 0,
              t: '',
              p1: {}
            }]
          }
        };
        var client = _.extend( {}, _.findWhere(localStorage_a.getItem('clients'), { clientGuid: clientGuid }));

        if(!client.clientGuid){
          window.location = '#home';
          return false;
        };

        client.qrCodes = [];

        localStorage_a.setItem('client', client);

        return $.jMultiWorking('Downloading QR Codes', data,
          function (msg) {
            //return false;
            var myData = msg.d;
            //console.log(myData.data);
            _.extend(client, {
              qrCodes : myData.MOBILE_V5_QR_Sync.data,
              config : myData.MOBILE_V5_Client_Config.data[0],
              assetCategories : myData.CLOUDFM_assetTagCategoriesList.data,
              buildingCheckIn : {
                onSite: 0,
                checkInID: 0,
                buildingName: '',
                checkInDate: ''
              }
            });

            localStorage_a.setItem('client', client);

            successCB(client);
          },
          (errorCB || successCB)
        );

      }
    })(jQuery);

});

window.detectOS = function() {
    var ua = navigator.userAgent;
    return ua.indexOf('Android') !==-1 ? 'Android' : ( ua.indexOf('iPhone') !==-1 || ua.indexOf('iPad') !==-1 ) && 'IOS';
}

window.isPortrait = function(img) {
    var w = img.naturalWidth || img.width,
    h = img.naturalHeight || img.height;
    return (h > w);

};

var Model = Backbone.Model.extend({
    _defaults : {
        i : 0, j : 0, k : 0, t : '', p1 : {}, txt: ''
    },
    parse: function(resp, options ) {
        this.id = _.uniqueId('model_');
        if ( resp.status == 0 ) {
            window.App.session.set('logged_in', false)
            return
        }
        if ( resp.d ) {
            try {
                resp = JSON.parse(resp.d).data[0]
            } catch( e ) { }
        }
        return   resp instanceof Array ? resp[0] : resp
    },
    options : function( attr ) {
        //console.log( 'attr',attr, 'this._defaults',this._defaults )
        var _t = this
        return  {
            url: this.url,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            data: JSON.stringify( _.extend( _.clone( this._defaults ), attr ) ),
            dataType: "json",
            complete: function(xhr, str){
                console.log('I may have died ', str)
                !!_t.defd && _t.defd.resolve(undefined, ["error", "abort"].indexOf(str) !== -1 );
            },
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    _t.defd.resolve('Connection error', true);
                }else{
                    $.connectionRecovery(xhr, _t.defd)
                }
            }


        };
    },
    stringify : function( attr ) {
        var a = _.extend( _.clone( this._defaults ), attr )
        return JSON.stringify( a )
    },
    fetch: function( attr, options ) {
        var options = options ||  { silent : true };
        this.defd = $.Deferred();
        options = _.extend(  this.options( attr ) , options );

        !!options.deferMessage && $.jSuccess(options.deferMessage, this.defd);
        return Backbone.Model.prototype.fetch.call(this, options);
    },
    post: function ( attr , options) {
        // console.log( 'post options b ', options )
        var options = options ||  {};
        this.defd = $.Deferred();
        //console.log( 'post options a', options )
        options = _.extend( _.clone ( this.options( attr ) ), options )
        this.set(this.attributes);
        !!options.deferMessage && $.jSuccess(options.deferMessage, this.defd);
        return Backbone.Model.prototype.save.call(this, this.attributes, options);
    },
    save: function (attr,options) {
        var  options = options ||  {};
        this.defd = $.Deferred();
        console.log( 'save options ', options, attr, this.attributes )
        options = _.extend( _.clone ( this.options( attr ) ), options )
        this.set(this.attributes);
        !!options.deferMessage && $.jSuccess(options.deferMessage, this.defd);
        return Backbone.Model.prototype.save.call(this, this.attributes, options);
    },
    destroy: function(attr) {
        var  options = options ||  {}
        options = _.extend( _.clone ( this.options( attr ) ), options )
        options.emulateHTTP = true;
        options.beforeSend = function(xhr) {
            xhr.setRequestHeader('X-HTTP-Method-Override', 'POST');
        }
        return Backbone.Model.prototype.destroy.call(this, options);
    }
})

var Collection = Backbone.Collection.extend({
    model : Model,
    _defaults : {
        i : 0, j : 0, k : 0, t : '', p1 : {}, txt: ''
    },
    parse : function( resp, optons ) {
        if ( resp.d ) {
            resp = JSON.parse(resp.d).data
        }
        return resp;
    },
    fetch : function( attr, opts ) {
        this.defd = $.Deferred();
        var options = {
            url: this.url,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            data: JSON.stringify( _.extend( _.clone( this._defaults ), attr ) ),
            dataType: "json",
            complete: function(xhr, str){
                !!this.defd && this.defd.resolve(undefined, ["error", "abort"].indexOf(str) !== -1 );
            }.bind(this),
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    this.defd.resolve('Connection error', true);
                }else{
                    $.connectionRecovery(xhr, this.defd)
                }
            }.bind(this),
            silent : false
        };
        if ( opts ) {
            _.extend( options, opts )
        }
        !!options.deferMessage && $.jSuccess(options.deferMessage, this.defd);
        // console.log( 'collection options ', options)
        return Backbone.Collection.prototype.fetch.call(this, options);
    }
});

var multiClientCollection = Backbone.Collection.extend({
    model : Model,
    _defaults : {
        i : 0, j : 0, k : 0, t : '', p1 : {}
    },
    parse : function( resp, optons ) {
        var r =[]
        _.each ( resp.data, function( c, k ) {
            _.each( c.data, function( v) {
                r.push( _.extend( _.omit( c, 'data'), v ) )
            })
        })
        return r
    },
    fetch : function( data, opts ) {
        this.defd = $.Deferred();
        console.log(JSON.stringify( _.extend( _.clone( this._defaults ), data ) ), opts);
        var options = {
            url: this.url,
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            data: JSON.stringify( _.extend( _.clone( this._defaults ), data ) ),
            dataType: "json",
            complete: function(xhr, str){
                !!this.defd && this.defd.resolve(undefined, ["error", "abort"].indexOf(str) !== -1 );
            }.bind(this),
            beforeSend: function(xhr){
                if($.connectionRecovery.fail === true){
                    xhr.abort();
                    this.defd.resolve('Connection error', true);
                }else{
                    $.connectionRecovery(xhr, this.defd)
                }
            }.bind(this),
            silent : false
        };
        if ( opts ) {
            _.extend( options, opts )
        }
        !!options.deferMessage && $.jSuccess(options.deferMessage, this.defd);
        // console.log( options )
        return Backbone.Collection.prototype.fetch.call(this, options);
    }
});


// Start Contractor ---------------------------------------------------
var multiClient = function() {
    return new Collection(null, { url : 'multiClientContractor' } )
}

var contractorModel = function() {
    return new Model(null,{
        url : serverPath +'/dataContractor'
    })
}
var contractorMulti = function() {
    return new Model(null,{
        url : 'dataContractorMulti'
    })
}

var contractorCollection = function() {
    return new Collection(null,{
        url : 'dataContractor'
    })
}


var contractorDBModel = function() {
    return new Model(null,{
        url : 'dataContractorDB'
    })
}

var contractorDBCollection = function() {
    return new Collection(null,{
        url : 'dataContractorDB'
    })
}

// End Contractoe

// Start nodePortal

var metaCollection = function() {
    return new Collection(null, { url : serverPath +'/dataMetaToken' } )
}

var npMetaCollection = function() {
    return new Collection(null, { url : 'dataMeta' } )
}
var metaModel = function() {
    return new Model(null,{
        url : serverPath +'/dataMetaToken'
    })
}
var systemModel =   function() {
    return new Model( null, { url : 'system' })
}
var loginModel =   function() {
    return new Model( null, { url : 'loginNew' })
}

var  dataClientToken  =  function() {
    return new  Model(null, { url : serverPath + '/dataClientToken' } )
};

var  clientModelToken  =  function() {
    return new  Model(null, { url : serverPath + '/dataClientToken' } )
};

var  clientCollectionToken  =  function(props, modelProps) {
    var defProps = { url : serverPath + '/dataClientToken' };
    props = _.extend(
      {},
      defProps,
      (props||{}),
      {
        model: Model.extend(_.extend({},defProps,modelProps||{}))
      }
    );
    return new (Collection.extend(props))();
};


var contractorPortal = {
    collection : {
        multiClient : function() {
            return new  multiClientCollection( null, { url : serverPath +'/multiClientContractorMobile' } )
        },
        default : function() {
            return new Collection( null, { url : 'dataContractor' } )
        }
    }
};

var getWeek = function( d ) {
    d = new Date(d);
    var target  = new Date(d.valueOf());
    var dayNr   = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var jan4    = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - jan4) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);
    return weekNr;
};

var baseView = (function(View) {
  return View.extend({
    inputKiller: $('<input type="text" class="inputKill" />'),
    constructor: function (options) {
      //this.options = options;
      Object.defineProperty(this, 'state', {
        set: function (s) {
          this.viewState = s;
          this.trigger('stateChange', s);
        },
        get: function () {
          return this.viewState;
        }
      });
      _.bindAll(this, 'constructSection');

      View.apply(this, arguments);

      this.render = (function(render) {
        function renderWithEvent() {
          render.apply(this, arguments);
          this.trigger('rendered');
          //console.log('BASEVIEW', this);
          if(this.constructedSections){
            for(var k in this.constructedSections){
              this.constructedSections[k].innerHTML = this.templates[k](this.renderParams);
            }
            /*this.$el.prepend($(_.values(this.constructedSections)));*/
          }
          this.$el.append(this.inputKiller);
        }
        return renderWithEvent;
      })(this.render);

    },
    constructSection: function(k){
      this.constructedSections = this.constructedSections || {};
      var el = this.constructedSections[k] = document.createElement('div');
      el.setAttribute('class', 'xpanel panel-primary section ' + k);
      el.style.display = 'none';
    },
    serializeTemplates: function(templates){
      this.templates = {};
      _.each(templates, function(tmp, k){
        console.log(k.substr(0,9));
        if('_section_'===k.substr(0,9)){
            k = k.substr(9)
            this.constructSection(k);
        }
        console.log('KKKKKKK',k);
        this.templates[k] = tmp
      }, this);

    },
    /*serializeTemplates: function (tmp) {
      var templates = this.templates = {};
      var tmpReg = /<script.*?type\="text\/template[\/]{0,1}(.*?)".*?id\="(.+?)".*>([.\s\S]*?)<\/script/g;
      var ce = this.constructSection;
      tmp.replace(tmpReg, function (m, $1, $2, $3, i) {
        //console.log($1, $2, $3);
        if($1 === 'section'){
          ce($2);
        }
        templates[$2] = _.template($3);
        return;
      });
    },*/
    viewState: 0,
    template: '',
    parentContainer: '',
    promiseTemplate: function () {
      var deferred = $.Deferred();
      if (this.template && typeof this.template === 'string') {
        $.getPageHtmlAsync(
          this.template,
          false,
          function (template) {
            console.log('templatePromis', template);
            deferred.resolve();
          });
      } else if (typeof this.template === 'function') {
        deferred.resolve();
      } else {
        deferred.reject('no template specified');
      }
      return deferred;
    },
    render: function (cb) {
      //console.log('render', this.el);
      if (!this.template) {
        return this;
      }
      if (typeof this.template === 'function') {
        this.$el.html(this.template(this.serialize()))
        typeof cb === 'function' && cb();
        !!this.afterRender && this.afterRender();
        return this;
      }
      $.getPageHtmlAsync(this.template, false, function (template) {
        this.$el.html(template(this.serialize()));
        !!cb && cb();
        !!this.afterRender && this.afterRender();
      }.bind(this));
      return this;
    },
    append: function () {
      this.$el.appendTo(this.parentContainer);
      return this;
    },
    serialize: function () {
      return {};
    },

    close: function () {
      this.unbind()
      this.remove()
    }
  });
})(Backbone.View);

window.sortedArray = (function () {
    var SortedArray = defclass({
        constructor: function (array, compare) {
            this.array   = [];
            this.compare = compare || compareDefault;
            var length   = array.length;
            var index    = 0;

            while (index < length) this.insert(array[index++]);
        },
        insert: function (element) {
            var array   = this.array;
            var compare = this.compare;
            var index   = array.length;

            array.push(element);

            while (index > 0) {
                var i = index, j = --index;

                if (compare(array[i], array[j]) < 0) {
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }

            return this;
        }
    });

    SortedArray.comparing = function (property, array) {
        return new SortedArray(array, function (a, b) {
            return compareDefault(property(a), property(b));
        });
    };

    return SortedArray;

    function defclass(prototype) {
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    }

    function compareDefault(a, b) {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    }
}());

Backbone.View.prototype.pubSub = _.extend({}, Backbone.Events);
