function registerCreateAsset(commonMethods, assetPhotos){
    var assetTagQuestions = [
	{
	       assetTagCategoryName:"Walk In Freezer",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"What type of refrigerant",
	                     assetTableFieldName:"refrigerantType",
	                     responses:["R22","R134a","R407c","R410a","R404a"]
	              },
	              {
	                    questionType:"input",
	                    questionText:"Refrigerant weight (kg)",
	                    assetTableFieldName:"refrigerantWeight"
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Walk in Fridge",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"What type of refrigerant",
	                     assetTableFieldName:"refrigerantType",
	                     responses:["R22","R134a","R407c","R410a","R404a"]
	              },
	              {
	                    questionType:"input",
	                    questionText:"Refrigerant weight (kg)",
	                    assetTableFieldName:"refrigerantWeight"
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Stand alone fridge",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"What type of refrigerant",
	                     assetTableFieldName:"refrigerantType",
	                     responses:["R22","R134a","R407c","R410a","R404a"]
	              },
	              {
	                    questionType:"input",
	                    questionText:"Refrigerant weight (kg)",
	                    assetTableFieldName:"refrigerantWeight"
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Bottle fridge",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"What type of refrigerant",
	                     assetTableFieldName:"refrigerantType",
	                     responses:["R22","R134a","R407c","R410a","R404a"]
	              },
	              {
	                    questionType:"input",
	                    questionText:"Refrigerant weight (kg)",
	                    assetTableFieldName:"refrigerantWeight"
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Ice Machine",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"What type of refrigerant",
	                     assetTableFieldName:"refrigerantType",
	                     responses:["R22","R134a","R407c","R410a","R404a"]
	              },
	              {
	                    questionType:"input",
	                    questionText:"Refrigerant weight (kg)",
	                    assetTableFieldName:"refrigerantWeight"
	              },
	              {
	                     questionType:"select",
	                     questionText:"Cuber or flaker",
	                     assetTableFieldName:"cuberOrFlaker",
	                     responses:["Cuber", "Flaker"]
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Air Conditioning Fan",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"What type of refrigerant",
	                     assetTableFieldName:"refrigerantType",
	                     responses:["R22","R134a","R407c","R410a","R404a"]
	              },
	              {
	                    questionType:"input",
	                    questionText:"Refrigerant weight (kg)",
	                    assetTableFieldName:"refrigerantWeight"
	              },
	              {
	                     questionType:"input",
	                     questionText:"Any height restrictions - please detail height",
	                     assetTableFieldName:"heightRestrictions"
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Extract Fan",
	       questions:[
	              {
	                     questionType:"input",
	                     questionText:"Any height restrictions - please detail height",
	                     assetTableFieldName:"heightRestrictions"
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Air Conditioning Condenser",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"What type of refrigerant",
	                     assetTableFieldName:"refrigerantType",
	                     responses:["R22","R134a","R407c","R410a","R404a"]
	              },
	              {
	                    questionType:"input",
	                    questionText:"Refrigerant weight (kg)",
	                    assetTableFieldName:"refrigerantWeight"
	              },
	              {
	                     questionType:"input",
	                     questionText:"Any height restrictions - please detail height",
	                     assetTableFieldName:"heightRestrictions"
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Extinguishers",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"Extinguisher type",
	                     assetTableFieldName:"extinguisherType",
	                     responses:["Water (Red)","Dry Powder (Blue)","CO2 (Black)","Foam (Cream)","Inert Gas (Yellow)"]
	              }
	       ]
	},
	{
	       assetTagCategoryName:"Over door heater",
	       questions:[
	              {
	                     questionType:"select",
	                     questionText:"Heater type",
	                     assetTableFieldName:"overdoorHeater",
	                     responses:["Single Phase", "3 Phase"]
	              }
	       ]
	},
	{
		assetTagCategoryName: "Shutters",
		questions: [
			{
				questionType:"select",
				questionText:"Door type",
				assetTableFieldName:"doorType",
				responses:[ "Sectional door", "Roller shutter",
					"Rapid roll door", "Fire shutter",
					"Sliding folder", "Automatic entrance Door",
					"Manual entrance door", "Fire exit door" ]
			},
			{
				questionType:"select",
				questionText:"Operation type",
				assetTableFieldName:"shutterOperation",
				responses:[
					"Electric single phase",
					"Electric 3 phase",
					"Manual chain operation",
					"Manual push/pull"
				]
			},
			{
				questionType:"input",
				questionText:"Overall height",
				assetTableFieldName:"shutterHeight",

			},
			{
				questionType:"input",
				questionText:"Overall width",
				assetTableFieldName:"shutterWidth",

			},
			{
				questionType:"select",
				questionText:"Safety device fitted",
				assetTableFieldName:"shutterSafety",
				responses:[
					"Yes",
					"No",
					"N/A (fire shutter only)"
				]
			}
		]
	}
	/*,
	{
	        assetTagCategoryName:"Open Fryer Electric",
	        questions:[
	                {
	                    questionType:""
	                }
	        ]
	}*/
	];
    return commonMethods.extend({ __name__:'createAsset',
        template : 'buildingAssets/createAsset.html',
        modelDefaults : function() {
            this.model.set( {
                assetGuid : null,
                qrCode : this.options.qrCode || null,
                'name' : null,
                'manufacturer' : null,
                'model' : null,
                'serial' : null,
                'assetTagCategoryGuid' : null,
                'locationString' : null,
                submited : false,
                photos : []
            });
        },
        fillInfo: function(){
          console.log('filldetails');
          _.each(_.keys(this.model.attributes), function(k){
            console.log('fill', k, this.model.get(k), this.$('[name="'+k+'"]').length);
            this.$('[name="'+k+'"]').val(this.model.get(k));

          }, this);
        },
        initialize : function() {
            var _v = this;
            _.bindAll(this, 'render','fillInfo', 'modelDefaults');
            var SortedArray = window.sortedArray;

            _v.posOb.lat = new SortedArray([]);
            _v.posOb.lng = new SortedArray([]);
            _v.posOb.alt = new SortedArray([]);

            try{
                _v.locWatcher = navigator.geolocation.watchPosition(
                    function(pos){
                        if(!_v.posOb || typeof _v.posOb.lat === 'number'){ console.log("clearing location watcher"); navigator.geolocation.clearWatch(_v.locWatcher) };
                        _v.posOb.lat.insert(pos.coords.latitude);
                        _v.posOb.lng.insert(pos.coords.longitude);
                        _v.posOb.alt.insert(pos.coords.altitude);

                    },function(){
                        $.jAlert('Please turn on location services');
                    },
                    { enableHighAccuracy: true }
                )
            }catch(err){
                alert(err);
            }
            $('#createAsset').show();
            $('#createAsset').html( this.$el );
            _.extend( this , {
                assetCategories : clientCollectionToken(),
                model : this.model || clientModelToken(),
                client : $.parseClient(),
                subView : null
            });
            this.getAssetCategories();

            //this.render(function(){
            routeSlideController.disable();

            this.promiseTemplate().done(
              this.render.bind(this, this.model.get('name') ? this.fillInfo : this.modelDefaults)
            );

            window.footerView.footer(this, 'assetCreateFooter.html', {});
            localStorage_a.setItem('assetCategories', this.assetCategories.toJSON() );
            //}.bind(this));

        },
        posOb: {},
        events : {
            'change .assetQuestions' : "renderQuestions",
            'tap .uploadImages' : 'uploadImages',
            'tap .backToMain' : 'backToMain'
        },
        backToMain : function() {
          this.close();
          routeSlideController.enable();

          $('.asset').show();
        },
        serialize : function() {
            return {
                categories :  this.assetCategories.toJSON()
            };
        },
        getAssetCategories : function() {
            this.assetCategories.set($.parseClient().assetCategories);
        },
        renderQuestions : function( e) {
            var el = $(e.currentTarget),
                val = el.val(),
                text = el.find('option:selected').text(),
                qna = _.findWhere( assetTagQuestions,  { assetTagCategoryName : text } );

            if ( qna ) {
                $.getPageHtmlAsync('buildingAssets/qna.html', false, function(tmp){
                    this.$('#answers').html( tmp( { qna : qna }) );
                }.bind(this));
            } else {
                this.$('#answers').html('');
            }
            this.model.set( { assetTagCategoryGuid : val });
            console.log( this.model );

        },
        uploadImages : function(e) {
            var formData = $('#newAsset').serializeObject();
            var valid = _.every( formData, function( f , k) {
                if ( f === '') {
                    e.preventDefault();
                    this.$('[name="' + k + '"]').focus();
                }
                return f !== '';
            }, this );
            if ( valid ) {
                this.model.set( formData, { silent : true } );
                if ( this.subView !== null  ) {
                    this.subView.remove();
                }
                this.subView = new assetPhotos( {
                    model : this.model,
                    collection : this.collection,
                    posOb : this.posOb,
                    locWatcher: this.locWatcher
                });
           }
        },
        close : function() {
            console.log('clickmeheader');
            window.footerView.footer(this, 'BuildingAssetsSlide.html', {});
            if (this.subView && this.subView.close ) {
                this.subView.close();
            }
            $('#createAsset').hide();
            this.remove();
        }
    });
}
