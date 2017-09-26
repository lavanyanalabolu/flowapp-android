App.SlideConstructors.BuildingDetailsSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.BuildingDetailsSlide',
	events: {
		"tap .backToTaskDetails" : "showTaksDetails",
	},
	showTaksDetails : function() {
        //this.swipe.enable()
		window.routeSlideController.enable()

        $('#taskDetails').show()
        $('#buildingDetails').hide()
    },
});