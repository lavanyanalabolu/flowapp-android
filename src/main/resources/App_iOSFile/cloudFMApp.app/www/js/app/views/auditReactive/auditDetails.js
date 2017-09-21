function registerAuditDetails(commonMethods){
  console.log('auditDetails');
  return commonMethods.extend({ __name__:'auditDetails',
    //template : 'buildingAudits/details.html',
    //parentContainer : '.auditDetailsPanel',
    initialize: function (options) {
      this.template = _.template(this.templates.auditStub);
      this.render();
      //this.on('stateChange', this.renderState);
      _.extend(this, {
        auditPhotos: clientCollectionToken( null, { defaults: { submitted : false } }),
        clientGuid: $.parseClient().clientGuid
      });
      this.model.auditPhotos = this.auditPhotos;
      if(this.model.get('auditScore') === null  ){
        console.log('undefinedScore');
      }
      this.listenTo(this.auditPhotos, 'sync', this.renderPhotos);
      if(!this.auditPhotos.models.length){
        this.getAuditPhotos();
      }
    },
    className: "list-group-item no-pad",
    getSaveable: function(){
      return this.model.getSaveable();
    },
    detailState: 0,
    events: {
      "pan .auditSlider": function(e){
        e.srcEvent.stopSlide = true;
        return false;
      },
      "change .bootstrapSlider": function(e){
        console.log('changer', e);
        this.model.set('auditScore', parseInt(e.target.value));
      },
      "tap .btnAudDeets" : function(){
        var audBody = this.el.querySelector('.audBody'),
            st = audBody.style,
            detailState = this.detailState;

        if(!this.detailState){
            st.transform = st.webkitTransform = 'translate3d(-50%,0,0)';
        }else{
            st.transform = st.webkitTransform = 'translate3d(0,0,0)';
        }

        $(audBody).one('webkitTransitionEnd transitionend', function(e){
          $('.auditNotes', audBody).prop('disabled', !!detailState);
        });

        this.detailState = +!detailState;
      },
      'change .auditNotes' : function(e){ this.model.set('auditNotes', e.target.value); },
      'tap .btnPhoto': 'selectNewPhoto',
      'tap .btnSaveAudit': 'updateAudit'
    },
    updateAudit: function () {
      /*this.listenTo(this.model, 'sync', function (d) {
        this.state = 0;
        console.log('odata', d);
      });*/
      this.uploadRemaining();
      this.model.save({
        auth: localStorage_a.getItem('token'),
        clientGuid: $.parseClient().clientGuid,
        dsName: 'MOBILE_V5_auditDetailsUpdate',
        i: this.model.get('auditId'),
        p1: _.omit(this.model.toJSON(), 'photos')
      }, {
        error: function () {
          $.jAlert('Could not update asset');
        },
        deferMessage: 'Updating asset ...'
      }).done(function(a){
        var c = this.model.collection;
        this.model.set('saved', true);
        c.incompleteAudits();
      }.bind(this));
    },
    getAuditPhotos: function () {
      this.auditPhotos.fetch({
        clientGuid: this.clientGuid,
        auth: localStorage_a.getItem('token'),
        dsName: 'MOBILE_V5_auditDetailPhotos',
        i: this.model.get('auditId')
      }, {
      });
    },
    renderPhotos: function () {
      var tpl = 'auditReactive/auditDetailsPhotos.html',
        pLen = this.auditPhotos.size(),
        r = this.photosRemaining = 3 - pLen;

      /*if (pLen < 3) {
        setTimeout($.jAlert.bind(undefined, 'This audit requires ' + r + ' more photo' + (r > 1 ? 's' : '')), 2000);
      }*/

      $.getPageHtmlAsync(tpl, false, function (template) {
        this.$('.auditDetailsPhotos').html(template({
          clientGuid: this.clientGuid,
          photos: this.auditPhotos.toJSON(),
          r: r
        }));
      }.bind(this));
      this.listenTo(this.model, 'change', this.validationFn);
      this.validationFn();
    },
    afterRender: function(){
      var sliderElement = this.$('input.bootstrapSlider')[0];
      var slider = new Slider(sliderElement, {
        ticks: [0,1,2,3,4,5,6,7,8,9,10],
        ticks_positions: [0,10,20,30,40,50,60,70,80,90,100],
        ticks_labels: ['0','1','2','3','4','5','6','7','8','9','10'],
        tooltip: 'hide',
        value: this.model.get('auditScore') || 0,
        formatter: function(value) {
          return value + '/10';
        }
      });
      setTimeout(slider.relayout.bind(slider));
    },
    validationFn: function(){
      var bool = this.getSaveable();
      if(!bool){
        this.$('.notCompleteWarn').html('Please score work, provide notes and 3 photos');
        this.$('.btnSaveAudit').addClass('disabled');
        this.$('.audHead').addClass('list-group-item-warning');
      }else if(!this.model.get('saved')){
        this.$('.notCompleteWarn').html('Please save this audit');
        this.$('.btnSaveAudit').removeClass('disabled');
      }else{
        this.$('.notCompleteWarn').html('');
        this.$('.btnSaveAudit').removeClass('disabled');
        this.$('.audHead').removeClass('list-group-item-warning');
      }

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
            fr.onload = function(ee){
              console.log(ee);
              onSuccess(fr.result);
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
      console.log(this.auditPhotos, imageURI, 'Photo taken');
      resolveLocalFileSystemURL(imageURI, function(entry) {
        console.log('cdvfile URI: ' + entry.toInternalURL());
        this.auditPhotos.add({
          imageURI:  entry.toInternalURL(),
          submited: false
        }).trigger('sync');
        var photos = _.where(this.auditPhotos.toJSON(), {
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
          this.getAuditPhotos();
        }.bind(this));
    },
    photoFail: function (e) {
      console.log(e);
    }

  });
}
