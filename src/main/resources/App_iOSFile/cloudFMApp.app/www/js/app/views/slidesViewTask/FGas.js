(function(){
  var extenders = (function(){
    var model = Backbone.Model.extend({
      initialize: function(){
        this.set({ "FGAS_FK_BLD_KEY" : $.parseClient().buildingCheckIn.buildingID });
        this.on('change:FGAS_AddCylRefrigerant change:FGAS_RemCylRefrigerant', function(m,val){
           if(val!== m.get('FGAS_Refrigerant')){
             $.jAlert('Refrigerant types do not match!');
           }
        });
      },
      vAtts: [
        "FGAS_SerNo",
        "FGAS_Manufacturer",
        "FGAS_Refrigerant",
        "FGAS_CurrentCharge",
        "FGAS_LeakChecked"
      ],
      defaults: {
        "FGAS_FK_BLD_KEY" : null,
        "FGAS_Man_Asset" : null, "FGAS_Man_AssetLoc" : null, "FGAS_Manufacturer" : null,"FGAS_ModelNo" : null,"FGAS_SerNo" : null,"FGAS_CurrentCharge" : null,"FGAS_Refrigerant" : null,
        "FGAS_LeakChecked" : null, "FGAS_AddedGas" : 'No', "FGAS_AddedQty" : 0, "FGAS_AddCylSerNo" : 'N/A', "FGAS_RemovedGas" : 'No', "FGAS_RemoveQty" : 0, "FGAS_RemCylSerNo" : 'N/A'
      }
    });
    return {
      model: model,
      collection: Backbone.Collection.extend({
        model: model
      })
    };
  })();
  App.SlideConstructors.FGasSlide = baseView.extend({
    __name__:'App.SlideConstructors.FGasSlide',
    initialize: function(){
      var headerTmp = $.headerTmp,
      client = $.parseClient(),
      currentTask = client.currentTask,
      _t = this;

      this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/FGas.html']);

      this.renderParams = {
        headerTmp : headerTmp,
        client: client,
        currentTask: currentTask,
        task: currentTask.task,
        fgs: parseInt(currentTask.fGasStream)
      };

      this.buildingFGas = currentTask.buildingFGas;
      this.collection = new extenders.collection (currentTask.fGasData || []);

      this.listenTo(this.collection, 'add', function(_m){
        _t.model = _m;
      });

      this.on('myEv', this.autoSuggest);

      this.on('fGasStream', function(i){
        var c = $.parseClient();
        c.currentTask.fGasStream = i;
        localStorage_a.setItem('client', c);;
        this.renderParams.fgs = i;
        if(i === 2){
          this.off('fGasStream');
        }
        this.$('.fgbegin')[[0,3].indexOf(i) === -1?'show':'hide']();
      });
    },
    events: {
      "tap .input-label": function(e){ $(e.currentTarget.previousElementSibling).click(); },
      "input .autoSg" : function(e){
        var tar = e.currentTarget,
        auto = tar.nextElementSibling,
        key = tar.id,
        inputVal = tar.value;
        this.trigger('myEv', key, auto, inputVal);
      },
      "tap .fillData": function(e){
        var _t = this;
        _.each(this.possibility, function(v,k){
          _t.$('[name="' + k + '"]').val(v).trigger('blur');
          _t.model.set(k,v);
          _t.trigger('myEv', '', null, '');
        });
      },
      "input .matesquei": function(e){
        if(!e.target.value){
          e.currentTarget.previousElementSibling.style.opacity = 0;
        }else{
          e.currentTarget.previousElementSibling.style.opacity = 1;
        }
      },
      "blur .matesquei": function(e){
        if(!e.target.value){
          e.currentTarget.previousElementSibling.style.opacity = 0;
        }else{
          e.currentTarget.previousElementSibling.style.opacity = 1;
        }
      },
      "tap .autoSuggest" : function(e){
        var tar = e.currentTarget,
        inp = tar.previousElementSibling;

        if(this.possibilites.length){
          inp.value = this.possibilites[0][inp.id];
          this.trigger('myEv', '', tar, '');
        }
      },
      "tap label.btn": function(e){
        e.preventDefault();
        e.currentTarget.click();
        return false;
      },
      "change select": function(e){
        var tar = e.currentTarget,
        key = tar.id,
        inputVal = tar.value;
        this.model.set(key,inputVal);
        console.log(this.model);
      },
      "change [name='FGAS_RemovedGas']": function(e){
        var v = e.currentTarget.value === 'No';
        this.model.vAtts = _[v?'difference':'union'](this.model.vAtts, ['FGAS_RemoveQty','FGAS_RemCylSerNo']);
        this.model.set({FGAS_RemoveQty: (v? 0:null), GAS_RemCylSerNo : (v? 'N/A':null) })
        this.$('.rm input').val('');
        this.$('.rm').toggleClass('disabled', v);
      },
      "change [name='FGAS_AddedGas']": function(e){
        var v = e.currentTarget.value === 'No';
        this.model.vAtts = _[v?'difference':'union'](this.model.vAtts, ['FGAS_AddedQty','FGAS_AddCylSerNo']);
        this.model.set({FGAS_AddedQty: (v? 0:null), FGAS_AddCylSerNo : (v? 'N/A':null) })
        this.$('.ad input').val('');
        this.$('.ad').toggleClass('disabled', v);
      },
      "change .matesqueCon input": function(e){
        if(!!this.model){
          console.log('eeee',e.target.name);
          this.model.set(e.target.name, e.target.value)
        }
      },
      "change input[name='fGas']":function(e){
        console.log('change')
        var i = parseInt(e.target.value);
        this.trigger('fGasStream', i);
      },
      "tap .cancel": "completeEdit",
      "tap .save" : "saveFGas",
      "tap .fGasBegin": function(){
        this.template = 'FGasMain';
        this.collection.add({});
        this.render();
        this.renderFooter();
        this.$('#fgasul').html(this.templates.FGasQs(this.renderParams));
        routeSlideController.disable();
      }
    },
    completeEdit: function(){
      this.model = null;
      this.template = 'FGasControl';
      this.render();
      this.renderFooter();
      routeSlideController.enable();
    },
    possibilites: [],
    possibility: null,
    autoSuggest: function( key, auto, inputVal ){
      if(!!key){
        this.possibilites = _.filter(this.buildingFGas, function(man) {
          return !!man[key] ? man[key].toLowerCase().indexOf(inputVal.toLowerCase()) >= 0 : false;
        });
        this.possibilites = _.sortBy(this.possibilites, function(man) {
          return !!man[key] ? man[key].toLowerCase().indexOf(inputVal.toLowerCase()) : -1;
        });
        this.possibility = null;
      }else{
        this.possibility = this.possibilites[0];
        this.possibilites = [];
      }

      if(this.possibilites.length && inputVal){
        auto.innerHTML = this.possibilites[0][key];
        auto.style.opacity = 1;
        auto.style.pointerEvents = 'auto';
      }else if(!!auto){
        auto.innerHTML = '';
        auto.style.opacity = 0;
        auto.style.pointerEvents = 'none';
      }
      this.$('.fillData').toggleClass('disabled', !this.possibility);
    },
    template: 'FGasControl',
    render: function (mode) {
      var renderParams = this.renderParams,
      tmp = this.templates[this.template],
      pageBody = tmp(renderParams);

      this.$el.html(pageBody);

      return this;
    },
    renderFooter: function(){
      window.footerView.footer(this, this.template + '.html', this.renderParams);
    },
    validate: function(){

      var _t = this,
      validated = true;

      this.$('#fgasul .list-group-item').css("background-color", "");

      _.each(_.pick(this.model.attributes, this.model.vAtts), function(v,k){
        console.log(v,k)
        var node = _t.$('[name="'+k+'"]').closest('.list-group-item');
        node.toggleClass('list-group-item-danger', v===null);
        if(v === null){
          validated = false;
          //node.css("background-color", "#C12E2A");//.removeClass('list-group-item-default').addClass('list-group-item-danger');
        }else{
          //node.css("background-color", "");
        }
      });
      return validated
    },
    saveFGas: function(){
      var client = $.parseClient();
      if(this.validate()){
        client.currentTask.fGasData = this.collection.toJSON();
        localStorage_a.setItem('client', client);
        $.jSuccess('FGas form saved to device');
        this.trigger('fGasStream', 2);
        setTimeout(this.completeEdit.bind(this), 700);
      }else{
        $.jAlert('Please complete all required fields');
      }
    },
  });
})();
