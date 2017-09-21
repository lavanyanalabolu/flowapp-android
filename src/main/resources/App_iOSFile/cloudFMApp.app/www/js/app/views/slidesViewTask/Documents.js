App.SlideConstructors.DocumentsSlide = baseView.extend({ __name__:'App.SlideConstructors.DocumentsSlide',
  initialize: function () {
    this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/Documents.html']);
  },
  events: {
    "submit form": function (e) {
      e.preventDefault();
      return false;
    },
    "tap .viewDoc": "viewDocument",
    "tap .btnAddDocument": "addDocument",
    "change #filUpload": "documentPreview",

    "tap .btnCloseDocument": "closeDocument",
    "tap #btnUploadDocument": "uploadDocument",
    "tap .btnDocType": "selectDocType",
    'tap .docFullView': 'viewDocument',
    'tap .btnBackToDocList': 'backToDocList',

    'tap .completeRA': function (e) {
      $('.completeRA').addClass('disabled');
      var _v = this;
      $.updateTaskInfo('RR', {
        comments: $.parseClient().currentTask.RR.comments + '-- RAM(s) uploaded --'
      });
      routeSlideController.mainView.trigger('finishRiskAssessment');

    },
    "keypress input": function (e) {
      if (e.which === 13) {
        cordova.plugins.Keyboard.close();
        //$(e.currentTarget).blur();
      }
    }
  },
  render: function (mode) {
    var currentPage = this;
    if (!localStorage_a.getItem('client')) {
      window.location = '#setClient';
    } else {
      var headerTmp = $.headerTmp;
      var client = $.parseClient(),
        currentTask = client.currentTask;

      var renderParams = this.renderParams = {
        mode: mode,
        headerTmp: headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        documents: currentTask.documents,
        addDocument: 0,
        ramText: !!currentTask.riskAssessment && !currentTask.RR.riskStatus
      };

      var tmp = this.templates.main;

      var pageBody = tmp(renderParams);

      this.$el.html(pageBody);

      this.once('idle', this.renderDocuments);

      return this;
    }
  },
  renderFooter: function (taskStarted) {
    taskStarted && window.footerView.footer(this, 'DocumentsSlide.html', this.renderParams);
  },
  selectDocType: function (e) {
    var selectedDocType = e.currentTarget.id;
    $('#hidDocType').val(selectedDocType);
    console.log(selectedDocType);
    $('.btnDocType').removeClass('btn-primary');
    $(e.currentTarget).addClass('btn-primary');

    console.log('input', $('#hidDocType').val());

  },
  addDocument: function () {
    console.log('addDocument');
    /*footerView.$('.divAddDocument').show();
    footerView.$('.btnAddDocument').hide();
    footerView.$('#btnSelectDoc').show();*/

    this.renderParams.addDocument = 1;
    this.renderFooter(1);

    this.$('.divAddDocument2').show();
    this.$('.documentList').hide();
    window.routeSlideController.disable();
    var currentTask = $.parseClient().currentTask;

    if (!!currentTask.riskAssessment && currentTask.RR.riskStatus !== 4) {
      $('#hidDocType').val('RAMS');
      $('.btnDocType').removeClass('btn-primary').addClass('disabled');
      $('#uploadRAMS').addClass('btn-primary').removeClass('disabled');
    }
    $('#btnUploadDocument').removeAttr('disabled');
  },
  closeDocument: function () {
    //console.log(this.pdfView, 'PDFVIEW');
    PDFViewerApplication.close();

    this.$('#docFull').empty();
    this.selectedFile = null;
    this.$('.divAddDocument').hide();
    this.$('.btnAddDocument').show();
    /*$('#btnUploadDocument').hide();
    $('#btnSelectDoc').hide();*/
    this.$('.btnSelectDoc').removeClass('primary');
    this.$('#btnUploadDocument').hide();
    this.$('#frmUpload').formReset();
    this.$('.documentList').show();
    this.$('.divAddDocument2').hide();
    this.$('#documentPreviewContainer').hide();

    this.renderParams.addDocument = 0;

    if(!$.getStartedTaskStatus($.parseClient())){
      routeSlideController.mainView.trigger('refooter');
    }else{
      this.renderFooter(1);
    }

    window.routeSlideController.enable();

  },

  viewDocument: function (e) {
    console.log('viewDocument');
    window.routeSlideController.disable();

    var docPath = $(e.currentTarget).attr('data-docPath');

    $.getPageHtmlAsync('photoFullView.html', false, function (template) {

      window.footerView.footer(this, 'DocumentsSlideAllDocsBtn.html',{});
      var pathar = docPath.split('/');

      this.$('.documentList').hide();

      if (['PDF','DOCX','DOC'].indexOf(pathar[pathar.length - 1]) !== -1) {
        pathar[3] = 'download2';

        var docFull = document.getElementById('docFull');

        docFull.style.display = 'block';

        this.pdfView(pathar.join('/'),docFull);

      } else {
        console.log($('#docFull'));

        $('#docFull').html(template({
          headerTmp: $.headerTmp,
          img: {
            src: docPath,
            title: ''
          }
        })).show();
      }



    }.bind(this));


  },
  pdfView: function(params, el){
    el.innerHTML = window.App.viewTaskSlides['pdfViewer/main.html']({});
    PDFViewerApplication.initUI(el);
    if(params.target){
      PDFViewerApplication.webViewerFileInputChange(params);
    }else{
      PDFViewerApplication.open(params);
    }
  },
  documentPreview: function (e, other) {
    console.log(other);
    $('#documentUploadPreviewDiv').hide();
    $('#documentUploadPreview').hide();
    $('#documentPreviewContainer').show();

    this.selectedFile = e.target.files[0];
    this.renderParams.addDocument = 2;
    this.renderFooter(1);

    var type = this.selectedFile.type.split('/').pop();

    // console.log('HIHIHIHIHIHIHIHIHIHIHIHIIHIHIHIHIHIHIHIHIHIHHIHIHHI');
    // console.log('selectedFile-----------------------------------------', type, this.selectedFile);

    if(['PDF','DOCX','DOC'].indexOf(type.toUpperCase()) !== -1){

      this.$('#documentUploadPreviewDiv').show();
      this.$('#documentUploadPreviewDiv').html('Selected file: ' + this.selectedFile.name);

      if(type.toUpperCase() === "PDF"){

        console.log(this.selectedFile);
        if(this.selectedFile){
          this.pdfView(e,this.$('#documentUploadPreviewDiv')[0]);
        }else{
          this.$('#documentUploadPreviewDiv')[0].innerHTML += ' (no preview available)';
        }
        window.footerView.$('#btnUploadDocument').removeClass('disabled');

        return;
      }else{
        this.$('#documentUploadPreviewDiv')[0].innerHTML += ' (no preview available)';
      }
    } else {
      $('#documentUploadPreview').show();
      $('#documentUploadPreview').attr('src', URL.createObjectURL(this.selectedFile));
    }
    window.footerView.$('#btnUploadDocument').removeClass('disabled');
  },
  backToDocList: function () {
    window.routeSlideController.enable();
    $('.documentList').show();
    $('#docFull').hide();
    this.closeDocument();
    /*$('.btnAddDocument').show();
    $('.btnBackToDocList').hide();*/
  },
  reloadDocuments: function () {
    var client = $.parseClient();
    var taskGuid = $.getCurrentTaskGuid();
    var data = {
      clientGuid: $.parseClient().clientGuid,
      auth: localStorage_a.getItem('token'),
      dsName: 'MOBILE_V5_documentList',
      i: 0,
      j: 0,
      k: 0,
      t: taskGuid,
      p1: {}
    };
    var currentPage = this;
    $.jWorking('Loading Documents ... ', data,
      function (msg) {
        console.log(msg);
        var myData = JSON.parse(msg.d);
        var client = $.parseClient();

        client.currentTask.documents = myData.data;
        localStorage_a.setItem('client', client);
        currentPage.renderDocuments();
      },
      function (msg) {
        console.log(msg);
        //alert('could not connect to server');
      }
    );
  },

  uploadDocument: function (e) {
    try {
      var el = $(e.currentTarget);
      var fileInput = this.selectedFile;

      var file = new FormData();

      file.append("filUpload", fileInput, fileInput.name);

      var formData = $('form#frmUpload').serializeObject();

      if (formData.DOC_Type === '') {
        $.jAlert('Please select a document type');
        return;
      }

      if (formData.DOC_Desc !== '') {
        el.attr("disabled", true);
        var options = {
          socketPath: 'ftpUploadMobile',
          progresBarId: '#documentUploadProgress',
          file: file,
          formData: _.extend(formData, {
            taskGuid: $.getCurrentTaskGuid(),
            auth: localStorage_a.getItem('token'),
            clientGuid: $.parseClient().clientGuid
          })
        };
        mobileUpload(options, function () {
          if (formData.DOC_Type == 'RAMS') {
            $.updateTaskInfo('RAMUpload', true);
            routeSlideController.mainView.trigger('RAMLo');
          }
          if (formData.DOC_Type == 'Quote') {
            $.updateTaskInfo('quoteUpload', true);
          }
          el.attr('disabled', '');

          this.closeDocument();
          this.reloadDocuments();

          window.routeSlideController.enable();

          $('.divDocumentListContainer').Lazy({
            interval: 500
          });

        }.bind(this));

      } else {
        $.jAlert('Please enter a document description');
        $('#DOC_Desc').focus();
      }
    } catch (error) {
      console.log('err', error);
      $.serverLog('err', error);
    }
    return false;
  },
  renderDocuments: function () {
    var tmp = window.App.viewTaskSlides['documentList.html'];
    this.$('.divDocumentListContainer').html(tmp(this.renderParams)).Lazy({
      interval: 1000
    });
  }
});
