// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com
window.htmlQRScanner = function(){
    var gCtx = null;
    var gCanvas = null;
    var c=0;
    var stype=0;
    var gUM=false;
    var webkit=false;
    var moz=false;
    var v=null;
    var _this = this;
    _this.tim = null;
    var imghtml='<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>'+
        '<div id="imghelp">drag and drop a QRCode here'+
        '<br>or select a file'+
        '<input type="file" onchange="handleFiles(this.files)"/>'+
        '</div>'+
    '</div>';

    var vidhtml = '<video id="v" style="width:100%; height:100%;" autoplay></video>';

    function initCanvas(w,h)
    {
        gCanvas = document.getElementById("qr-canvas");
        gCanvas.style.width = w + "px";
        gCanvas.style.height = h + "px";
        gCanvas.width = w;
        gCanvas.height = h;
        gCtx = gCanvas.getContext("2d");
        gCtx.clearRect(0, 0, w, h);
    }

    function captureToCanvasWorker(){

        var blobURL = URL.createObjectURL( new Blob([ '(' + qrCodeWorker.toString() + ')()' ], { type: 'application/javascript' } ) );
        _this.worker = new Worker( blobURL );

        // Won't be needing this anymore
        URL.revokeObjectURL( blobURL );

        

        _this.worker.onmessage = function(e){
            
            if(!!e.data && e.data.indexOf('http') !== -1){
                //return false;
                //alert(e.data);
                console.log('messagefromworker')
                !!_this.tim && clearTimeout(_this.tim);
                !!_this.worker && _this.worker.terminate();
                read(e.data);
            }
        }

        function sendQR(){
            if(stype!=1)
                return;
            if(gUM)
            {
                try{
                    gCtx.drawImage(v,0,0);
                    try{
                        var mess = gCanvas.toDataURL();
                        //console.log(mess);
                        var mess_a = gCtx.getImageData( 0, 0, gCanvas.width, gCanvas.height );
                        //var mess_b = $.extend(true, mess_a, {});
                        //delete mess_b.data.buffer;
                        //console.log(mess_a.data.buffer)
                        _this.worker.postMessage( [ gCanvas.width, gCanvas.height ]);
                        _this.worker.postMessage(mess_a.data.buffer, [mess_a.data.buffer]);
                    }
                    catch(e){       
                        console.log(e);
                        alert('this is not supported on your device')
                    };
                }
                catch(e){       
                        console.log(e);
                        alert('this is not supported on your device')
                };
            }
            _this.tim = setTimeout( sendQR, 500);
        }
        sendQR();
        
    }
    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function read(a)
    {
        !!_this.callback && _this.callback({text: a})

        /*
        var html="<br>";
        if(a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
            html+="<a target='_blank' href='"+a+"'>"+a+"</a><br>";
        html+="<b>"+htmlEntities(a)+"</b><br><br>";
        document.getElementById("result").innerHTML=html;*/
    }  
    _this.kill = function(){
        !!_this.tim && clearTimeout(_this.tim);
        !!_this.worker && _this.worker.terminate();
    };
    function isCanvasSupported(){
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    }
    function success(stream) {
        if(webkit)
            v.src = window.webkitURL.createObjectURL(stream);
        else
        if(moz)
        {
            v.mozSrcObject = stream;
            v.play();
        }
        else
            v.src = stream;
        gUM=true;
        setTimeout(captureToCanvasWorker, 500);
    }
            
    function error(error) {
        gUM=false;
        return;
    }

    var load = this.load = function()
    {
        if(isCanvasSupported() && window.File && window.FileReader)
        {
            initCanvas(800, 600);
            document.getElementById("mainbody").style.display="inline";
            setwebcam();
        }
        else
        {
            document.getElementById("mainbody").style.display="inline";
            document.getElementById("mainbody").innerHTML='<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>'+
            '<br><p id="mp2">sorry your browser is not supported</p><br><br>'+
            '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
        }
    }

    var setwebcam = this.setwebcam = function()
    {
        document.getElementById("result").innerHTML="- scanning -";
        if(stype==1)
        {
            setTimeout(captureToCanvas, 500);    
            return;
        }
        var n=navigator;
        document.getElementById("outdiv").innerHTML = vidhtml;
        v=document.getElementById("v");

        //console.log(typeof MediaStreamTrack, typeof n.getUserMedia);

        var params = {video: true, audio: false};
        var sources = [];
        var theSource;

        function getum(){
            if(n.getUserMedia)
                n.getUserMedia(params, success, error);
            else
            if(n.webkitGetUserMedia)
            {
                webkit=true;
                n.webkitGetUserMedia(params, success, error);
            }
            else
            if(n.mozGetUserMedia)
            {
                moz=true;
                n.mozGetUserMedia(params, success, error);
            }
        }

        if (typeof MediaStreamTrack === 'undefined' || ( typeof MediaStreamTrack === 'function' && typeof MediaStreamTrack.getSources === 'undefined' ) ){
            //$.serverLog('sources no MediaStreamTrack', typeof MediaStreamTrack);
            getum();
        } else {
            MediaStreamTrack.getSources(function(si){
                for (var i = 0; i !== si.length; ++i) {
                    var sourceInfo = si[i];
                    //$.serverLog(sourceInfo.facing == 'environment')
                    if (sourceInfo.kind === 'video') {
                        if(sourceInfo.facing == 'environment'){
                            theSource = sourceInfo.id;
                        }
                        sources.push(sourceInfo.id);
                    }
                }
                params.video = {
                    optional: [{ sourceId: theSource || sources.pop() }]
                }
                getum();
            });
            
        }
        stype=1;
    }
    function setimg()
    {
        document.getElementById("result").innerHTML="";
        if(stype==2)
            return;
        document.getElementById("outdiv").innerHTML = imghtml;
        document.getElementById("qrimg").style.opacity=1.0;
        document.getElementById("webcamimg").style.opacity=0.2;
        stype=2;
    }
};
