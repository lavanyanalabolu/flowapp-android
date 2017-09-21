(function(){
	App.SubrouteConstructors.qrAssign = Backbone.SubRoute.extend({
		routes:{
			"SetBuilding" : "SetBuilding",
			"SetTypeInstalled" : "SetTypeInstalled"
		},
		SetBuilding : function(){
			routeSlideController.updateSlides('SetBuilding');
		},
		SetTypeInstalled : function(){
			routeSlideController.updateSlides('SetTypeInstalled');
		}
	});
})();
