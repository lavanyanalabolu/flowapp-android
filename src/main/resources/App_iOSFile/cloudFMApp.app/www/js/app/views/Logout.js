window.viewConstructors.LogOutView = Backbone.View.extend({ __name__:'window.viewConstructors.LogOutView',
    el: '#nebulousContainer',
    initialize: function () {
        this.hideMenu();
        this.render();
    },

    hideMenu: function(){
        $('.divMainMenu').css('visibility', 'hidden');
        $('.divCloseMenuFooter').css('visibility', 'hidden');
        $('.mainSection').show();
    },
	renderFooter: function(){
		window.footerView.footer('blank.html');
	},
    render: function () {
        $.getPageHtmlAsync('signIn.html', false, function(tmp){
            this.$el.html(tmp());
            var m = localStorage.mobileNumber,
				v = localStorage_a.getItem('version');
			localStorage_a.cached = {};
            localStorage.clear();
			localStorage_a.setItem('version', v);
			window.footerView.footer('blank.html');
            localStorage.mobileNumber = m;
			console.log('version', v)
        }.bind(this));
        return this;
    }
});
