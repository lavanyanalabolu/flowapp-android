App.SlideConstructors.AllocatedVisitsSlide = Backbone.View.extend({ __name__:'App.SlideConstructors.AllocatedVisitsSlide',
	events:{
		"tap .btnCancelVisit": "cancelAllocatedVisit",
        "tap .btnArrangeVisit": "arrangeVisit",
        "tap .aEngineer": "selectEngineer",
        "tap .reselectEngineer":"reselectEngineer",
        "change #etaDate":"etaChanged",
        "tap .btnArrangeVisitSave":"arrangeVisitSave"
	},
	arrangeVisitSave:function(e){
        var taskGuid = $.getCurrentTaskGuid();
        var engineerID = $(e.currentTarget).attr('data-engineerID');
        var engineerName = $(e.currentTarget).attr('data-engineerName');
        var client = $.parseClient();
        var etaDate = $('#etaDate').val();
        var currentPage = this;
        var data = {
            clientGuid : $.parseClient().clientGuid,
            auth : localStorage_a.getItem('token'),
            dsName : 'MOBILE_V5_createVisit',
            i : engineerID,
            j: 0,
            k: 0,
            t: '',
            p1 : {
                taskGuid:taskGuid,
                etaDate:etaDate,
                engineerName:engineerName
            }
        };

        $.jWorking('Allocating visit...', data,
            function(msg) {
                var myData = JSON.parse(msg.d);
                var allocatedVisits = myData.data;
                console.log('new visits');
                console.log(allocatedVisits);

                client.currentTask.allocatedVisits = allocatedVisits;
                localStorage_a.setItem('client', client);
                window.location.reload();
            },
            function(msg) {
                console.log(msg);
                //alert('could not connect to server');
            }
        );
    },
    etaChanged:function(e){
        console.log(e);
        if(e){
            $('.btnArrangeVisitSave').show();
        } else {
            $('.btnArrangeVisitSave').hide();
        }
    },
    reselectEngineer: function(){
        $('.aEngineer').show();
        $('.reselectEngineer').hide();
        $('#divEtaDate').hide();
        $('.btnArrangeVisitSave').hide();
        $('.btnArrangeVisitSave').removeAttr('data-engineerID');
        $('.btnArrangeVisitSave').removeAttr('data-engineerName');
        return(false);
    },
    selectEngineer:function(e){
        var engineerID = $(e.currentTarget).attr('data-engineerID');
        var engineerName = $(e.currentTarget).attr('data-engineerName');
        var mobile = $(e.currentTarget).attr('data-mobile');
        $('.aEngineer').hide();
        $('.reselectEngineer').show();
        $(e.currentTarget).show();
        $('#divEtaDate').show();
        $('.btnArrangeVisitSave').attr('data-engineerID', engineerID);
        $('.btnArrangeVisitSave').attr('data-engineerName', engineerName);
        $('.aPhoneEngineer').attr('href', 'tel:' + mobile).show();
        return(false);
    },
    arrangeVisit:function(e){
        var taskGuid = $(e.currentTarget).attr('data-taskGuid');
        var client = $.parseClient();

        var currentPage = this;
        var data = {
            clientGuid : $.parseClient().clientGuid,
            auth : localStorage_a.getItem('token'),
            dsName : 'MOBILE_V5_engineerList',
            i : 0,
            j: 0,
            k: 0,
            t: taskGuid,
            p1 : {}
        };

        $.jWorking('Finding engineers...', data,
            function(msg) {
                var myData = JSON.parse(msg.d);

                var engineerList = myData.data;

                client.currentTask.engineerList = engineerList;
                localStorage_a.setItem('client', client);
                window.location='#allocateEngineer';
            },
            function(msg) {
                console.log(msg);
                //alert('could not connect to server');
            }
        );
    },
    cancelAllocatedVisit: function(e){
        var resGuid = $(e.currentTarget).attr('data-resGuid');

        var client = $.parseClient();

        var currentPage = this;
        var data = {
            clientGuid : $.parseClient().clientGuid,
            auth : localStorage_a.getItem('token'),
            dsName : 'MOBILE_V5_allocatedCancelVisit',
            i : 0,
            j: 0,
            k: 0,
            t: resGuid,
            p1 : {}
        };

        $.jWorking('Cancelling visit', data,
            function(msg) {
                var myData = JSON.parse(msg.d);
                var allocatedVisits = myData.data;
                console.log('new visits');
                console.log(allocatedVisits);

                client.currentTask.allocatedVisits = allocatedVisits;
                localStorage_a.setItem('client', client);
                window.location.reload();
            },
            function(msg) {
                console.log(msg);
                //alert('could not connect to server');
            }
        );
    }
});
