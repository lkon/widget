define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
  , 'repo/view/getWeather'
	],
	function( Backbone, Widget, util, getWeather){
		Widget.Views.CityFullView = Backbone.View.extend({
			initialize: function(options){


				  //, server = this.model.get('server');
				//new GetWeather({model: model, url: server});
			},

			render: function(){

			}
		});

		return Widget.Views.CityFullView;
	}
);