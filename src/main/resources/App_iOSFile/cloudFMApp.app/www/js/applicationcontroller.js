(function(){

    $(document).on('touchmove', function(e) {
        if (!$(e.target).parents('.scroll')[0]) {
            e.preventDefault();
        }
    });

  if (navigator.userAgent.match(/iphone|ipad|ipod/i) && parseInt(navigator.appVersion.match(/OS (\d{1,2})/)[1], 10) >= 7) {
    window.iosStatusBarHeight = 20;
  } else {
    window.iosStatusBarHeight = 0;
  }

	if(!$('#windowProps').length){
		$("head").append("<style id='windowProps'></style>");
	}
	var w = $(window).height()-50;
	var h = $(window).width();
	window.windowHeight = w;
  window.actualWindowHeight = $(window).height();
	window.windowWidth = h;

  window.mainSectionTop = 50 + parseInt(iosStatusBarHeight);
  window.footerSectionHeight = 50;
  window.mainSectionHeight = windowHeight - footerSectionHeight;
  window.footerSectionTop = 50 + mainSectionHeight;

  window.sectionBodyHeight = mainSectionHeight - 78 - window.iosStatusBarHeight;

  window.sectionBodyOuterWidth = windowWidth - 40;
  window.sectionBodyInnerWidth = sectionBodyOuterWidth - 20;
  window.subSectionBodyInnerWidth = sectionBodyOuterWidth - 14;

  window.sectionWidth = windowWidth-170;


  /*function setKeyboardPos(tarId) {

    //programmatically: set scroll pos so keyboard aligns perfectly underneath textfield
    var elVerticalDistance = $("#" + tarId).offset()["top"];
    var keyboardHeight = 157;

    if (isNativeApp()) {
      keyboardHeight = 261;
    } //I choose to change the keyboard height for the sake of simplicity. Obviously, this value does not correnspond to the actual height of the keyboard but it does the trick
    var keyboardTextfieldPadding = 2;
    var heightOfView = document.height;
    var inputHeight = $("#" + tarId).outerHeight();

    var viewPortSpace = heightOfView - keyboardHeight - keyboardTextfieldPadding; //180
    var verticalNewSroll = (elVerticalDistance + inputHeight) - viewPortSpace;
    if (verticalNewSroll < 0) {
      verticalNewSroll = 0;
    }
    ////

    //OK, all done lets go ahead with some actions
    $("#mainFooter").hide(); //hide footer so that the keyboard doesn't push it on top of textfield
    $("#nebulousContainer").css("bottom", "0px"); //remove bottom space for footer
    window.scrollTo(0, verticalNewSroll); // perform scroll!

  }*/

  /*function isNativeApp() {

    var app = (document.URL.indexOf('http://') === -1) && (document.URL.indexOf('https://') === -1);
    if (app) {
      return true; // PhoneGap native application
    } else {
      return false; // Web app / safari
    }

  }*/

  window.addEventListener('native.keyboardshow', function(e) {
    console.log('focusIn');
    $('body').height((actualWindowHeight - e.keyboardHeight)+'px');
    $("#mainFooter").hide();
  });

  window.addEventListener('native.keyboardhide', function(){
    console.log('blur');
    $('body').height((actualWindowHeight)+'px');
    $("#mainFooter").show();
  });

	function setWindowWidth() {
    var windowHeight = $(window).height() - 50;
    var windowWidth = $(window).width();
    window.windowHeight = windowHeight;
    window.windowWidth = windowWidth;
    $('#windowProps').html(
      ['#myDavid > .section { width: ', windowWidth, 'px }',
        'body > nav { padding-top: ', iosStatusBarHeight, 'px }'
        /*, 'body > .nebulousContainer { min-height: ' , sectionBodyHeight - 50 , 'px }'*/
      ].join('')
    );
  }
  setWindowWidth();

	$(window).on( 'resize', setWindowWidth );
	//$('body').children().first().attr('style', 'padding-top: ' + iosStatusBarHeight + 'px');
	//$('body').children().get(1).css('min-height', $('body').children().get(1).height() - 40 + 'px');

	window.App.routerInstance = new window.App.Router();

	window.App.goBack = function() {

		var hashes = localStorage_a.getItem('hashChain'),
			currenthash = localStorage_a.getItem('currentURL');
		console.log(hashes);
		if(hashes.length>1 && currenthash !== hashes[hashes.length-3]){
			window.App.routerInstance.navigate(hashes[hashes.length-2]||"#home", {trigger:true});
		}else{
			window.location = '#home';
		}
		//return(false);
	};
})();

