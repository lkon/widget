define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
  , 'repo/view/oneTvNewsFullView'
	],
	function( Backbone, Widget, util, OneTvNewsFullView){
		Widget.Views.TvFullView = Backbone.View.extend({
			initialize: function(){
				var that = this
				  , model = this.model
				  , collection = this.model.collection;

				collection.on('tvFullViewComplete', function(){
					var collection = Widget.rubric.rbctv.collection
					  , elsSet = collection.models
					  , dataId = util.getIdForActive(elsSet)
					  , model = util.getModelRequredDataId(collection, dataId);

					model.view.$el.addClass('active');
				})
			},

			render: function(){
				var model = this.model
				  ,	collection = this.model.collection
				  , currentModel =  this.options.currentModel
				  , fragment = document.createDocumentFragment()
				  , itemTVNews
				  , PREV_VISIBLE = 2
				  , dataIdActive = model.get('dataId')
				  , dataIdCurrent
				  , getTVNews = function(model){
					  var _template = util.template('#tv-full', {
							  video: model.get('video')
						  });
					 return _template;
				  }(model);

				_.each(collection.models, function(model){
					dataIdCurrent = model.get('dataId');
					itemTVNews = new OneTvNewsFullView({model: model, currentModel: currentModel});

					if(dataIdCurrent >= dataIdActive - PREV_VISIBLE){
						itemTVNews.model.set({display: 'block'});
						itemTVNews.model.trigger('displayBlock');
					}

					$(fragment).prepend(itemTVNews.el);
				})

				this.$el.html(getTVNews);
				this.$el.find('ul').html(fragment);

				collection.trigger('tvFullViewComplete');
			}
		});

		return Widget.Views.TvFullView;
	}
);