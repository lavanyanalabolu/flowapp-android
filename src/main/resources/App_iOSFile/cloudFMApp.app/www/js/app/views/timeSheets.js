window.viewConstructors.TimesheetsView = Backbone.View.extend({ __name__:'window.viewConstructors.TimesheetsView',
    el: '#nebulousContainer',
    theDate: new Date(),
    weekArray:[],
    visitArray:[],
    initialize: function () {
        this.render();
    },
    render: function () {
        var currentPage = this;
        console.log('im here!', this);
        $.getPageHtmlAsync('timeSheets.html', false, function(tmp){
            window.footerView.footer(currentPage, 'timeSheets.html', {currentPage:currentPage});
            this.$el.html(tmp({currentPage:currentPage}));

            this.loadMondays();

        }.bind(this));
		return this;
    },
    events: {
        "tap .btnExitMenu": "goBack"
    },
    cleanup: function() {
        this.undelegateEvents();
        $(this.el).empty();
    },
    goBack: function(event) {
        console.log('gooback')
        window.location='#allocation';
        return(false);
    },
    loadMondays: function(){
        var _self = this;
        var data = {
            auth : localStorage_a.getItem('token'),
            dsName: 'CLOUDFM_Mondays',
            i: 0,
            j: 0,
            k: 0,
            t: '',
            p1: {}
        }
        var currentPage = this;

        $.jAdminWorking('Loading Week', data,
        function(msg) {

            var myData = JSON.parse(msg.d);
            var metaData = {
                myData: myData
            }
            //var template = _.template(getOfflineTemplate('contractorPortal/timesheets/mondays.html'));
            // $('#theDate').html(template(metaData));
            _self.theDate = myData.data[0].MonDates;
            _self.loadEngineerWeek();
        },
        function(msg) {
            console.log(msg);
        });
    },
    loadEngineerWeek: function(){
        var _self = this;
        var data = {
            auth : localStorage_a.getItem('token'),
            dsName: 'CLOUDFM_engineersDay',
            i: 0,
            j: 0,
            k: 0,
            t: this.engineerGuid,
            p1: {
                startDate:_self.theDate
            }
        }
        var currentPage = this;

        $.jAdminWorking('Loading Week', data,
        function(msg) {

            var myData = JSON.parse(msg.d);
            var metaData = {
                myData: myData
            }
            _self.weekArray = myData.data;
			$.getPageHtmlAsync('timeSheetsWeek.html', false, function(template){
				window.footerView.footer(currentPage, 'timeSheetsWeek.html', metaData);
	            $('#nebulousContainer').html(template(metaData));

	            var maxTabs = $('.section').length;
	            $('.maxTabs').html(maxTabs);

	            window.mySwipe = this.mainWindowSwipe = new Swipe(document.getElementById('myDavid'), {
	                startSlide: 0, // Index position Swipe should start at (default:0)
	                speed: 400, // Speed of prev and next transitions in milliseconds. (default:300)
	                //auto: 1000, // Begin with auto slideshow (time in milliseconds between slides)
	                callback: function(event, index, elem) {
	                  // Runs at the end of any slide change. (effective for updating position indicators/counters)
	                    var buttonSet = $(index).attr('data-buttonSet');

	                    switch(buttonSet){
	                        case 'divFinishButton':
	                            currentPage.renderFinishScreen();
	                        break;
	                    }
	                    $('.buttonSet').hide();
	                    $('.' + buttonSet).show();


	                }
	            });

	            _self.loadTimeSheet();
			}.bind(this));

        },
        function(msg) {
            console.log(msg);
        });
    },
    loadTimeSheet: function(){
        var _self = this;
        var data = {
            auth : localStorage_a.getItem('token'),
            dsName: 'CLOUDFM_engineerWeekVisits',
            i: 0,
            j: 0,
            k: 0,
            t: '',
            p1: {
                startDate:_self.theDate,
                engineerGuid:localStorage_a.getItem('token')
            }
        }
        var currentPage = this;

        $.jmultiClientContractor('Loading Data...', data,
            function(myData) {
                console.log(myData);
                //_self.visitArray = myData;

                window.vis = myData;
                window.d = {data:[]};
                _self.visitArray = {data:[]};
                _.each(myData.data, function(c){
                    if(c.data.length>0){
                        _.each(c.data, function(v){
                            v.clientName = c.clientName;
                            d.data.push(v);
                            _self.visitArray.data.push(v);
                        });
                    }
                });
                console.log(_self.visitArray);
                _self.plotVisits();
            },
            function(msg) {
                console.log(msg);
            });
    },
    plotVisits: function(){
        var _self = this;
        var visitArray = this.visitArray;
		$.getPageHtmlAsync('timeSheetsVisits.html', false, function(template){
			_.each(this.weekArray, function(w){
	            var theDate = w.theDate;

	            var todaysVisits = _.filter(visitArray.data, function(v){
	                return(v.arrivalDate===theDate);
	            });

	//            console.log(todaysVisits);

	            if(todaysVisits.length>0){
	                var todaysVisits = _.sortBy(todaysVisits, function(s){
	                    return(s.arrivalDateTime);
	                });
	                //$('#theDate_' + theDate.substr(0,10)).find('.visitContainer').append(template({engineerGuid:_self.engineerGuid, theDate:theDate, data:todaysVisits})).parent().fadeIn();
	                $('#theDate_' + theDate.substr(0,10)).append(template({engineerGuid:_self.engineerGuid, theDate:theDate, data:todaysVisits})).parent().fadeIn();
	            }

	            // _.each(visitArray.data, function(c){
	            //     if(c.data.length>0){
	            //         var todaysVisits = _.filter(c.data, function(v){
	            //             return(v.arrivalDate===theDate);
	            //         });
	            //         if(todaysVisits.length>0){
	            //             var todaysVisits = _.sortBy(todaysVisits, function(s){
	            //                 return(s.arrivalDateTime);
	            //             });
	            //             $('#theDate_' + theDate.substr(0,10)).find('.visitContainer').append(template({clientName:c.clientName, data:todaysVisits})).parent().fadeIn();
	            //         }
	            //     }
	            // });
	        });
		}.bind(this));

    }
});
