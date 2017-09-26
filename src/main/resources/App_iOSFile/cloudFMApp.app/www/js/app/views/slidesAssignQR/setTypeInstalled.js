App.SlideConstructors.SetTypeInstalledSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.SetTypeInstalledSlide',
	render: function(p) {
		var _v = this;
		$.getPageHtmlAsync('qrAssignSlides/SetTypeInstalled.html', false, function(tmp){
    		var params= {
    			headerTmp :  $.headerTmp,
    			qrData: p.qrData.toJSON(),
    			theModel: p.qrData,
    			FA: !!p.qrData.get('building_id')
    		};
            var pageBody = tmp(params);

            this.$el.html(pageBody);

            $.jSuccess('This QR code is currently ' + p.qrData.get('status') + ' Please update the information for this QR code.');

        }.bind(this));
		return this;

    },
    initialize: function(p){
    	this.formModel = p.qrData;
    	this.formModel.updateForm = function(property, val){ this.set(property, val); };
    },
    events: {
        "change .f": "QFChange",
        "change .fInput": "updateModel",
        "tap label": "replaceEvent"
    },
    replaceEvent:function(e){
        e.preventDefault();
        $(e.currentTarget).children('input').click();
        $(e.currentTarget).siblings('input').click();
    },
    updateModel:function(e){
        //e.preventDefault();
        var inp = $(e.currentTarget);
        inp.parent().hasClass('btn') &&
            inp.parent().toggleClass('btn-success', inp.prop('checked')).toggleClass('btn-default', !inp.prop('checked')) &&
            inp.parent().siblings('.btn').removeClass('btn-success').addClass('btn-default');

        this.formModel.updateForm(inp.attr('name'), inp.val());
    },
    QRCancel: function(e){
        this.cleanup();
        window.location = '#home';
    },
    QFChange: function(e){
        var qf = $(e.currentTarget);
        var changetext =  'Is this ' + qf.parent().text().toLowerCase() + ' already installed?';
        $('#instText').html(changetext);
        $('.inputToggle').show();
    }
});
