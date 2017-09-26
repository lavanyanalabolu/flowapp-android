App.SlideConstructors.AssetTypeSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.AssetTypeSlide',
	render: function(){
		var params= {
			headerTmp :  $.headerTmp
		};
		$.getPageHtmlAsync('AssetType.html', false, function(){
			var pageBody = tmp(params);
			this.$el.html(pageBody);
		});		
	}
});
