window.viewConstructors.serviceAssetView = Backbone.View.extend({ __name__:'window.viewConstructors.serviceAssetView',
    el: 'body',
    initialize: function () {
        this.render();
    },
    photoFullscreen:0,
    render: function () {
        var currentPage = this;
        if(!localStorage_a.getItem('client')){
            window.location='#setClient';
        } else {
            $.getPageHtmlAsync('serviceAsset.html', false, function(tmp){
                var pageBody = tmp();
                this.$el.html(pageBody);
            }.bind(this));
		    return this;
        }
    },
    events: {
    },
    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    }
});
