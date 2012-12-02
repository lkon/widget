define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
  , 'repo/view/oneNewsFullView'
  , 'repo/view/tvFullView'
	],
	function( Backbone, Widget, util, OneNewsFullView, TvFullView ){

		Widget.Views.FullView = Backbone.View.extend({
			/* el = accordian-data_live-full*/
			events: {
				"click .nav-left-full" : 'getPrevFull',
				"click .nav-right-full" : 'getNextFull',
				"click .nav-up-full" : 'getUpFull',
				"click .nav-down-full" : 'getDownFull',
				"click .nav-up-full.tvnav" : 'getTVUpFull',
				"click .nav-down-full.tvnav" : 'getTVDownFull'
			},

			initialize: function(options){
				var that = this
				  , dataId = this.model.get('dataId')
				  , collection = this.model.collection
				  , model = this.model
				  , context = this.options.context;

				this.render(model, context);
				Widget.context = context;
			},

			render: function(model, context){
				var el = $(context).find('.accordian-data_live-text')
				  , elsSet = model.collection.models
				  , view;

				if(context !== "#rbctv"){
					view = new OneNewsFullView({model: model, el: el});
					this.$el.html(view.render());
				} else{
					view = new TvFullView({model: model, el: el});
					this.$el.html(view.render());
				}
				util.setNonActive(elsSet);
				util.setActive(model);
				this.showNewsNum(model);
			},

			showNewsNum: function(model){
				var num = model.get('dataId')
				  , context = $('#' + model.get('context')).prev()
				  , nodeNum = $('.news-number', context);

				nodeNum.html(num);
			},

			getPrevFull: function(){
				var collection = this.model.collection
				  , min = collection.first().get('dataId') //1
				  , max = collection.last().get('dataId')	//9
				  , currentModel = util.getActive(collection)
				  ,	currentModelDataId = currentModel.get('dataId')
				  , prevModelDataId = (currentModelDataId == min) ? max : (currentModelDataId - 1)
				  , prevModel = util.getModelRequredDataId(collection, prevModelDataId)
				  , context = '#' + this.model.get('context');

				this.render(prevModel, context);
			},

			getNextFull: function(){
				var collection = this.model.collection
				  , min = collection.first().get('dataId')
				  , max = collection.last().get('dataId')
				  , currentModel = util.getActive(collection)
				  ,	currentModelDataId = currentModel.get('dataId')
				  , nextModelDataId = (currentModelDataId == max) ? min : (currentModelDataId + 1)
				  , nextModel = util.getModelRequredDataId(collection, nextModelDataId)
				  , context = '#' + this.model.get('context');

				this.render(nextModel, context);
			},

			getUpFull : function(){
				var context = Widget.context
				  , content
				  , position
				  , SCROLL_STEP = 40;

				if(context !== "#rbctv"){
					content = $(context).find('.accordian-data_news-info');
					position = $(content).scrollTop();
					content.scrollTop(position - SCROLL_STEP);
				}
			},

			getDownFull: function(){
				var context = Widget.context
				  , content
				  , position
				  , SCROLL_STEP = 40;

				if(context !== "#rbctv"){
					content = $(context).find('.accordian-data_news-info');
					position = $(content).scrollTop();
					content.scrollTop(position + SCROLL_STEP);
				}
			},

			getTVUpFull : function(){
				var context = Widget.context.slice(1)
				  ,	collection = Widget.rubric[context].collection
				  , min = collection.first().get('dataId')
				  ,	max = collection.last().get('dataId')
				  , currentModel = util.getActive(collection)
				  ,	currentModelDataId = currentModel.get('dataId')
				  , VISIBILITY_STEP = 2
				  , modelToHide
				  , modelToHideDataId = currentModelDataId - VISIBILITY_STEP
				  ,	prevModelDataId = (currentModelDataId == max) ? false : (currentModelDataId + 1)
				  , prevModel;

				if(prevModelDataId){
					prevModel = util.getModelRequredDataId(collection, prevModelDataId);

					currentModel.set({state: ''});
					util.setActive(prevModel);
					this.showNewsNum(prevModel);

					if(modelToHideDataId > 0){
						modelToHide = util.getModelRequredDataId(collection, modelToHideDataId);
						modelToHide.set({display: 'none'});
						modelToHide.trigger('displayNone');
					}
				}
			},

			getTVDownFull: function(){
				var context = Widget.context.slice(1)
				  ,	collection = Widget.rubric[context].collection
				  ,	min = collection.first().get('dataId')
				  ,	max = collection.last().get('dataId')
				  , currentModel = util.getActive(collection)
				  ,	currentModelDataId = currentModel.get('dataId')
				  , VISIBILITY_STEP = 2
				  ,	nextModelDataId = (currentModelDataId == min) ? false : (currentModelDataId - 1)
				  , nextModel
				  , modelToShow
				  , modelToShowDataId = nextModelDataId - VISIBILITY_STEP;

				if(nextModelDataId){
					nextModel = util.getModelRequredDataId(collection, nextModelDataId);

					currentModel.set({state: ''});
					util.setActive(nextModel);
					this.showNewsNum(nextModel);

					if(modelToShowDataId > 0){
						modelToShow = util.getModelRequredDataId(collection, modelToShowDataId);
						modelToShow.set({display: 'block'});
						modelToShow.trigger('displayBlock');
					}
				}
			}

		});
		return Widget.Views.FullView;
	}
);