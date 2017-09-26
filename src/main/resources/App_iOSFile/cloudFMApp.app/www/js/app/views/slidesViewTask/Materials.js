App.SlideConstructors.MaterialsSlide = baseView.extend({ __name__:'App.SlideConstructors.MaterialsSlide',
  events: {
    "tap .btnMaterialsUsedYN": "chooseMaterialsYN",
    "change textarea#txtMaterialsUsed": "cacheMaterials"
  },
  initialize:function(){
    this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/Materials.html']);
  },
  render: function (mode) {
    var currentPage = this;
    if ( !localStorage_a.getItem('client') ) {

      window.location='#setClient';

    } else {

      var headerTmp = $.headerTmp;
      var client = this.client = $.parseClient(),
          currentTask = client.currentTask;

      var renderParams = this.renderParams = {
        mode : mode,
        headerTmp : headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        events: currentTask.events
      }

      var tmp = this.templates.MaterialsSlide;

      var pageBody = tmp(renderParams);

      this.$el.html(pageBody);


      return this;
    }
  },
  renderFooter: function(taskStarted){
    taskStarted && window.footerView.footer(this, 'MaterialsSlide.html', this.renderParams);
  },
  chooseMaterialsYN: function(event){
    var matsUsedYN = $(event.currentTarget).attr('data-mats');
    var client = this.client;
    client.currentTask.finishTask.finishMatsUsedYN = matsUsedYN;
    localStorage_a.setItem('client', client);

    $('#btnMatsUsedY').removeClass('btn-primary').addClass('btn-default');
    $('#btnMatsUsedN').removeClass('btn-primary').addClass('btn-default');
    $('#btnMatsUsed' + matsUsedYN).addClass('btn-primary').removeClass('btn-default');

    if(matsUsedYN==='Y'){
      $('#divMaterialsDetail').show();
    } else {
      $('#divMaterialsDetail').hide();
    }
  },
  cacheMaterials: function(event){
    var materialsUsed = $('#txtMaterialsUsed').val();
    var client = this.client;
    client.currentTask.finishTask.finishMatsUsed = materialsUsed;
    localStorage_a.setItem('client', client);
    // if(materialsUsed.length>=0 || materialsUsed.length===1){
    //
    // }
  }

});
