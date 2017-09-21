function registerAssetDetails(commonMethods) {
  return commonMethods.extend({ __name__:'assetDetails',
    //template : 'buildingAssets/details.html',
    //parentContainer : '.assetDetailsPanel',
    initialize: function (p) {
      $.getPageHtmlAsync('buildingAssets/details.html', true, function (tmp) {

        var tmpReg = /(?:<script.*?id\=")(.+?)".*>([.\s\S]*?)(?:<\/script)/g;
        this.templates = {};
        tmp.replace(tmpReg, function (m, $1, $2, i) {
          this.templates[$1] = _.template($2);
          return;
        }.bind(this));
        this.render();
        this.state = 0;
        this.getAssetPhotos();

      }.bind(this));

      this.on('stateChange', this.renderState);
      this.client = $.parseClient();
      $('.asset').hide();

      _.extend(this, {
        assetPhotos: clientCollectionToken(),
        clientGuid: $.parseClient().clientGuid
      }, p);

      routeSlideController.disable();
      $('.assetDetailsPanel').show();
      $('#assetDetails').html(this.$el);

      this.listenTo(this.assetPhotos, 'sync', this.renderPhotos);
      //this.listenTo(this.parentView, 'editAsset', this.editAsset);

    },
    matesquei: function (e) {
      if (!e.target.value) {
        e.currentTarget.previousElementSibling.style.opacity = 0;
      } else {
        e.currentTarget.previousElementSibling.style.opacity = 1;
      }
    },
    events: {
      'tap .backToMain, .cancel': 'backToMain',
      'tap .cancelEdit': 'cancelEdit',
      'tap .addToTask': 'addToTask',
      'tap .btnPhoto': 'selectNewPhoto',
      'tap .uploadRemaining': 'uploadRemaining',
      "input .matesquei": "matesquei",
      "blur .matesquei": "matesquei",
      'tap .updateAsset': "updateAsset",
      "tap .editAsset": "editAsset",
      "change input": function (e) {
        if (!!this.model) {
          console.log('eeee', e.target.name);
          this.model.set(e.target.name, e.target.value);
        }
      }
    },
    editAsset: function () {
      this.state = 1;
    },
    cancelEdit: function(){
      this.state = 0;
    },
    updateAsset: function () {
      this.listenTo(this.model, 'sync', function (d) {
        this.state = 0;
        console.log('odata', d);
      });
      this.model.save({
        auth: localStorage_a.getItem('token'),
        clientGuid: this.client.clientGuid,
        dsName: 'MOBILE_V5_assetDetailsUpdate',
        p1: _.extend(_.omit(this.model.toJSON(), 'photos'), {
          taskGuid: this.client.currentTask.taskGuid
        })
      }, {
        error: function () {
          $.jAlert('Could not update asset');
        },
        deferMessage: 'Updating asset ...'
      });
    },
    render: function (cb) {
      this.$el.html(this.templates.assetDetailsMain(this.serialize()));
      !!cb && cb();
    },
    renderState: function () {
      this.$('.details-inner').html(this.templates['assetDetails'.concat(this.state)](this.serialize()));

      if (this.state === 1) {
        console.log(this.state, 'the state is good', this.$('.matesquei'));
        this.$('.matesquei').trigger('blur');
      }
      this.renderFooter();
    },
    photosRemaining: 0,
    selectNewPhoto: function () {
      var onSuccess = this.photoSuccess.bind(this),
        onFail = this.photoFail.bind(this);
      try {
        var _v = this;
        if (!!navigator.camera) {
          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true,
            saveToPhotoAlbum: true
          });
        } else {
          var newinput = $('<input type="file" />');
          newinput.one('change', function (e) {
            console.log(e);
            var fr = new FileReader();
            fr.onload = function (ee) {
              console.log(ee);
              onSuccess(fr.result, e.currentTarget);
            };
            fr.readAsDataURL(e.currentTarget.files[0]);
          });
          newinput.trigger('click');
        }
      } catch (err) {
        this.delegateEvents();
        $.jAlert(err.message);
      }
    },
    photoSuccess: function (imageURI) {
      console.log(this.assetPhotos, imageURI, 'Photo taken');
      resolveLocalFileSystemURL(imageURI, function(entry) {

        console.log('cdvfile URI: ' + entry.toInternalURL());

        this.assetPhotos.add({
          imageURI:  entry.toInternalURL(),
          submited: false
        }).trigger('sync');

        var photos = _.where(this.assetPhotos.toJSON(), {
          submited: false
        });

        this.model.set('photos', photos);
        this.photosRemaining--;
      }.bind(this));
    },
    uploadRemaining: function () {
      this.submitPhotos(this.model,
        function (error, status) {
          if (error) {
            $.jAlert(error.message || JSON.stringify(error));
            //return;
          }
          this.getAssetPhotos();
        }.bind(this));
    },
    photoFail: function (e) {
      console.log(e);
    },
    serialize: function () {
      return {
        a: this.model.toJSON()
      };
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

      if (pLen < 3) {
        setTimeout($.jAlert.bind(undefined, 'This asset requires ' + r + ' more photo' + (r > 1 ? 's' : '')), 2000);
      }

      $.getPageHtmlAsync(tpl, false, function (template) {
        this.$('.assetDetailsPhotos').html(template({
          clientGuid: this.clientGuid,
          photos: this.assetPhotos.toJSON(),
          r: r
        }));
      }.bind(this));
    },
    addToTask: function (e) {
      $(e.currentTarget).prop('disabled', 'true');
      this.model.save({
        auth: localStorage_a.getItem('token'),
        clientGuid: this.clientGuid,
        dsName: 'MOBILEV5_assetLinkToTask',
        p1: this.model.toJSON()
      }, {
        deferMessage: "Creating note ...",
        error: function(){ $.jAlert('Please retry'); this.renderFooter(); }.bind(this)
      });

      this.listenToOnce(this.model, 'sync', function (m) {
        $.jAlert('Asset note created');
        $.updateTaskInfo('currentAsset', m.get('AS_NAME'));
        this.parentView.renderBody();
        this.back();
      }, this);
    },
    renderFooter: function () {
      window.footerView.footer(this, 'assetDetails' + this.state + '.html', {});
    },
    back: function () {
      routeSlideController.enable();
      $('.assetDetailsPanel').hide();
      $('.asset').show();
      window.footerView.footer(this, 'blank.html', {});
      this.remove();
    }
  });
}
