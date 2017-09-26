App.SlideConstructors.ClosureNotesSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.ClosureNotesSlide',
	events:{
		"change textarea#txtWorkNotes": "cacheWorkNotes",
		"blur #txtWorkNotes" : function(e){

            var cn = $(e.currentTarget);
            var cnString = cn.val()
            var textMax = 30
            var length = cnString.length;
            var remaining = textMax - length;
            if( length < textMax){
                cn.css({
                    "border-color": "#a94442",
                    "background-color" : "rgba(255, 0, 0, 0.2)"
                })
                .val('')
                .attr('placeholder', 'Please enter helpful information, at least 30 characters.' + remaining + ' characters remaining')
                cn.on('click', function(event){
                    $( event.currentTarget ).val(cnString).attr({style:""}).off('click')
                });
            }
        },
	},
    render: function (mode) {
        var currentPage = this;
        if ( !localStorage_a.getItem('client') ) {
            window.location='#setClient';
        } else {
            var headerTmp = $.headerTmp;
            var client = $.parseClient(),
                currentTask = client.currentTask;

            var renderParams = this.renderParams = {
                mode : mode,
                headerTmp : headerTmp,
                client: client,
                currentTask: currentTask,
                task: currentTask.task,
                events: currentTask.events
            }

            var tmp = window.App.viewTaskSlides['viewTaskSlides/ClosureNotes.html'];

                var pageBody = tmp(renderParams);

                this.$el.html(pageBody);


            return this;
        }
    },
    renderFooter: function(taskStarted){
        taskStarted && window.footerView.footer(this, 'ClosureNotesSlide.html', this.renderParams);
    },
	genrealStatusNote: function() {
        $('#divStatusTextNotset').hide();
    },
	cacheWorkNotes: function(event){
        var workNotes = $('#txtWorkNotes').val();
        var client = $.parseClient();
        client.currentTask.finishTask.workNotes = workNotes;
        localStorage_a.setItem('client', client);
        // if(workNotes.length>=0 || workNotes.length===1){
        //     this.renderFinishScreen();
        // }
    }
});
