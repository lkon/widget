define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
	],
	function( Backbone, Widget, util){

		Widget.Views.OneTvNewsFullView = Backbone.View.extend({
			tagName: 'li',

			events:{
				"click" : 'userChoice'
			},

			initialize: function(){
				var that = this;

				this.model.view = this;

				this.model.on('change:state', function(){
					that.setActiveClassName();
					that.showVideo();
				}, this);

				this.model.on('displayBlock', this.displayBlock, this);

				this.model.on('displayNone', this.displayNone, this);

				this.render();
			},

			render: function(){
				var model = this.model
				  , getItemTVNews = function(model){
					  var _template = util.template('#tv-item', {
							  title: model.get('title'),
							  date: model.get('date'),
							  time: model.get('time')
						  });
					 return _template;
				  }, itemTVNews = getItemTVNews(model);

				this.$el.html(itemTVNews);
				if(model.get('status') == 'now'){
					this.$el.addClass('live-st');
				}
				this.$el.css({'display': 'none'});
				return this.el;
			},

			setActiveClassName: function(){
				var $el = this.$el
				  , model = this.model
				  , context = '#' +  this.model.get('context')
				  , liveFull = $('.accordian-data_live-full', context);

				if (liveFull.css('display') == "block"){
					if(model.get('state') == 'active'){
						$el.siblings().each(function(index, el){
							$(el).removeClass('active');
						});
						$el.addClass('active');
					}
				}
			},

			displayBlock: function(){
				this.$el.css('display', 'block');
			},

			displayNone: function(){
				this.$el.css('display', 'none');
			},

			showVideo: function(){
				var model = this.model
				  , video = $('#tv-video object')
				  , src = model.get('video');

				video.attr({'data': src});
			},

			userChoice: function(){
				var model = this.model
				  , elsSet = model.collection.models;

				util.setNonActive(elsSet);
				util.setActive(model);
				this.showNewsNum(model);

				this.hideNews(model);
			},

			hideNews: function(model){
				var elsSet = model.collection.models
				  , dataId = model.get('dataId')
				  , VISIBILITY_STEP = 2
				  , threshold = dataId - VISIBILITY_STEP;

				_.each(elsSet, function(model){
					if (model.get('dataId') < threshold ){
						model.set({display: 'none'});
						model.trigger('displayNone');
					}
				});

			},

			showNewsNum: function(model){
				var num = model.get('dataId')
				  , context = $('#' + model.get('context')).prev()
				  , nodeNum = $('.news-number', context);

				nodeNum.html(num);
			}

		});

		return Widget.Views.OneTvNewsFullView;
	}
);