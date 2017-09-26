;(function(){
    var tapView = Backbone.View.extend({ __name__:'tapView',
        initialize: function(options){
            _.extend(this,options);
            //console.log('TEEEView', this.parentView.el);
            //this.listenToOnce(this.parentView, 'rendered', this.render);
            this.render();
            this.listenTo(this.model, 'change', this.enableDisableSave);
            this.listenToOnce(this.model, 'deleted', this.close);
            this.listenToOnce(this.model, 'saved', this.render);
        },
        close: function(){
            this.unbind();
            this.undelegateEvents();
            this.remove();
            this.off();
        },
        render: function(){

            this.$el.html(
                this.templateFn({ tapTempTypes: this.tapTempTypes, tt: this.model.toJSON(), oldData: this.model.oldData || null })
            );
            //console.log( this.model.oldData, 'tapList' )
            this.parentView.$('#tapList').append(this.$el);
        },
        events:{
            "tap .input-label":function(e){ $(e.currentTarget.previousElementSibling).click(); },
            'tap .removeTap': function(e){
                $(e.currentTarget).replaceWith(
                    '<span>Delete?&nbsp;&nbsp;</span>'.concat(
                        '<button class="btn-sm btn btn-default confirmRemove">yes</button>',
                        '<button class="btn-sm btn btn-default cancelRemove">no</button>'
                    )
                );
            },
            'tap .confirmRemove': function(e){
                this.model.delete();
            },
            'tap .cancelRemove': function(e){
                $(e.currentTarget)
                    .parent()
                    .html('<a class="removeTap"><span class="glyphicon glyphicon-remove"></span></a>');
            },
            "tap .saveTap": function(e){
                var _m = this.model;
                this.listenToOnce( _m, 'sync', _m.trigger.bind(_m, 'saved', _m ) );
                _m.save({
                    clientGuid : $.parseClient().clientGuid, auth : localStorage_a.getItem('token'),
                    dsName : 'MOBILE_V5_tapUnitCreate', t: '',
                    p1: _m.toJSON()
                }, {
                    deferMessage: "Creating tap ...", url: serverPath + '/dataClientToken'
                });
            },
            "change input, select": "formValidation"
        },
        enableDisableSave: function(_m){
            var toggle  = (_m.get('HotTap') || _m.get('ColdTap')) &&
                !_.intersection(
                    _.values(
                        _.pick(_m.attributes, ['TapTempTypeID', 'TapLocation'])
                    ), [null,'']
                ).length;

            this.$('.saveTap').toggleClass('disabled', !toggle);
            var tf = (parseInt(_m.get('TapDataC'))>_m.get('CMax') || parseInt(_m.get('TapDataH')) < _m.get('HMin')) && _m.get('ConfirmTemp') === false;
            _m.set({invalid: tf}, {silent : true});
        },
        formValidation: function(e){
            var tar = $(e.currentTarget),
            group = tar.closest('.tapGroup'),
            val = tar.val(),
            k = tar.attr('name'),
            _m = this.model;

            console.log(this.model.toJSON(), k, val);

            val = ['ColdTap','HotTap','ConfirmTemp'].indexOf(k)!==-1?!!parseInt(val):val;

            if('TapTempTypeID' === k){
                _m.set(_.findWhere(this.tapTempTypes, {'TapTempTypeID': parseInt(val) })||{});
            }

            if(['TapDataC','TapDataH'].indexOf(k) !== -1){
                group.removeClass('bg-warning bg-danger');
                if(parseInt(val) < 0 || parseInt(val) > 100){
                    group.addClass('bg-danger');
                    tar.val('');
                    val = '';
                    tar.attr('placeholder', 'Value must be between 0 and 100');
                }else
                if(tar.attr('name') === "TapDataH" && parseInt(tar.val()) < _m.get('HMin')){
                    group.addClass('bg-warning');
                }else
                if(tar.attr('name') === "TapDataC" && parseInt(tar.val()) > _m.get('CMax')){
                    group.addClass('bg-warning');
                }else{
                }
            }

            _m.set(k,val);

            if(parseInt(_m.get('TapDataC'))>_m.get('CMax') || parseInt(_m.get('TapDataH')) < _m.get('HMin')){
                group.parent().find('.confirmTemp').show();
            }else{
                group.parent().find('.confirmTemp').hide();
            }

            console.log('change', val, _m);
        }
    });
    var tapModel = Model.extend({
        initialize: function(){
            var _m = this;
            this.set('myId', this.cid);
        },
        delete: function(){
            var _m = this;
            if(!_m.get('TapUnitID')){
                _m.destroy();
                this.trigger('deleted', this);
                return;
            }else{
                this.once('sync',this.trigger.bind(this, 'deleted', this));
                _m.save({
                    clientGuid : $.parseClient().clientGuid,
                    auth : localStorage_a.getItem('token'),
                    dsName : 'MOBILE_V5_tapUnitDelete',
                    t: '',
                    p1: _m.toJSON()
                }, {  deferMessage: "Deleting tap ...", url: serverPath + '/dataClientToken' });
            }
        }
    });



    App.SlideConstructors.TapTemperaturesSlide = baseView.extend({ __name__:'App.SlideConstructors.TapTemperaturesSlide',
        events: {
            "tap .btnSaveTapTemperatures": "saveTapTemperatures",
            "tap .addTap": function(){
                this.tapTempCol.add({});
                window.footerView.$('.btnSaveTapTemperatures').addClass('disabled');
            }
        },
        initialize: function(){
            //var tmps = _.filter($(window.App.viewTaskSlides['viewTaskSlides/TapTemperatures.html']), function(t){ return !!t.id; });
            this.serializeTemplates(window.App.viewTaskSlides['viewTaskSlides/TapTemperatures.html']);
            //this.templates.main = tmps[0];
            //this.templates.inner = tmps[2];
            var tapTemplateFn = this.templates.tap;//_.template(tmps[1].innerHTML);

            var client = $.parseClient();
            var currentTask = client.currentTask;
            var headerTmp = $.headerTmp;

            var tapTempCol =
            this.tapTempCol =
                new Backbone.Collection(
                    _.each( currentTask.tapTemperatures || [],
                        function(t){
                            t.HotTap = t.HotTap === null ? undefined : t.HotTap;
                            t.ColdTap = t.ColdTap === null ? undefined : t.ColdTap;
                            t.ConfirmTemp = t.ConfirmTemp === null ? undefined : t.ConfirmTemp;
                        }),
                        {
                            model: tapModel.extend({
                                defaults: {
                                    "taskGuid": currentTask.taskGuid, "TapUnitID":null,
                                    "meterReadingID": currentTask.tapTemperatures[0].meterReadingID,
                                    "meterReadingTypeName":'Tap Temperatures', "TapLocation":null,
                                    "TapTempTypeID":null, "TapTempTypeName":null, "ColdTap":true,
                                    "HotTap":true, "TapDataH":null, "TapDataC":null,
                                    "ConfirmTemp":false, "invalid":false
                                },
                                viewProps: {
                                    parentView: this,
                                    templateFn: tapTemplateFn,
                                    tapTempTypes : client.tapTempTypes
                                }
                            })
                        }
                    );

            this.listenTo(tapTempCol,'deleted',function(__m){
                this.tapTempCol.remove(__m.cid);
                $.updateTaskInfo( 'tapTemperatures', this.tapTempCol.toJSON(), true );
                this.renderFooter();
            });
            this.listenTo(tapTempCol,'saved', function(__m){
                console.log(__m, 'saved a tap');
                $.updateTaskInfo('tapTemperatures', __m.collection.toJSON(), true);
                this.renderFooter();
            });
            this.listenTo(tapTempCol, 'add', function(_m, _c){
                this.renderParams.tapTemperatures = _c.toJSON();
                this['tapView_' + _m.cid] = new tapView(_.extend({ model: _m }, _m.viewProps) );
            }.bind(this));

            this.renderParams = {
                tapTempTypes: client.tapTempTypes,
                headerTmp : headerTmp,
                client: client,
                currentTask: currentTask,
                task: currentTask.task,
                tapTemperatures: tapTempCol.toJSON()
            };

            this.on('rendered', function(){
                this.once('lastTapTemps', function(old){
                    this.tapTempCol.each(function(m){
                        var oldData = _.findWhere(old,{ TapUnitID : m.get('TapUnitID')  }) || null;
                        if(oldData){
                            m.oldData = oldData;
                            this['tapView_' + m.cid].render();
                        }
                    }, this);
                }, this);
                this.getOldData();
            }, this);


        },
        render: function () {
            var tmp = this.templates.main,
            pageBody = tmp(this.renderParams);
            this.$el.html(pageBody);
            this.renderInner();
            return this;
        },
        renderInner: function(){
            this.renderParams.tapTemperatures = this.tapTempCol.toJSON();

            var tmp = this.templates.inner,
                pageBody = tmp(this.renderParams);

            this.$('.fixedinner')
                .html(pageBody);

            this.tapTempCol.each(function(_m){
                this['tapView_' + _m.cid] = new tapView(_.extend({ model: _m }, _m.viewProps) );
            },this);

            this.trigger('rendered');
            return this;
        },
        renderFooter: function(a){
            window.footerView.footer(this, 'TapTemperaturesSlide.html',
            { savePermitted : this.savePermitted() } );
        },
        savePermitted: function(){
            if(!this.tapTempCol.where({TapUnitID:null}).length){
                return true;
            }else{
                return false;
            }
        },
        getOldData: function(){
            var client = $.parseClient();
            var currentTask = client.currentTask;
            var taskGuid = $.getCurrentTaskGuid();
            var data = {
                clientGuid : $.parseClient().clientGuid,
                auth : localStorage_a.getItem('token'),
                dsName : 'MOBILE_V5_getLastTapTemps',
                i : 0, j: 0,k: 0,
                t: taskGuid,
                p1 : {}
            };

            if(currentTask.lastTapTemps){
                this.trigger('lastTapTemps', currentTask.lastTapTemps);
            }else{
                $.jWorking('Last visit data ... ', data,
                    function(msg) {
                        var myData = JSON.parse(msg.d);
                        $.updateTaskInfo('lastTapTemps', myData.data);
                        this.trigger('lastTapTemps', myData.data);
                    }.bind(this),
                    function(msg) {
                        console.log(msg);
                        //alert('could not connect to server');
                    }
                );
            }

        },
        saveTapTemperatures: function(){
            var client = $.parseClient(),
            temps = this.tapTempCol.toJSON(),
            reger = /\d+(\.\d{1})?/;

            console.log(temps);

            if( _.filter(temps, function(t){
                return ((t.HotTap && reger.test(t.TapDataH) ) || !t.HotTap ) && ((t.ColdTap && reger.test(t.TapDataC) ) || !t.ColdTap );
            }).length === temps.length ){
                //console.log(this.tapTempCol.where({invalid:true}));

                if(this.tapTempCol.where({invalid:true}).length){
                    $.jAlert('Please confirm all readings');
                    return;
                }
                client.currentTask.tapTemperatures = temps;
                localStorage_a.setItem('client', client);
                console.log('successing');
                $.jSuccess('Thank you. Tap temperatures have been saved to device');
            }else{
              console.log('alerting');
                $.jAlert('Please give a temperature for all taps');
            }
        }
    });
})();
