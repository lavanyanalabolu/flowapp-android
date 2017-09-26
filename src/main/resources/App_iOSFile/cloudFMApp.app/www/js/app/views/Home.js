var bbQRScanPromptView = null;
var bbAvatarPromptView = null;
window.viewConstructors.HomeView = Backbone.View.extend({
  __name__:'window.viewConstructors.HomeView',
  el: '#nebulousContainer',
  avaInit: undefined,
  ftpUpload: $.Deferred(),
  initialize: function () {
    var _this = this;
    this.inactive = false;
    var client = $.parseClient() || {},
      renderParams = {
        avaSrc: serverPath + '/avatar/' + $.getAppPermissionByName('avatarGuid'),
        homeStatus: 'default',
        client: client,
        clientName: !!client ? client.clientName : ''
      };

    //if (client) {

      if (client.buildingCheckIn) {
        renderParams.buildingName = client.buildingCheckIn.buildingName;
      } else {
        renderParams.buildingName = '';
      }

      renderParams.onSite = $.getOnSiteStatus(client);

      renderParams.startedTask = $.getStartedTaskStatus(client);

      if (renderParams.onSite == 1) {
        renderParams.homeStatus = 'onSite';
      }
      if (renderParams.startedTask == 1) {
        renderParams.homeStatus = 'startedTask';
      }

      this.permCheck = JSON.stringify(localStorage_a.getItem('appPermissions'));
      this.availableClients();
      this.renderParams = renderParams;
      this.render();

    // } else {
    //     window.location = '#setClient';
    // }
  },
  availableClients: function(){
    if(!localStorage_a.getItem('clients')){
      var data = {
        auth: localStorage_a.getItem('token'),
        dsName: 'CIRRUSMODE_availableClients',
        i: 0,
        j: 0,
        k: 0,
        t: '',
        p1: {}
      };
      $.jAdminWorking('Downloading Available Clients', data,
        function (msg) {
          var myData = JSON.parse(msg.d);
          localStorage_a.setItem('clients', myData.data);
        },
        function (error) {}
      );
    }
  },
  render: function () {
    var _this = this;

    $.getPageHtmlAsync(['home.html', 'privacyPolicy.html', 'svgVehicle.html'], true, function (tmp) {
      var renderParams = this.renderParams;
      console.log('tmps', tmp);
      renderParams.vehicleSvg = tmp['svgVehicle.html'];

      this.eula = _.template(tmp['privacyPolicy.html']);
      !this.inactive && window.footerView.footer(this, 'home.html.' + renderParams.homeStatus, renderParams);

      if (!localStorage_a.getItem('appPermissions')) {
        $.loadPermissions(
          function () {
            var client = $.parseClient(),
              p = {
                avaSrc: serverPath + '/avatar/' + $.getAppPermissionByName('avatarGuid'),
                homeStatus: 'default',
                client: client,
                clientName: !!client ? client.clientName : ''
              };
            _this.$el.html(_.template(tmp['home.html'])(p));
            _this.checkPrivacy(_.template(tmp['privacyPolicy.html']));
            return _this;
          },
          function () {
            //window.location.reload();
          },
          function (v) {
            if (renderParams.startedTask != 1 && parseInt(v.versionID) > parseInt(localStorage_a.getItem('version').versionID && v.releaseTier === 'v')) {
              _this.updateNag(v);
            }
          }
        );
      } else {
        _this.$el.html(_.template(tmp['home.html'])(renderParams));
        _this.checkPrivacy(_.template(tmp['privacyPolicy.html']));

        $.loadPermissions(function () {
            if ($.getAppPermissionByName('avatarGuid').length < 16) {
              this.avatarPrompt();
            }
            console.log('permCheck', this.permCheck, JSON.stringify(localStorage_a.getItem('appPermissions')));
            if (JSON.stringify(localStorage_a.getItem('appPermissions')) !== this.permCheck) {
              this.render();
              this.permCheck = JSON.stringify(localStorage_a.getItem('appPermissions'));
            }
          }.bind(_this),
          function () {
            //window.location.reload();
          },
          function (v) {
            if (_this.renderParams.startedTask != 1){
              if (parseInt(v.versionID) > parseInt(localStorage_a.getItem('version').versionID && v.releaseTier === 'v')) {
                _this.updateNag(v);
              }
            }
          });

        return this;
      }

    }.bind(this));

  },
  updateNag: function (v) {
    var pc = this.pc = this.pc || $('<div id="promptContainer"></div>');

    pc.detach();
    $(".xpanel").append(pc);

    $.getPageHtmlAsync('updatePrompt.html', false, function (tmp) {
      pc.html(tmp(v));
      $('.overlay', pc).fadeIn();
      //window.footerView.footer(this, 'updatePrompt.html', {});
    }.bind(this));
  },
  checkPrivacy: function (tmp) {
    if (window.device.platform !== 'browser') {
      var pathToFile = (cordova.file.applicationStorageDirectory || '') + 'Documents/' + localStorage_a.getItem('version').versionID + 'termsAgreed.txt';

      var errorHandler = function (err) {
        (new window.viewConstructors.PrivacyPolicy()).render(tmp);
        console.log(JSON.stringify(err), 'What?');
        console.log(pathToFile);
      };
      var readFile = function (file) {
        console.log('success', JSON.stringify(file));

      };
      window.resolveLocalFileSystemURL(pathToFile, readFile, errorHandler);
    }

  },
  events: {
    "tap #btnUpdateApp": "updateClient",
    "tap #btnSetClient": "setClient",
    "tap #btnListQR": "listQR",
    "tap .btnScanQR": "scanQR",
    "tap .btnRemoteScanOut": "remoteScanOut",
    "tap .btnMenu": "showMenu",
    "tap .btnChangeClient": "changeClient",
    "tap .btnExitMenu": "hideMenu",
    "tap .btnTimesheet": "timeSheets",
    "tap .btnAllocation": "allocation",
    "tap .btnAvatar": "avatarPrompt",
    "tap #btnTelCheckIn": "telCheckIn",
    "tap #btnHelp": "renderHelp",
    "tap .removePrompt": function () {
      this.$('#promptContainer').remove();
    },
    "tap #btnPMV": function () {
      cordova.InAppBrowser.open('http://cloudfmgroup.com/pmv-videos/', '_blank', 'location=yes');
    },
    "tap #btnSendErrorLog": function () {
      $.errorLogging.mailLogs();
    }
  },
  debugCodes: function (e) {
    var _v = this;
    _v.aggregatedCode = _v.aggregatedCode || '';
    _v.aggregatedCode += String.fromCharCode(e.which);
    if (_v.aggregatedCode == 'testplaque') {
      _v.aggregatedCode = '';
      var qrp = prompt('testQR?');
      if (qrp !== null) {
        _v.QRtest({
          format: 'QR_CODE',
          cancelled: 0,
          text: 'http://qrcloud.co.uk?c=demo123f4219c46-042f-4780-8a37-4af2b9c1f907'
        });
      }
    }
    if (_v.aggregatedCode === 'eula') {
      (new window.viewConstructors.PrivacyPolicy()).render(this.eula);
    }
    if (_v.aggregatedCode.indexOf('ddd') !== -1) {
      _v.aggregatedCode = '';
    }!!_v.timeOutholder && clearTimeout(_v.timeOutholder);
    _v.timeOutholder = setTimeout(function () {
      console.log('clearDegbug');
      _v.aggregatedCode = '';
    }, 4000)
  },

  resetAvaProgresBar: function () {
    window.setTimeout(function () {
      $('#avatarUploadProgress').hide();
    }, 800);
  },

  avatarPrompt: function (e) {
    var pc = this.pc = this.pc || $('<div id="promptContainer"></div>');

    pc.detach();
    $(".xpanel").append(pc);

    window.viewConstructors.avatarPromptView = window.viewConstructors.HomeView.extend({ __name__:'window.viewConstructors.avatarPromptView',
      el: pc,
      initialize: function () {
        $.getPageHtmlAsync('avatarPrompt.html', false, function (tmp) {
          console.log(this.$el);
          this.$el.html(tmp());
          this.$('.overlay').fadeIn();
          window.footerView.footer(this, 'avatarPrompt.html', {});

        }.bind(this));
        return this;
      },
      render: function(){

      },
      events: {
        "tap .btnAvatarCancel": "avatarCancel",
        "tap .btnAvatarGet": "avatarGetNew"
      },
      /*cleanup: function () {
        $(this.el).empty();
        this.$el.replaceWith(this.$el.clone(false));
        this.undelegateEvents();
        this.remove();

      }*/
    });
    vievManager.loadView('avatarPromptView');
    this.avaInit = $('.overlay').html()
  },
  avatarCancel: function (e) {
    vievManager.close('avatarPromptView');
    $('.overlay').hide();
    $('.imgBox').remove('#succOverlay');
    $('.overlay').html(this.avaInit);
    window.footerView.footer(window.vievManager.views.HomeView, 'home.html.' + window.vievManager.views.HomeView.renderParams.homeStatus, window.vievManager.views.HomeView.renderParams);
  },
  succOverlay: $(document.createElement('div')).attr({
    id: 'succOverlay',
  }).css({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px',
    'z-index': 9999,
    'background-color': 'rgba(255,255,255,0.6)',
    padding: '10px',
    display: 'table'
  }),
  avatarGetNew: function (e) {
    try {
      var currentView = this;
      var el = $('#avatarUpload');
      el.click();
      el.change(function () {
        var fileInput = el[0].files[0];
        processImage(fileInput, upload);

        function processImage(file, callback) {
          $.jSuccess('Processing Image [1]');
          var img = new Image();
          var reader = new FileReader();
          reader.onloadend = function (e) {
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);

          img.onload = function () {
            EXIF.getData(filePart(file), function () {
              (function (blob) {
                callback(blob);
              })($.dataURItoBlob(shrink(img, this.exifdata.Orientation)));
            });
          };
        }

        function upload(blob) {
          var file = new FormData();
          var valid_extensions = /(.jpg)$/i;
          var fExt = valid_extensions.test(fileInput.name);
          if (!!fExt) {
            file.append("filUpload", blob, fileInput.name);
          } else {
            file.append("filUpload", blob, fileInput.name + '.jpg');
          }
          var options = {
            socketPath: 'avatarUpload',
            progressBarId: '#photoUploadProgress',
            file: file,
            formData: {
              auth: localStorage_a.getItem('token'),
            }
          };
          mobileUpload(options, function (res) {
            $('.theImg').css({
              'background-image': 'url(' + serverPath + '/avatar/' + res.avatarGuid + ')',
              'background-size': 'cover',
              'background-repeat': 'no-repeat'
            }).show();
            $('.btnAvatarGet').hide();
            var status = 'Your picture has been uploaded and will appear when approved';
            $('.imgBox').append(currentView.succOverlay
              .html('<div style="vertical-align: middle; display:table-cell;">\
                            <div class="btn btn-primary" style="max-width:90%">\
                                <h3 style="word-wrap:normal; white-space:normal; margin-bottom:20px" >Success!<br/>' + status + '</h3>\
                            </div>\
                        </div>'));
          });
        }
      });
    } catch (e) {
      $.serverLog('booo', e.message, e.stack);
    }
  },
  avatarGet: function (event) {
    var currentView = this;

    function beforeSendHandler(e) {
      $('#avatarUploadProgress').fadeIn();
    }

    function completeHandler(e) {
      var data = e;
      socket.emit('avatarImageRC', e);
      socket.on('avatarImageDone', function (src) {
        $('.theImg').css({
          'background-image': 'url(' + serverPath + '/tmp/' + src + ')',
          'background-size': 'cover',
          'background-repeat': 'no-repeat'
        }).show();
        /*$('.theImg').attr('src', serverPath+'/tmp/'+src);*/
        $('#button-bar').css('top', parseInt(windowHeight) - 320 + 'px');
        currentView.resetAvaProgresBar();
        $('.btnAvatarUpload').on('click', function (ev) {
          beginFtp(e);
          //$.serverLog('avaClick');

        }).removeClass('btn-default').addClass('btn-success');
      });
    }

    function beginFtp(e) {
      var data = e;
      var formData = {};

      formData.auth = localStorage_a.getItem('token');

      _.extend(data, formData)

      socket.emit('ftpUploadAvatarMobile', data);

      currentView.ftpUpload.done(function (d) {
        $('.imgBox').append(currentView.succOverlay
          .html('<div style="vertical-align: middle; display:table-cell;">\
                        <div class="btn btn-primary" style="max-width:90%">\
                            <h3 style="word-wrap:normal; white-space:normal; margin-bottom:20px" >Success!<br/>' + d.status + '</h3>\
                        </div>\
                    </div>')
        );
        $('.btnAvatarUpload').hide();
        $('#button-bar').hide();
        $('.btnAvatarCancel').html('close');
      });
      currentView.resetAvaProgresBar();
    }

    function errorHandler(e) {
      $('#prgUploader').show();
      console.log('error uploading');
      console.log(e);
    }

    function progressHandlingFunction(e) {
      var p = parseInt((e.loaded / e.total) * 100);
      $('#avUploadProgress').css('width', p + '%').attr('aria-valuenow', e.loaded).attr('aria-valuemax', e.total).text('Preparing file for upload ' + p + ' %');
    }

    var currentPage = this;
    var mode = $(event.currentTarget).attr('data-mode');
    var src = navigator.camera.PictureSourceType.PHOTOLIBRARY;
    switch (mode) {
    case 'camera':
      src = navigator.camera.PictureSourceType.CAMERA;
      break;
    case 'library':
      src = navigator.camera.PictureSourceType.PHOTOLIBRARY;
      break;
    default:
      src = navigator.camera.PictureSourceType.PHOTOLIBRARY;
      break;
    }
    navigator.camera.getPicture(successImage, failImage, {
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      sourceType: src,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      cameraDirection: 1
    });

    function successImage(imageData) {

      var file = window.resolveLocalFileSystemURI(imageData, function (fileEntry) {
        function readErr() {}
        fileEntry.file(function (file) {
          var formData = new FormData();
          var reader = new FileReader();

          reader.readAsDataURL(file);
          reader.onloadend = function (evt) {

            $.shrink(reader.result, formData, imageData.split("/").pop(), function (foDa) {
              uplFile(foDa);
            });
          };



        }, readErr);
      });

      function uplFile(formData) {
        $.ajax({
          url: serverPath + '/upload', //Server script to process data
          type: 'POST',
          xhr: function () { // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) { // Check if upload property exists
              myXhr.upload.addEventListener('progress', progressHandlingFunction, true); // For handling the progress of the upload
            }
            return myXhr;
          },
          //Ajax events
          beforeSend: beforeSendHandler,
          success: completeHandler,
          error: errorHandler,
          // Form data
          data: formData,
          cache: false,
          contentType: false,
          processData: false
        });
      }
    }

    function failImage(message) {}

  },

  // end avatar
  allocation: function () {
    window.location = '#allocation';
  },
  timeSheets: function () {
    window.location = '#timesheets';
  },
  renderHelp: function () {
    $.getPageHtmlAsync('helpMenu.html', false, function (menuTmp) {
      this.$el.html(menuTmp());
      window.footerView.footer(this, 'home.html.case0', {});
    }.bind(this));
  },
  showMenu: function () {
    $.getPageHtmlAsync('mainMenu.html', false, function (menuTmp) {
      this.$el.html(menuTmp({
        errorLogging: $.getAppPermission('errorLogging') !== 0
      }));
      window.footerView.footer(this, 'home.html.case0', {});
    }.bind(this));
  },
  hideMenu: function () {
    this.render()
    window.footerView.footer(this, 'home.html.' + this.renderParams.homeStatus, this.renderParams);
  },
  changeClient: function () {
    window.location = '#setClient2';
    this.cleanup();
  },
  updateClient: function () {
    updateApp(1);
  },
  cleanup: function () {
    this.undelegateEvents();
    $(document).off('keypress')
    $(this.el).empty();
  },
  setClient: function () {
    window.location = '#setClient2';
  },
  listQR: function () {
    window.location = '#listQR';
    return (false);
  },
  telCheckIn: function () {
    window.location = '#telCheckIn';
    return (false);
  },
  options: function () {},
  remoteScanOut: function () {
    console.log('hi')
    var client = $.parseClient();
    var qrCode = client.buildingCheckIn.qrCode;
    window.location = '#qrScan/' + qrCode;
  },
  QRtest: function (result) {
    $.scanSuccess(result);
  },
  scanQR: function (event) {
    this.undelegateEvents();
    var _v = this;
    try {
      var inBrowser = !window.cordova; //document.URL.indexOf( 'http://' ) !== -1 || document.URL.indexOf( 'https://' ) !== -1;

      /*function .bind(this)*/

      if (inBrowser) {
        console.log('locationing')
        window.location = "#htmlQRScan";
      } else {
        var scanner = window.cordova.plugins.barcodeScanner || window.cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan(
          function (result) {
            _v.delegateEvents();
            if(result.cancelled) return false;
            $.scanSuccess(result);
          },
          function (error) {
            _v.delegateEvents();
            console.log(error);
          }
        );
      }

    } catch (err) {
      $.jAlert(err.message)
      _v.delegateEvents();
    }
  },

  openModal: function () {
    $('#modal').plainModal({
      //offset: {left: 300, top: 100},
      duration: 500,
      effect: {
        open: function (duration, complete) {
          this.css({
              display: 'block',
              marginTop: -1000
            })
            .animate({
              marginTop: -200
            }, duration, complete);
        },
        close: function (duration, complete) {
          this.animate({
            marginTop: -1000
          }, duration, function () {
            $(this).css({
              display: 'none'
            });
            complete();
          });
        }
      }
    });

    $('#modal').plainModal('open');
  }

});
