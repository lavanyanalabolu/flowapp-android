window.viewConstructors.PrivacyPolicy = Backbone.View.extend({ __name__:'window.viewConstructors.PrivacyPolicy',
	className: 'xpanel panel-primary',
	initialize: function () {
    },
	events: {
		"tap .btnAgreeTerms": function(){
			this.writeFn();
			Backbone.history.loadUrl();
		}
	},
	writeFn: function(){
		console.log('this defo happens', !!window.resolveLocalFileSystemURL);
		var pathToFile = (cordova.file.applicationStorageDirectory || '') + 'Documents';

		var otherErrorHandler = function(err){
			console.log(JSON.stringify(err), 'I am other');
			console.log(pathToFile);
		};
		var mainSuccess = function (dir) {
			dir.getFile(localStorage_a.getItem('version').versionID + "termsAgreed.txt", { create: true }, function (file) {
				console.log('success', pathToFile);
			}, otherErrorHandler );
		};
		var errorHandler = function(err){
			console.log(JSON.stringify(err), 'What?');

			if(err.code == 1){
				window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function (dir) {
				dir.getDirectory( 'Documents', { create: true, exclusive: false }, function (dir) {
						console.log('createDocsFolder');
						mainSuccess(dir);
					}, otherErrorHandler );
				});
			}
		};
		window.resolveLocalFileSystemURL(pathToFile, mainSuccess, errorHandler );
	},
    render: function (tmp) {
        var currentPage = this;
        this.$el.html(tmp({ currentPage: currentPage, headerTmp: $.headerTmp }));
		$('#nebulousContainer').html(this.$el);
		window.footerView.footer(this, 'privacyPolicy.html', {} );
        return this;
    },
    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    }
});
