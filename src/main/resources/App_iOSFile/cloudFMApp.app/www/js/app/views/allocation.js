(function(){
    var tmps;
    var localObj = {};
    window.viewConstructors.AllocationView = Backbone.View.extend({ __name__:'window.viewConstructors.AllocationView',
      initialize: function () {
        $('#nebulousContainer').html(this.$el);
        this.subViews = {};
        this.slides = ['beginEndDay', 'yourVisits', 'Supervisors'];
        $.getPageHtmlAsync(
          ['allocationFrame.html', 'rmt/beginEndDay.html', 'rmt/yourVisits.html',
            'rmt/Supervisors.html', 'rmt/visit.html', 'rmt/taskNote.html', 'rmt/agendaSubPanel.html'
          ],
          false,
          function (templates) {
            console.log('THEN');
            tmps = templates;
            this.render();
        }.bind(this));

        this.listenTo(this.pubSub,'selectEng', function (e) {
          var view = 'yourVisits';
          this.prevSection();
          this.slide(1, {
            engineer: e.engineer
          });
        }, this);
      },
      render: function () {

        this.tmps = tmps;
        var tmp = tmps['allocationFrame.html'];
        window.footerView.footer(this, 'allocationFrame.html', {});
        this.$el.html(tmp());
        _.each(this.slides, function (v, i) {
          this.slide(i, {
            htmlStr: tmps['rmt/' + v + '.html']
          });
        }, this);
        localObj.swipe = this.swipe = new Swipe(document.getElementById('myDavid'), {
          startSlide: 0,
          speed: 400,
          continuous: false,
          callback: this.swipeHandler.bind(this)
        });

        return this;
      },
      swipeHandler: function (index, element, g) {
        if (index === 0) {

          //$('.btnPrevSection').fadeOut()
          $('.btnPrevSection').css('visibility', 'hidden');
        } else {
          $('.btnPrevSection').css('visibility', 'visible');
        }

        if (index === 2) {

          //$('.btnNextSection').fadeOut()
          $('.btnNextSection').css('visibility', 'hidden');
        } else {
          $('.btnNextSection').css('visibility', 'visible');
        }

      },
      slide: function (index, options) {
        if (index === 0) {

          $('.btnPrevSection').css('visibility', 'hidden');
        }

        var view = this.slides[index];
        options = options || {};
        var params = _.extend({
          parent: $('[data-view="' + view + '"]'),
          slide: {
            no: index + 1,
            max: this.slides.length
          }
        }, options);
        if (this.subViews[view]) {
          //
          this.subViews[view].initialize(params);
        } else {
          this.subViews[view] = new sViews[view](params);
        }
      },
      events: {
        "tap .btnExitMenu": "goBack",
        "tap .btnNextSection": "nextSection",
        "tap .btnPrevSection": "prevSection",
      },
      cleanup: function () {
        this.undelegateEvents();
        $(this.el).empty();
      },
      goBack: function (e) {
        e.preventDefault();
        this.close();
        window.location = '#home';

        return (false);
      },
      nextSection: function () {
        this.swipe.next();
      },
      prevSection: function () {
        this.swipe.prev();
      },
      close: function () {
        _.each(this.subViews, function (v) {
          (v.close) ? v.close() : v.remove();
          v.remove();
        });
        this.swipe.kill();
        delete localObj.swipe;
        this.unbind('selectEng');
        this.remove();

      }
    });

    var sViews = _.extend({}, {
      beginEndDay: baseView.extend({ __name__:'beginEndDay',
        initialize: function (options) {
          this.template = tmps['rmt/beginEndDay.html'];
          this.options.parent.html(this.$el);
          _.extend(this, {
            model: metaModel()
          }, options);
          this.setDefaults();
          this.render();
          this.listenTo(this.model, 'change', this.render);
        },
        render: function () {
          var template = this.htmlStr;
          this.$el.html(template(this.serialize()));
        },
        events: {
          'tap .startDay': "startDay",
          'tap .endDay': 'endDay',
          'tap .newDay': 'newDay'
        },
        startDay: function () {
          var startOdometer = this.$('[name="startOdm"]').val();
          if (startOdometer) {
            this.location(function (err, position) {
              if (err) return;
              this.model.save({
                auth: localStorage_a.getItem('token'),
                dsName: 'engineerBeginDay',
                i: startOdometer,
                p1: {
                  longitude: "" + position.coords.longitude + "",
                  latitude: "" + position.coords.latitude + ""
                }
              }, {
                deferMessage: "Starting day"
              });
              this.listenTo(this.model, 'sync', this.savetoLocalStorage);
            }, this);
          } else {
            this.$('[name="startOdm"]').focus();
          }
        },
        endDay: function () {
          var endOdometer = this.$('[name="endOdm"]').val();
          if (endOdometer) {
            this.location(function (err, position) {
              if (err) {
                return;
              }
              this.model.save({
                auth: localStorage_a.getItem('token'),
                dsName: 'engineerEndDay',
                i: endOdometer,
                p1: {
                  longitude: "" + position.coords.longitude + "",
                  latitude: "" + position.coords.latitude + ""
                }
              }, {
                deferMessage: "Ending day"
              });
              this.listenTo(this.model, 'sync', this.savetoLocalStorage);
            }, this);
          } else {
            this.$('[name="endOdm"]').focus();
          }
        },
        location: function (callback, ctx) {
          var options = {
            maximumAge: 30000,
            timeout: 5000,
            enableHighAccuracy: true
          };
          var defed = $.Deferred();

          function success(pos) {
            defed.resolve();
            $.jAlert('Problem Finding your location...', defed);
            callback.call(ctx, null, pos);
          }

          function error(err) {
            //$.jAlert(err.message);
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
            $.jSuccess('Finding your location...', defed);
            callback.call(ctx, err.message, null);
          }


          navigator.geolocation.getCurrentPosition(success, error, options);
        },
        setDefaults: function () {
          if (!localStorage_a.getItem('beginEndDay')) {
            this.model.set({
              beginDay: null,
              endDay: null,
              dayLengthHours: null
            }, {
              silent: true
            });
            this.savetoLocalStorage();
          } else {
            this.model.set(localStorage_a.getItem('beginEndDay'));
          }
        },
        newDay: function () {
          this.model.set({
            beginDay: null,
            endDay: null,
            dayLengthHours: null
          });
          this.savetoLocalStorage();
        },
        savetoLocalStorage: function (m) {
          //!!m && !!m.defd && m.defd.resolve();
          localStorage_a.setItem('beginEndDay', this.model.toJSON());
        },
        serialize: function () {
          return {
            slide: this.slide,
            model: this.model.toJSON()
          };
        }
      }),
      yourVisits: baseView.extend({ __name__:'yourVisits',
        initialize: function (options) {
          this.template = tmps['rmt/yourVisits.html'];
          _.extend(this, {
            agenda: _.extend(contractorPortal.collection.multiClient(), {
              comparator: function (m) {
                return m.get('etaDate');
              }
            }),
            taskNotes: contractorPortal.collection.multiClient(),
            stats: {},
            stats2: {},
            subViews: []
          }, options);
          this.parent.html(this.$el);

          this.render();
          this.$('.stats').text('');

          if (this.engineer) {
            this.delegateEvents();
            this.getData(this.engineer.mobileGuid);
          } else {
            var engineerStats = localStorage_a.getItem('engineerStats');
            if (engineerStats) {
              this.stats = engineerStats;
              this.renderStatsBubbles(engineerStats);
              var taskNotes = localStorage_a.getItem('taskNotes');
              if (taskNotes) {
                this.taskNotes.set(taskNotes);

              }
            }
          }
          this.listenToOnce(this.agenda, 'sync', this.getTaskNotes);

          this.listenToOnce(this.taskNotes, 'sync', function (notes) {
            //!!notes && !!notes.defd && notes.defd.resolve();
            this.render(function () {

              this.renderStatsBubbles(this.mapStats());
            }.bind(this));
            localStorage_a.setItem("taskNotes", notes.toJSON());
          }, this);

          //this.listenToOnce('',  )
        },
        render: function (cb) {
          var template = this.htmlStr;
          this.$el.html(template(this.serialize()));
          return cb && cb();
        },
        events: {
          'tap .ep': 'renderPanel',
          'tap .back': 'back',
          'tap .sync': 'getData',
          'tap .supervisors': 'supervisors'
        },
        getData: function (guid) {
          //$.jSuccess('Sync in progress ');
          if (typeof guid === 'object') {
            guid = localStorage_a.getItem('token');
          }
          this.agenda.fetch({
            auth: localStorage_a.getItem('token'),
            contractorGuid: "5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38",
            dsName: "CLOUDFM_allocatedVisitsMobile",
            p1: {
              engineerGuid: guid
            }

          }, {
            deferMessage: 'Sync in progress '
          });
        },
        getTaskNotes: function (m) {

          //!!m && !!m.defd && m.defd.resolve();
          //$.jSuccess('Task notes Sync in Progress ');
          this.taskNotes.fetch({
            auth: localStorage_a.getItem('token'),
            contractorGuid: "5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38",
            dsName: "CLOUDFM_allocatedVisitsNextTaskNotes",
            p1: {}
          }, {
            deferMessage: "Task notes Sync in Progress"
          });
        },
        renderStatsBubbles: function (stats) {
          _.each(stats, function (v, k) {

            this.$('.' + k).text(v.length);
          }, this);
        },
        mapStats: function () {
          var statsType = ["visitPast", "visitToday", "visitTomorrow", "visitFuture"];
          _.each(statsType, function (type) {
            this.stats[type] = this.agenda.filter(function (m) {
              return m.get(type) === 1;
            });
          }, this);
          localStorage_a.setItem("engineerStats", this.stats);
          return this.stats;
        },
        serialize: function () {
          return {
            slide: this.slide,
            engineer: this.engineer
          };
        },
        renderPanel: function (e) {
          var el = $(e.currentTarget),
            attrs = el.data();
          var fragment = $(document.createDocumentFragment());
          var visitTemplate = tmps['rmt/visit.html'];
          var noteTemplate = tmps['rmt/taskNote.html'];
          var template = tmps['rmt/agendaSubPanel.html'];


          _.each(this.stats[attrs.stat], function (m) {
            var buildingGuid = m.buildingGuid;
            if (m.get) {
              buildingGuid = m.get('buildingGuid');
            }
            var notes = this.taskNotes.filter(function (n) {
              return buildingGuid == n.get('buildingGuid');
            });
            var view = new sViews.visit({
              model: m,
              notes: notes,
              template : visitTemplate,
              noteTemplate: noteTemplate
            });
            fragment.append(view.el);
            this.subViews.push(view);
          }, this);

          this.$('.subPanel').html(template({
            title: attrs.title
          }));
          this.$('.visits').html(fragment);
          this.$('.ep').not(el).removeClass('active');
          el.addClass('active');
          this.$(".main").hide();
          this.$(".subPanel").show();
          localObj.swipe.disable();

        },
        back: function () {
          this.$('.ep').removeClass('active');
          this.$(".subPanel").hide();
          this.$(".main").show();
          localObj.swipe.enable();
        },
        close: function () {
          _.invoke(this.subViews, 'close');
          this.remove();
        }
      }),
      visit: baseView.extend({ __name__:'visit',
        initialize: function (options) {
          _.extend(this, {
            oddJobs: clientCollectionToken(),
            subViews: []
          }, options);
          this.render();
          this.renderNotes();
        },
        events: {
          'tap .tgl': 'tgl',
          'tap .acknowledgeNote': 'acknowledgeNote',
          'tap .requestReport': 'requestReport',
          'tap .showOddJobs': 'showOddJobs'
        },
        serialize: function () {
          var model = this.model;
          if (this.model.toJSON) {
            model = this.model.toJSON();
          }
          return {
            v: model,
            notes: this.notes
          };
        },
        renderNotes: function () {
          var fragment = $(document.createDocumentFragment());

          _.each(this.notes, function (note) {
            var view = new sViews.note({
              model: note,
              template : this.noteTemplate
            });
            view.render();
            //console.log(view);
            fragment.append(view.el);
            this.subViews.push(view);
          }, this);
          this.$('.taskNotes').html(fragment);
        },
        getOddJobs: function () {
          this.oddJobs.fetch({
            auth: localStorage_a.getItem('token'),
            clientGuid: this.model.clientGuid || this.model.get('clientGuid'),
            dsName: "MOBILE_V5_oddjobList",
            t: this.model.taskGuid || this.model.get('taskGuid')
          }, {
            deferMessage: 'Loading odd jobs'
          });
        },
        showOddJobs: function (e) {
          var el = $(e.currentTarget);
          if (el.attr('data-action') == 1) {
            this.$('.oddJobs').hide();
            el.attr('data-action', 0);
          } else {
            this.getOddJobs();
            this.listenToOnce(this.oddJobs, 'sync', this.renderOddJobs);
            el.attr('data-action', 1);
          }
        },
        renderOddJobs: function () {
          $.getPageHtmlAsync('rmt/oddJobs.html', false, function (template) {
            this.$('.oddJobs').html(template({
              oddJobs: this.oddJobs.toJSON()
            }));
            this.$('.oddJobs').show();
          }.bind(this));
        },
        requestReport: function () {
          var report = dataClientToken();

          report.save({
            auth: localStorage_a.getItem('token'),
            clientGuid: this.model.clientGuid || this.model.get('clientGuid'),
            dsName: "MOBILE_V5_requestSiteReport",
            t: this.model.buildingGuid || this.model.get('buildingGuid')
          }, {
            deferMessage: "Requesting report"
          });
          this.listenToOnce(report, 'sync', function (res) {
            //!!res && !!res.defd && res.defd.resolve();
            var alert = '';
            if (res.get('messageText') === 'OK') {
              alert = '<div class="alert alert-success">Building report will be emailed shortly</div>';
            } else {
              alert = '<div class="alert alert-danger">Problem with requesting report , please try later</div>';
            }
            this.$('.notify-').html(alert).fadeIn().fadeOut(4000);
          });
        },
        tgl: function (e) {
          var el = $(e.currentTarget);
          if (el.hasClass('active')) {
            this.$('.main-').show();
            this.$('.desc-').hide();
          } else {
            this.$('.main-').hide();
            this.$('.desc-').show();
          }
        },
        close: function () {

          _.invoke(this.subViews, 'remove');
        }
      }),
      note: baseView.extend({ __name__:'note',
        initialize: function (options) {
          _.extend(this,options);
          this.listenTo(this.model, 'change', this.render);
        },
        events: {
          'tap .acknowledgeNote': 'acknowledgeNote'
        },
        acknowledgeNote: function () {
          var note = dataClientToken();
          note.save({
            auth: localStorage_a.getItem('token'),
            contractorGuid: "5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38",
            clientGuid: this.model.get('clientGuid'),
            dsName: "CLOUDFM_acknowledgeNextVisitNote",
            t: this.model.get('notesForNextVisitGuid'),
            p1: {}
          }, {
            deferMessage: "Saving note"
          });
          this.listenToOnce(note, 'sync', function (m) {
            //!!m && !!m.defd && m.defd.resolve();
            this.model.set(m.toJSON());
            localStorage_a.setItem("taskNotes", this.model.collection.toJSON());
          });
        },
        serialize: function () {
          return {
            n: this.model.toJSON()
          };
        }
      }),
      Supervisors: baseView.extend({ __name__:'Supervisors',
        initialize: function (options) {
          this.template = tmps['rmt/Supervisors.html'];
          _.extend(this, {
            engineerList: metaCollection(),
            stats: {}
          }, options);
          this.parent.html(this.$el);
          this.render();
          this.listenTo(this.engineerList, 'sync', this.renderEngineerList);
        },
        render: function () {
          var template = this.htmlStr;
          this.$el.html(template({
            slide: this.slide
          }));
        },
        events: {
          "tap .eng": 'selectEngineer',
          "tap .engineerList": 'getData',
          "tap .onsite": 'onsite',
          "tap .todaysAgenda": 'todaysAgenda',
          "tap .engHeader": "showTasks"
        },
        renderEngineerList: function (m) {
          $.getPageHtmlAsync('rmt/engineerList.html', false, function (template) {
            this.$('#supContainer').html(template(this.serialize()));
          }.bind(this));

        },
        getData: function () {
          this.engineerList.fetch({
            auth: localStorage_a.getItem('token'),
            contractorGuid: "5D623FF0-7E61-4C90-B14D-B7E8BF7CAF38",
            dsName: "RMT_engineerList"
          }, {
            deferMessage: 'Sync in progress'
          });
        },
        onsite: function () {
          $.jSuccess('Sync in progress ');
          $.getJSON('https://cloudfmsystems.com:7004/getCache/1/engineersOnsite', function (data) {
            $.getPageHtmlAsync('rmt/engineerOnsite.html', false, function (template) {
              this.$('#supContainer').html(template({
                data: data
              }));
            }.bind(this));
          }.bind(this));
        },
        showTasks: function (e) {
          var el = $(e.currentTarget),
            engineerGuid = el.attr('data-engineerGuid');
          this.$('#' + engineerGuid).fadeToggle();
          el.toggleClass('engHeaderactive');
        },
        todaysAgenda: function () {
          $.jSuccess('Sync in progress ');
          $.getJSON('https://cloudfmsystems.com:7004/getCache/1/engineersTodaysAgenda', function (data) {
            data = _.groupBy(data, 'engineerName');

            $.getPageHtmlAsync('rmt/engineerAgenda.html', false, function (template) {
              this.$('#supContainer').html(template({
                data: data
              }));
            }.bind(this));

          }.bind(this));
        },
        serialize: function () {
          return {
            slide: this.slide,
            engineerList: this.engineerList.toJSON()
          };
        },
        selectEngineer: function (e) {
          var engGuid = $(e.currentTarget).attr('data-engGuid');
          var engineer = this.engineerList.findWhere({
            mobileGuid: engGuid
          }).toJSON();
          this.pubSub.trigger('selectEng', {
            engineer: engineer
          });
        }
      })
    });
  })();
