define([
	'Backbone'
  , 'repo/core'
  , 'repo/collection/weather'
	],
	function( Backbone, Widget, Weather){

		Widget.Views.GetWeather = Backbone.View.extend({
			el: $('#weather'),

			events: {

			},

			initialize: function(options) {
				var that = this
				  , WEATHER_SERVER = 'http://geoinfo.rbc.ru/JSONP/getDataByZone/?nick='
				  , cityUrl = options.url
				  , model = this.model
				  , storeWeatherData;

				model.fetch(
					{
						url: WEATHER_SERVER + cityUrl,
						dataType: 'jsonp',
						success: function (model, response) {
							storeWeatherData = that.getWeartherModel(response);
							//model.trigger('weartherGotten');
							model.collection.trigger('resetWeatherView');
						}
					}
				);
			},

			getWeartherModel: function(data){
				var townWeather
				  , conditions;

				_.each(data, function(town){
					townWeather = new Weather;
					_.each(town, function(value, key, town){
						switch (key) {
							case 'alias'   : townWeather.setData({alias: town[key]}, {silent: true}); break;
							case 'name'    : townWeather.setData({name: town[key]}, {silent: true}); break;
							case 'weather' :
								conditions = town[key];
								_.each(conditions, function(value, key, conditions){
									switch (key) {
										case 'temp' : townWeather.setData({temp: conditions[key]}, {silent: true}); break;
										case 'phenomenon_descr'  : townWeather.setData({phenomenon_descr: conditions[key]}, {silent: true}); break;
										case 'humidity'   : townWeather.setData({humidity: conditions[key]}, {silent: true}); break;
										case 'wind'    : townWeather.setData({wind: conditions[key]}, {silent: true}); break;
										case 'day0'   : townWeather.setData({day0: conditions[key]}, {silent: true}); break;
										case 'day1'   : townWeather.setData({day1: conditions[key]}, {silent: true}); break;
										case 'day2'   : townWeather.setData({day2: conditions[key]}, {silent: true}); break;
										case 'day3'   : townWeather.setData({day3: conditions[key]}, {silent: true}); break;
										default : break;
									}
								});
							default : break;
						}
					});
				});
				return townWeather;
			}

		});

		return Widget.Views.GetWeather;
	}
);