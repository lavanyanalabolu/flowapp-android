window.viewConstructors.TaskFinishedView = Backbone.View.extend({ __name__:'window.viewConstructors.TaskFinishedView',
    el: '#nebulousContainer',
    initialize: function () {
        this.render();
    },

    render: function () {
        var currentPage = this;
        $.getPageHtmlAsync('taskFinished.html', false, function(tmp){
            window.footerView.footer(this, 'taskFinished.html', {});
            var pageBody = tmp({currentPage:currentPage});
            this.$el.html(pageBody);
        }.bind(this));
		return this;
    },

    events: {
        "tap .btnAnotherTask": "taskList",
        "tap .btnScanOut": "scanQR",
        "tap .btnHome": "home"
    },
    taskList: function(){
        window.location='#taskList';
    },
    scanQR: function(event){
        var scanner = window.cordova.plugins.barcodeScanner || window.cordova.require("cordova/plugin/BarcodeScanner");
           scanner.scan(
            function(result) {
                console.log(result);
                //alert(result.text);
                //alert(result.text.substring(7, result.size))
                if (result.cancelled) {
                    window.location='#home';
                    return false;
                }
                else {
                    var QRCode = result.text.substring(7, result.size);
                    if (QRCode.substring(0, 13) != 'qrcloud.co.uk') {
                        $.jAlert('Incompatible QR Code');
                        return false;
                    }
                    var thisQRIdentity = QRCode.substring(16, 23);
                    var qrGuid = QRCode.substring(23, 59);
                    if (thisQRIdentity.toUpperCase() !== $.parseClient().qrIdentity.toUpperCase()) {
                        $.jAlert('This QR label is not associated with the current client (' + $.parseClient().clientName + ')');
                        return false;
                    }
                    console.log(QRCode);
                    window.location='#qrScan/' + qrGuid;
                }
            },
            function(error) {
                console.log(error);
            }
        );
    },
    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    }

});
