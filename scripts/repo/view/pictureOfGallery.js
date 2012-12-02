define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
  , 'repo/view/fullView'
	],
	function( Backbone, Widget, util, FullView){

		Widget.Views.PictureOfGallery = Backbone.View.extend({
			tagName: 'div',
			className: 'accordian-data_news-pic',
			events: {
				"mouseover" : 'showChosenNews',
				"mouseleave" : 'hideChosenNews',
				"click" : 'getFullView'
			},
			initialize: function(options){
				var that = this
				  , collection = this.collection
				  , model = this.model
				  , dataId = this.model.get('dataId');

				this.model.on('change:state', function(){
					if (that.model.get('state') == 'active'){
						that.renewCaptionNode();
					}
					that.toggleActive();
				}, this);

				this.model.on('change:border', function(){
						that.displayBorder();
				}, this);
			},

			render: function(){
				var DEFAULT_IMG = 'http://pics.v2.rbctv.ru/rbctv_pics/uniora/51/13/e970689be0060f1d99d9a3a134809b42_480x360.png'
				  , _template = util.template('#news-pic', {
						picture: this.model.get('picture') === undefined ? DEFAULT_IMG : this.model.get('picture')
					})
				  ,	picture = this.$el.html(_template);

				  return picture;
			},

			toggleActive: function(){
				if (this.model.get('state') == 'active'){
					this.$el.addClass('hover');
				} else {
					this.$el.removeClass('hover');
				}
			},

			displayBorder: function(){
				var el = this.el
				  , collection = this.collection
				  , border = $(el).find('.accordian-data_news-border');

				this.hideBorder(collection);

				border.show();
			},

			hideBorder: function(collection){
				_.each(collection.models, function(model){
						model.set({border: false});
				})
			},

			showChosenNews: function(){
				this.clearView();
				this.showNewsNum();
			},

			hideChosenNews: function(){
				this.blurView();
				this.hideNewsNum();
			},

			clearView: function(){
				var visibleSet = this.collection.where({visibility:'visible'});

				util.setNonActive(visibleSet);
				this.model.set({state:'active'});
			},

			blurView: function(){
				var visibleSet = this.collection.where({visibility:'visible'});

				this.setFirstActive(visibleSet);
			},

			setFirstActive: function(obj){
				var context = '#' + this.model.get('context')
				  , liveFull = $('.accordian-data_live-full', context)
				  , elsSet = this.collection.models
				  , first = _.first(obj);

				if(liveFull.css('display') !== 'block'){
					util.setNonActive(elsSet);
					util.setActive(first);
				}
			},

			showNewsNum: function(){
				var num = this.model.get('dataId')
				  , context = $('#' + this.model.get('context')).prev()
				  , nodeNum = $('.news-number', context);

				nodeNum.html(num);
			},

			hideNewsNum: function(){
				var context = '#' + this.model.get('context')
				  , viewRegime = $(context).find('.accordian-data_live-full')
				  , headling = $(context).prev()
				  , nodeNum = $('.news-number', headling)
				  , dataId = util.getIdForActive(this.collection.models);

				if(viewRegime.css('display') !== 'block'){
					nodeNum.html(dataId);
				}
			},

			getFullView: function(event){
				var context = '#' + this.model.get('context')
				  , el = $(context).find('.accordian-data_live-full')
				  , elsSet = this.collection.models.models;

				$(context).find('.accordian-data_live').hide();
				$(context).css({'height': ''});
				$(context).find('.accordian-data_live-full').show();
				$('.widget-back').show();

				util.setNonActive(elsSet);
				util.setActive(this.model);
				new FullView({ model: this.model, el: el, context: context });
				this.showNewsNum();
			},

			title: '.accordian-data_news-title',
			date: '.accordian-data_news-date_date',
			time: '.accordian-data_news-date_time',

			getCaptionNode: function(parentNode){
				var title = $(parentNode).find(this.title)
				  , date = $(parentNode).find(this.date)
				  , time = $(parentNode).find(this.time);

				return {
					title: title,
					date: date,
					time:time
				};
			},

			renewCaptionNode:  function(){
				var context = '#' + this.model.get('context')
				  , nodes = this.getCaptionNode(context);
				if(nodes.title.length != 0){
					$(nodes.date).html(this.model.get('date'));
					$(nodes.time).html(this.model.get('time'));
					$(nodes.title).get(0).childNodes[0].data = this.model.get('title');
				}
			}
		});
		return Widget.Views.PictureOfGallery;
	}
);