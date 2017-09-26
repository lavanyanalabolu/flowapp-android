function registerAssetPhotos(commonMethods) {
  return commonMethods.extend({ __name__:'assetPhotos',
    template: 'buildingAssets/assetPhotos.html',
    initialize: function (opt) {
      var _v = this;
      _v.posOb = opt.posOb;
      _v.locWatcher = opt.locWatcher;
      $('#assetPhotos').html(this.$el);
      $('.assetPhotos').show();
      $('.createAsset').hide();
      _.extend(this, {
        client: $.parseClient()
      });
      this.render(function () {
        if (this.model.get('photos').length > 0) {
          this.renderImages();
        }
        this.listenTo(this.model, 'change', function (m) {
          this.renderImages();
          //   debug( ' model changed ' + JSON.stringify( m.toJSON() , null ,  4 ) )
        });
      }.bind(this));
    },
    events: {
      "tap .tPhoto": "takePhoto",
      "tap .submitAsset": 'submitAsset',
      "tap .backToMain": "backToMain"
    },
    takePhoto: function () {
      this.undelegateEvents();

      /*function onSuccess(imageURI) {
        _v.delegateEvents();

        var photos = this.model.get('photos');
        photos.push({
          imageURI: imageURI,
          submited: false
        });

        this.model.set('photos', photos).trigger('change');
      }*/
      function onSuccess(imageURI) {
        _v.delegateEvents();

        //console.log(this.assetPhotos, imageURI, 'Photo taken');
        resolveLocalFileSystemURL(imageURI, function(entry) {
          var photos = this.model.get('photos');
          photos.push({
            imageURI:  entry.toInternalURL(),
            submited: false
          });
          console.log('NEWPHOTO', photos);
          this.model.set('photos', photos ).trigger('change');
        }.bind(this));

      }
      function onFail(message) {
        _v.delegateEvents();
        $.jAlert(message);
      }
      try {
        var _v = this;
        if (!!navigator.camera) {
          navigator.camera.getPicture(onSuccess.bind(this), onFail, {
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
              onSuccess.call(_v, fr.result, e.currentTarget);
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
    serialize: function () {
      return {
        model: this.model.toJSON()
      };
    },
    renderImages: function () {
      var c = 0;
      console.log('renderImages');
      _.each(this.model.get('photos'), function (p) {
        this.$('.p_' + c).html('<img  style="width: 100%;height:100%" src ="' + p.imageURI + (p.imageURI.indexOf('https://') === -1 ? '' : '/150') + '" >');
        c++;
      }, this);
      if (this.model.get('photos').length == 3) {
        this.$('.submitAssetBtn').show();
      }
    },
    submitAsset: function () {
      var that = this;
      this.$('.submitAssetBtn').addClass('disabled');
      try {
        navigator.geolocation.clearWatch(this.locWatcher);
      } catch (err) {
        console.log(err);
      }
      try {

        _.each(this.posOb, function (arr, k) {
          if (typeof arr !== 'number') {
            var l = arr.array.length;
            if (l > 8) {
              for (var i = l; i--; arr.array.length > Math.round((l / 100) * 80)) {
                if (i > Math.round((l / 100) * 90)) {
                  arr.array.pop();
                }
                if (i < Math.round((l / 100) * 10)) {
                  arr.array.shift();
                }
              }
            }
            that.posOb[k] = _.reduce(arr.array, function (m, n) {
              return parseFloat(m) + parseFloat(n);
            }, 0) / arr.array.length;
          }
        });
      } catch (e) {
        $.jAlert('location error');
        console.log(e);
        return;
      }
      async.waterfall([
        function submitAsset(callback) {
          //$.jSuccess('Submiting assset')
          that.model.save({
            auth: localStorage_a.getItem('token'),
            clientGuid: that.client.clientGuid,
            dsName: 'MOBILE_V5_assetTagCreate',
            p1: _.extend(_.omit(that.model.toJSON(), 'photos'), that.posOb, {
              taskGuid: that.client.currentTask.taskGuid
            })
          }, {
            error: function (xhr, statusTxt, thrown) {
              return callback('error', null);
            },
            deferMessage: 'Submiting assset ...'
          })
          that.listenToOnce(that.model, 'sync', function (model) {
            //alert(JSON.stringify(model))
            that.posOb = null;
            return callback(null, model);
          })
        },
        that.submitPhotos.bind(that)
      ], function (error, status) {
        console.log('this is the callback')
        if (error) {
          $.jAlert(error.message || JSON.stringify(error));
          //return;
        }
        console.log('getAssetList');
        that.collection.getAssetList(true);
        that.confirm();

      });
    },
    confirm: function () {
      $.getPageHtmlAsync('buildingAssets/confirm.html', false, function (tmp) {
        this.$el.html(tmp({
          model: this.model.toJSON()
        }));
      }.bind(this));
    },
    close: function () {
      this.remove();
      $('.assetPhotos').hide();
    }
  });
}
