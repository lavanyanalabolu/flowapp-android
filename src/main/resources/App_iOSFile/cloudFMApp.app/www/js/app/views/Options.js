window.viewConstructors.OptionsView = Backbone.View.extend({ __name__:'window.viewConstructors.OptionsView',
    el: 'body',
    initialize: function () {
        this.render();
    },

    render: function () {
        var currentPage = this;
        $.getPageHtmlAsync('Options.html', false, function(tmp){
            this.$el.html(tmp({currentPage:currentPage}));
        }.bind(this));
        return this;
    },
    
    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    }

});