App.SlideConstructors.RamsDocumentsSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.RamsDocumentsSlide',
	events: {
		"tap .taskRams":"selectRams",
		"tap #siteRamNote" : function(){
			$.updateTaskInfo('RR', { riskStatus: 2 });
			routeSlideController.mainView.trigger('advanceRR');
		},
		"tap #riskPass" : function(){
			routeSlideController.mainView.trigger('finishRiskAssessment');
		}
	},
	initialize: function(params){
		console.log('parammas', params);
		var _v = this,
			client = $.parseClient();

		this.RR = client.currentTask.RR;

		if(!client.currentTask.ramDocs){
			var ramData = {
				auth : localStorage_a.getItem('token'),
				dsName: 'CONTRACTORDB_RAMS_list',
				i: 0,
				j: 0,
				k: 0,
				t: localStorage_a.getItem('contractorGUID'),
				p1: {

				}
			};

			$.jContractorDBToken('Loading RAM Checklist ...', ramData,
				function(msg){
					if(msg.d!=='null'){
						var myData = JSON.parse(msg.d).data;
						params.ramCol.add(myData);
						client.currentTask.ramDocs = params.ramCol.toJSON();
						localStorage_a.setItem('client', client);
						_v.render(params.mode);
					}
				},
				function(e){
					 $.serverLog('big fat error', e);
				}
			);
		}

	},
	selectRams: function(e){
        var tar = $(e.currentTarget);
        var sel = parseInt(tar.attr("data-selected"))? 0 : 1;
        var btnClass = (sel) ? 'list-group-item-success': 'list-group-item-transparent text-primary' ;
        var glyphClass = (sel) ? '' : ' text-default';
        //console.log('was ', tar.attr("data-selected"))
        tar.attr({
            "data-selected" : sel,
            "class" : "list-group-item row-same-height taskRams " + btnClass
        }).find('.glyphicon').attr('class', 'glyphicon glyphicon-ok' + glyphClass);

		this.options.ramCol.get(tar.attr('data-name')).set( 'selected', !!sel );
        //console.log('is now ', tar.attr("data-selected"))
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
                t: currentTask.task[0]
            };

            var tmp = window.App.viewTaskSlides['viewTaskSlides/RamsDocuments.html'];

	            var pageBody = tmp(renderParams);

	            this.$el.html(pageBody);


			return this;
        }
    },
    renderFooter: function(taskStarted){
		console.log('renderRamFooter', this.RR.riskStatus);
        taskStarted && window.footerView.footer(this, 'RamsDocumentsSlide' + ( this.RR.riskStatus === 1 ? 'SiteNote' : '') + '.html', this.renderParams);
		//taskStarted && window.footerView.footer(this, 'RamsDocumentsSlide.html', this.renderParams);
    }
});
