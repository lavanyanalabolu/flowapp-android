(function () {
  var commonMethods = baseView.extend({
    constructor: function(){
      this.serializeTemplates(
        _.extend({},window.App.viewTaskSlides['viewTaskSlides/AuditReactive.html'],window.App.viewTaskSlides['auditReactive/audit.html'])
      );

      return baseView.prototype.constructor.apply(this, arguments);
    },
    uploadPhoto: function (photo, model, callback) {
      var fileURL = photo.imageURI;

      model = model || this.model;
      console.log(photo, 'thePhoto');
      try {
        var options = new FileUploadOptions();
        options.headers = {
          Connection: "close"
        };
        options.fileKey = "file";
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.params = _.extend({
          auth: localStorage_a.getItem('token'),
          clientGuid: $.parseClient().clientGuid,
          taskGuid: $.parseClient().currentTask.taskGuid
        }, model.toJSON());

        var Success = function (r) {
          console.log(r);
          var photos = _.map(model.get('photos'), function (p) {
            if (p.imageURI == fileURL) {
              p.submited = true;
            }
            return p;
          });

          model.set('photos', photos, {
            silent: true
          });
          return callback(null, true);
        };

        var Error = function (error) {
          return callback(error, false);
        };
        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI(serverPath + "/uploadAudit"), Success, Error, options);
      } catch (err) {
        return callback(err, false);
      }
    },
    submitPhotos: function (model, processFileCallback) {
      var i = 1;
      async.each(_.where(model.get('photos'), { submitted : false }), function (photo, cb) {
        var defd = $.Deferred();
        $.jSuccess('Submiting Photo No ' + i, defd);
        this.uploadPhoto(photo, model, function (err, status) {
          if (err) {
            defd.resolve('Photo ' + i + ' failed');
            console.log(err);
            i++;
            return cb(err);
            //return   processFileCallback( err, null);
          }
          //!!window.App.magFailDeferred && window.App.magFailDeferred.resolve('Connection established');
          defd.resolve('Photo ' + i + ' submited');
          i++;
          cb();
        });
      }.bind(this), function (err) {
        console.log(err);
        processFileCallback(err || null, true);
      });
    },
    serialize: function(){
      return this.model.toJSON();
    }
  });

  App.SlideConstructors.AuditReactiveSlide = commonMethods.extend({ __name__:'AuditReactiveSlide',
    events: {
      "tap .backToAuditMain": 'backToAuditMain',
      "tap .save": "submitAudit",
      "tap .backToMain": "backToMain"
    },
    backToMain: function () {
      if (this.subView !== null && !!this.subView.close) {
        this.subView.close();
        this.render();
      }
      console.log('backToMain');
      window.footerView.footer(this, 'AuditReactiveSlide.html', {});
      routeSlideController.enable();
    },
    editAudit: function () {
      this.trigger('editAudit');
    },
    initialize: function () {
      console.log('iiii');
      _.extend(this, {
        auditList: clientCollectionToken({
          incompleteAudits: function(){
            $.updateTaskInfo('auditList', this.toJSON());
            $.updateTaskInfo('finishTask',
              {
                'incompleteAudits': this.filter(function(m){ return !m.get('saved'); }).length
              });
          }
        }, {
          initialize: function(){
            console.log('auditinit', this);
            if(this.get('auditScore') !== null){
              this.set('saved', true);
            }else{
              this.set('saved', false);
            }
          },
          getSaveable: function(){
            return !(
              (this.get('auditScore') === null) ||
              (
                this.get('auditScore') < 6 &&
                ( !this.get('auditNotes') || this.auditPhotos.models.length < 3 )
              )
            );
          }
        }),
        client: $.parseClient(),
        subViews: []
      });

      this.listenToOnce(this.auditList, 'sync', this.renderAuditList);
      this.listenTo(this.auditList, 'sync', function(c){
        this.incompleteAudits();
      }.bind(this.auditList));
    },
    serialize: function () {
      var headerTmp = $.headerTmp,
        client = $.parseClient(),
        currentTask = client.currentTask;

      return _.defaults({
        headerTmp: headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task
      });
    },
    render: function (mode) {
      var currentPage = this;
      if (!localStorage_a.getItem('client')) {
        window.location = '#setClient';
      } else {

        var renderParams = this.renderParams = this.serialize();

        var tmp = this.templates.AuditReactiveMain;

        var pageBody = tmp(renderParams);

        this.$el.html(pageBody);
        this.once('idle', this.getAuditList);

        return this;
      }
    },
    renderAuditList: function () {
      //this.$('.auditList').html('');

      this.auditList.reduce(function (subviews, model, i) {
        var v = subviews[i] = new auditDetails({ model: model });
        /*.prepend(v.el);*/
        return subviews;
      }, this.subViews, this);
      
      if(!this.subViews.length){
        this.$('.auditList').html('<h1 class="text-center">No pending audits</h1>')
      }else{
        this.$('.auditList').html($(_.pluck(this.subViews, 'el')));
      }

    },
    getAuditList: function () {
      //localStorage_a.removeItem('auditList');
      var auditList = $.parseClient().currentTask.auditList;//localStorage_a.getItem('auditList');
      if(!!auditList) {
        this.auditList.reset(auditList, {
          silent: true
        }).trigger('sync', this.auditList);
      } else {
        this.auditList.fetch({
          auth: localStorage_a.getItem('token'),
          clientGuid: this.client.clientGuid,
          dsName: 'MOBILE_V5_auditList',
          i: this.client.currentTask.taskID
        }, {
          deferMessage: "Downloading audit list ...",
          silent: true
        });
      }

    },
    backToAuditMain: function () {
      $('.auditPhotos').fadeOut();
      $('.createAudit').show();
    },
    renderFooter: function (taskStarted) {
      taskStarted && window.footerView.footer(this, 'AuditReactiveSlide.html', {});
    },
    submitAudit: function (e) {

    },
    close: function() {
      _.invoke( this.subViews, 'remove');
    }
  });

  var auditDetails = registerAuditDetails(commonMethods);

  function debug(msg) {
    $('.debug').text(msg);
  }
})();
