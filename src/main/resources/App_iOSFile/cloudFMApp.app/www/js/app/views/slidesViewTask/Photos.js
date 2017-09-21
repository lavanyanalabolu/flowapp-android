App.SlideConstructors.PhotosSlide = baseView.extend({
  __name__:'App.SlideConstructors.PhotosSlide',
  events: {
    "submit form": function (e) {
      e.preventDefault();
      return false;
    },
    "tap .viewPhoto": "viewPhoto",
    "tap .btnAddPhoto": "addPhoto",
    "tap .btnClosePhoto": "closePhoto",
    "tap #btnSelectPhotoFil": function () {
      this.selectPhoto('PHOTOLIBRARY');
    },
    "tap #btnSelectPhoto": function () {
      this.selectPhoto('CAMERA');
    },
    "change #filUpload": "primeDocumentUpload",
    "tap #btnUploadPhoto": "uploadPhotoNew",
    "tap .btnGetImage": "uploadPhoto",
    "change #filUploadPhoto": "photoPreview",
    'tap .btnBackToPhotoList': 'backToPhotoList',
    "tap .btnRefreshPhotos": "reloadPhotos",
    "keypress input": function (e) {
      if (e.which === 13) {
        //cordova.plugins.Keyboard.close();
        //$(e.currentTarget).blur();
      }
    }
  },
  initialize: function () {
    this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/Photos.html']);
  },
  render: function (mode) {
    console.log('givmeconsole')
    var currentPage = this;
    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {
      var headerTmp = $.headerTmp;
      var client = $.parseClient(),
        currentTask = client.currentTask;

      this.renderParams = {
        mode: mode,
        headerTmp: headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        photos: currentTask.photos,
        addPhoto: 0
      };

      var tmp = this.templates.main;

      var pageBody = tmp(this.renderParams);

      this.$el.html(pageBody);

      this.once('idle', this.renderPhotos);

      return this;
    }
  },
  renderFooter: function (taskStarted) {
    console.log('newDocButton')
    taskStarted && window.footerView.footer(this, 'PhotosSlide.html', this.renderParams);
  },

  fileLoaded: null,
  serializeFile: function (file, name) {
    var dfd = $.Deferred();
    var reader = new FileReader();


    reader.onloadend = function () {
      var blob = new Blob([this.result], {
        type: "image/jpeg"
      });
      console.log(blob);
      dfd.resolve(blob);
    };

    reader.readAsArrayBuffer(file);
    return dfd.promise();
  },
  selectPhoto: function (sourceType) {
    //console.log('selectPh', this.$('input#filUploadPhoto'))
    console.log(sourceType);
    var onSuccess = this.photoPreview;
    var _v = this;
    if (!!navigator.camera) {
      navigator.camera.getPicture(
        function (u) {
          console.log(u);
          window.resolveLocalFileSystemURL((sourceType === 'PHOTOLIBRARY' && ['android', 'windows'].indexOf(window.device.platform.toLowerCase()) !== -1 ? 'file://' : '') + u, function (entry) {
            console.log(entry)
            entry.file(function (f) {
              console.log(f);
              //f.type = 'image/jpeg';
              /*_v.fileLoaded = f;
              onSuccess();*/
              $.when(_v.serializeFile(f, f.name)).then(function (fl) {
                fl.name = f.name;
                fl.localURL = f.localURL;
                _v.photoPreview(fl);
              });
            });
          }, function (problemo) {
            console.log('uno problemo file', problemo);
          });
        },
        function (problemo) {
          console.log('uno problemo camera', problemo);
        }, {
          quality: 50,
          sourceType: Camera.PictureSourceType[sourceType],
          destinationType: Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.JPEG,
          correctOrientation: true,
          saveToPhotoAlbum: false
        }
      );
    } else {
      var newinput = $('<input type="file" />');
      newinput.one('change', function (e) {
        console.log(e);
        _v.fileLoaded = e.currentTarget.files[0];
      });
      newinput.trigger('click');
    }
  },
  addPhoto: function () {
    window.routeSlideController.disable();
    var taskGuid = $.getCurrentTaskGuid();
    $('.divPhotoList').hide();
    $('.divAddPhoto').show();
    /*$('.btnAddPhoto').hide();*/
    /*$('#grpSelectPhoto').show();*/
    this.renderParams.addPhoto = 1;
    $('.btnClosePhoto').show();

    this.renderFooter(1);
  },
  closePhoto: function () {
    var taskGuid = $.getCurrentTaskGuid();
    //$('.btnAddPhoto').show();
    //$('.btnClosePhoto').hide();
    //$('#btnUploadPhoto').hide();
    //$('#grpSelectPhoto').hide();
    this.$('.divPhotoList').show();
    this.$('.divAddPhoto').hide();
    this.$('#frmUploadPhoto').formReset();
    this.$('#previewContainer').hide();
    window.routeSlideController.enable();
    this.renderParams.addPhoto = 0;
    this.renderFooter(1);
  },
  selectImage: function () {
    $.serverLog('selectImage');
    this.$el.find('#filUpload').click();
  },
  reloadPhotos: function () {
    $.serverLog('reloadPhotos');
    var client = $.parseClient();
    var taskGuid = $.getCurrentTaskGuid();

    var data = {
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_taskPhotos',
      i: 0,
      j: 0,
      k: 0,
      t: taskGuid,
      p1: {}
    };
    var currentPage = this;
    $.jWorking('Loading Photos ... ', data,
      function (msg) {
        console.log('taskPhotos', msg)
        var myData = JSON.parse(msg.d);
        var client = $.parseClient();

        client.currentTask.photos = myData.data;
        localStorage_a.setItem('client', client);
        currentPage.renderPhotos();
      },
      function (msg) {
        console.log(msg);
        //alert('could not connect to server');
      }
    );
  },
  photoPreview: function (fl) {
    console.log(fl);
    this.fileLoaded = fl;
    $('#imageUploadPreview').attr('src', URL.createObjectURL(fl))
    $('#previewContainer').show()
    //$('#grpSelectPhoto').hide();
    //$('#btnUploadPhoto').show().removeAttr("disabled");
    this.renderParams.addPhoto = 2;
    this.renderFooter(1);
  },
  uploadPhotoNew: function (e) {
    var el = $(e.currentTarget);
    var formData = $('form#frmUploadPhoto').serializeObject();
    $.jSuccess('Initializing ... ');
    var currentView = this;
    var fileInput = this.fileLoaded;
    console.log(this.fileLoaded);
    $.serverLog('fileInput', fileInput);

    if (formData.DOC_Desc != '') {
      el.attr("disabled", true);
      processImage(fileInput, upload);

    } else {
      $.jAlert('Please enter a document description');
      $('#photoDOC_Desc').focus();
    }

    function processImage(file, callback) {
      $.jSuccess('Processing Image [1]');
      var img = new Image();
      var reader = new FileReader();

      if (file instanceof Blob) {
        img.src = URL.createObjectURL(file)
      } else {

        reader.onloadend = function (e) {
          img.src = e.target.result
        }

        reader.readAsDataURL(file)

      }

      img.onload = function () {

        EXIF.getData(filePart(file), function () {
          try {

            $.serverLog('this.exifdata.Orientation');
            shrink(img, this.exifdata.Orientation, callback)
              /*(function(blob) {
                  callback( blob )
              })( $.dataURItoBlob( shrink( img, this.exifdata.Orientation ) ) );*/
          } catch (er) {
            console.log(er)
            $.serverLog(er.message)
          }
        })
      }
    }

    function upload(blob) {
      console.log('uploader')
      $.serverLog('uploading')
      var file = new FormData()

      var valid_extensions = /(.jpg)$/i;
      var fExt = valid_extensions.test(fileInput.name)

      if (!!fExt) {
        file.append("filUpload", blob, fileInput.name)
      } else {
        file.append("filUpload", blob, fileInput.name + '.jpg')
      }

      var formData = $('form#frmUploadPhoto').serializeObject();
      var options = {
        socketPath: 'ftpUploadMobile',
        progressBarId: '#photoUploadProgress',
        file: file,
        formData: _.extend(formData, {
          DOC_Type: 'Photo',
          taskGuid: $.getCurrentTaskGuid(),
          auth: localStorage_a.getItem('token'),
          clientGuid: $.parseClient().clientGuid
        })
      }

      mobileUpload(options, function () {
        $.serverLog('ftpComplete');
        currentView.closePhoto();
        el.attr('disabled', '');
        currentView.reloadPhotos();
        $('.divPhotoListContainer').Lazy({
          interval: 500
        })
      })
    }
    return false;
  },
  toggleFullScreenPhotos: function () {
    if (this.photoFullscreen == 0) {
      this.photoFullscreen = 1;
      $('#divTaskContainer').css('visibility', 'hidden');
      $('#mySwipe').css({
        position: 'fixed',
        top: '85px',
        left: 0
      });

      $('div.divPhotoContainer>img').removeAttr('height').attr('width', '100%');
    } else {
      this.photoFullscreen = 0;
      $('#divTaskContainer').css('visibility', 'visible');
      $('#mySwipe').css({
        position: 'relative',
        top: '',
        left: ''
      });

      $('div.divPhotoContainer>img').removeAttr('width').attr('height', '200px');
    }

  },
  viewPhoto: function (e) {
    //this.swipe.disable()
    window.routeSlideController.disable();

    var imageLink = $(e.currentTarget).data("photo");
    $.getPageHtmlAsync('photoFullView.html', false, function (template) {

      window.footerView.footer(this, 'PhotosSlideAllPhotosBtn.html', {});

      console.log('viewPhoto');
      $('#photoList').hide();
      $('#photoFull').html(template({
        headerTmp: $.headerTmp,
        img: {
          src: imageLink,
          title: ''
        }
      })).show()
    }.bind(this));

  },
  backToPhotoList: function () {
    this.$('#photoList').show();
    this.$('#photoFull').hide();
    //this.swipe.enable()
    window.routeSlideController.enable();

    //$('.btnAddPhoto').show();
    //$('.btnBackToPhotoList').hide();
    if(!$.getStartedTaskStatus($.parseClient())){
      routeSlideController.mainView.trigger('refooter');
    }else{

      this.$('.divPhotoList').show();
      this.$('.divAddPhoto').hide();
      this.$('#frmUploadPhoto').formReset();
      this.$('#previewContainer').hide();
      this.renderParams.addPhoto = 0;
      this.renderFooter(1);
    }
  },
  renderPhotos: function () {
    var tmp = window.App.viewTaskSlides['photoList.html'];
    this.$('.divPhotoListContainer').html(tmp()).Lazy({
      interval: 1000
    });
  }
});
