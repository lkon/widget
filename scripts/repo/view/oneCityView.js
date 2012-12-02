define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
  , 'repo/view/getWeather'
  , 'repo/view/oneCityFullView'
	],
	function( Backbone, Widget, util, GetWeather, oneCityFullView){

		Widget.Views.OneCityView = Backbone.View.extend({
			tagName: 'li',  // .alphabet>.city-letter>ul>li

			events:{
			'click' : 'getOneCityFullView',//'getWearther',
			'mouseover' : 'showBorder',
			'mouseout' : 'hideBorder'
			},

			initialize: function(options){
				this.model.view = this;
			},

			render: function(){
				var model = this.model
				  , getItemCity = function(model){
					  var _template = util.template('#city-item', {
							  name: model.get('name')
						  });
					 return _template;
				  }, itemCity = getItemCity(model);

				this.$el.html(itemCity);
				return this;
			},
			getOneCityFullView: function(){
				var model = this.model;

				new oneCityFullView({model:model});
			},
			showBorder: function(){
				this.$el.find('i').each(function(){
					$(this).show();
				})
			},
			hideBorder: function(){
				this.$el.find('i').each(function(){
					$(this).hide();
				})
			}

		});

		return Widget.Views.OneCityView;
	}
);