App.SlideConstructors.SignatureSlide = baseView.extend({
  __name__: 'App.SlideConstructors.SignatureSlide',
  events: {
    "tap .btnGetSignature": "getSignature",
    "tap .btnCancelSignature": "cancelSignature",
    "tap .btnClearSignature": "clearSignature",
    "tap .btnSaveSignature": "saveSignature",
    "change #txtSignatory": "cacheSignatory",
    "focus #txtSignatory": function (e) {
      e.preventDefault();
      //$.serverLog('focus');
      return false
    },
    "keypress #txtSignatory": function (e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        return false
      }
    },
  },
  initialize: function () {
    this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/Signature.html']);
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
        task: currentTask.task
      };

      var tmp = this.templates.main;

      var pageBody = tmp(renderParams);

      this.$el.html(pageBody);

      return this;
    }
  },
  renderFooter: function (taskStarted) {
    this.renderParams.again = !!$.parseClient().currentTask.finishTask.sigData;
    taskStarted && window.footerView.footer(this, 'SignatureSlide.html', this.renderParams);
  },
  getSignature: function () {
    window.footerView.footer(this, 'SignatureTwoSlide.html', this.renderParams);
    //$('#mainSection, #divFooter').css('opacity', 0);
    $('#sigDisplay').hide();
    $('.divSignatory').show();
    window.routeSlideController.disable();
    var wrapper = document.getElementById("signature-pad"),
      /*
                  clearButton = wrapper.querySelector("[data-action=clear]"),
                  saveButton = wrapper.querySelector("[data-action=save]"),*/
      canvas = wrapper.querySelector("canvas"),
      signaturePad;

    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
      var ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
    }

    /*window.onresize = resizeCanvas;*/
    resizeCanvas();

    this.signaturePad = new SignaturePad(canvas);

    //this.signaturePad.clear();

    var currentView = this;

    try {
      var client = $.parseClient();
      var sigData = client.currentTask.finishTask.sigData;
      //this.signaturePad.fromDataURL(sigData);

    } catch (e) {

    }
  },
  clearSignature: function () {
    this.signaturePad.clear();
  },
  cancelSignature: function () {
    //$('#signature-pad, #divTaskCardFooterSig, .divSignatory').hide();
    $('.divSignatory').hide();
    $('#sigDisplay').show();

    window.routeSlideController.enable();
    this.renderFooter(true);
    //window.footerView.footer(this, 'SignatureSlide.html', this.renderParams);
  },
  saveSignature: function () {
    if (!$('#txtSignatory').val() || $('#txtSignatory').val() == '') {
      $.jAlert("Please provide a signatory name.");
      $('#txtSignatory').trigger('tap').focus();
      return false;
    }
    if (this.signaturePad.isEmpty()) {
      $.jAlert("Please provide signature first.");
    } else {
      console.log('this.signaturePad.toDataURL()', this.signaturePad.toDataURL());
      var sigData = this.signaturePad.toDataURL();
      var client = $.parseClient();
      client.currentTask.finishTask.sigData = sigData;
      localStorage_a.setItem('client', client);
      $('img#imgSigData').attr('src', sigData).fadeIn();
      $('btnGetSignature').css('opacity', 0.5);
      this.cancelSignature();
    }
  },
  cacheSignatory: function (event) {
    $.serverLog('change');
    var signatory = $('#txtSignatory').val();
    var client = $.parseClient();
    client.currentTask.finishTask.signatory = signatory;
    localStorage_a.setItem('client', client);
    $('#h4Signatory').html('Signed off by : ' + signatory);
    //        this.renderFinishScreen();
  }
});
