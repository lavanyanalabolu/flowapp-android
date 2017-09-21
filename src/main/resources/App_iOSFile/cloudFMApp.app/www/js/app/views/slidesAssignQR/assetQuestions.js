App.SlideConstructors.AssetQuestionsSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.AssetQuestionsSlide',
	render: function(){
		var params= {
			headerTmp :  $.headerTmp
		};
		$.getPageHtmlAsync('AssetQuestions.html', false, function(tmp){
			var pageBody = tmp(params);

	        this.$el.html(pageBody);
		});
	}
});