APP.applicationController = (function() {
    "use strict";

    console.log('APP START');

    window.App.vChecker = {
        locked : false,
        cTimeout: null,
        checkVersion: function(callback){
            //console.log(this, 'this should be an obj')
			var userName;
            if(localStorage_a.getItem('userName'))
                userName = localStorage_a.getItem('userName');
            else {
                userName = 'USER AT LOGIN SCREEN';
            }

            try{
				var currentVersion = localStorage_a.getItem('version');
            } catch(e){
                var currentVersion = {
                    versionID:0,
                    majorRelease:0,
                    minorRelease:0
                };
            }
            if(!this.locked && !!$.loadPermissions){
                $.loadPermissions(callback || function(){}, callback || function(){});
            }else{
                !!callback && callback();
            }
        }
    };

    var checkVersion = window.App.vChecker.checkVersion.bind(window.App.vChecker);

    function start(resources, storeResources) {
		$.getPageHtmlAsync([
			'slideHeaders.html',
			'footerController.html',
			'viewTaskSlides/TaskInformation.html',
			'viewTaskSlides/BuildingDetails.html',
			'viewTaskSlides/RiskAssessment.html',
			'viewTaskSlides/RamsDocuments.html',
			'viewTaskSlides/SiteSpecificNote.html',
			'viewTaskSlides/EventHistory.html',
			'viewTaskSlides/AllocatedVisits.html',
			'viewTaskSlides/Photos.html',
      'photoList.html',
			'viewTaskSlides/Documents.html',
      'documentList.html',
			'viewTaskSlides/PPMAssetList.html',
      'ppmAssets/assetList.html',
			'viewTaskSlides/BuildingAssets.html',
			'viewTaskSlides/MeterReadings.html',
			'viewTaskSlides/TapTemperatures.html',
			'viewTaskSlides/OddJobs.html',
			'viewTaskSlides/ClosingStatus.html',
			'viewTaskSlides/ClosureNotes.html',
			'viewTaskSlides/Materials.html',
			'viewTaskSlides/ClosingSeverity.html',
			'viewTaskSlides/Signature.html',
			'viewTaskSlides/FinishTask.html',
			'viewTaskSlides/NextVisitNotes.html',
			'viewTaskSlides/FGas.html',
      'viewTaskSlides/AuditReactive.html',
      'auditReactive/audit.html',
      'viewTaskSlides/slideBase.html',
      'buildingAssets/asset.html',
      'finishScreen.html',
      'pdfViewer/main.html'
		], false, function(tmp){
      console.log(tmp);
      window.App.viewTaskSlides = tmp;
			$.headerTmp = tmp['slideHeaders.html'];
      window.footerView = new window.viewConstructors.footerController({ t: tmp['footerController.html'] });

      $.remoteImgFallback = function(src){ return "if(arguments[0].currentTarget.src.substr(0,4) !== 'http') arguments[0].currentTarget.src = '"+src+"';"; }

      Backbone.history.start();
		});
        $.renderUpdateButton();

		$('link[title="disableOnLoad"]').prop('disabled',true);

        $("#loading").remove();

        var cv = function(){
            !!this.cTimeout && clearTimeout(this.cTimeout);
            this.cTimeout = setTimeout( checkVersion.bind( null, cv ), 30000);
        }.bind(App.vChecker);

        $.loadPermissions(function(){
                checkVersion(cv);
            },
            function(){
                checkVersion(cv);
            }
        );
        document.addEventListener("deviceready",onDeviceReady,false);
        function onDeviceReady(){
            console.log('Cordova Ready');
            //document.addEventListener("offline", onOffline, false);
            //document.addEventListener("online", onOnline, false);
        }

    		$("body").on("click", ".allocationLink", function(event){
    			window.location = '#allocation';
    			return false;
    		});
        document.addEventListener("backbutton", function(e){ e.preventDefault(); navigator.app.exitApp(); return false; }, false);

        $("body").on("click", ".logout-button", function (event) {
            window.location="#logout";
        });

        $("body").on("click", "#btnSettings", function (event) {
            $('.divMainMenu').css('visibility', 'hidden');
            window.location="#settings";
        });

        $("body").on("click", ".btnTaskList", function (event) {
            window.location="#taskList";
        });

        $("body").on("click", ".btnViewTask", function (event) {
            window.location="#viewTask/visit";
        });

        $("body").on("click", "#btnLogout", function (event) {
            window.location='#logout';
        });

        var hashChain=[],
			     uploadCache;

        localStorage_a.setItem('hashChain', hashChain);

        try {
            uploadCache = localStorage_a.getItem('uploadCache');
        } catch (e) {
            uploadCache = {
                eventNotes: []
            };
            localStorage_a.setItem('uploadCache', uploadCache);
        }

        if (localStorage_a.getItem('currentURL')) {
            window.location = localStorage_a.getItem('currentURL');
        } else {
            localStorage_a.setItem('currentURL', '#home');
        }


        $.loadNumberBootsnipp();
    }
    return {
        start: start
    };
}());
