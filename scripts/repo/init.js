define([
	'jquery'
   ,'Backbone'
   , ''
],function($, Backbone){

	$(function() {
		$( ".accordion" ).accordion();

		Widget.newsServer = new Widget.Collections.newsServer;

		Widget.Models.getTotal = Backbone.Model.extend({
			urlRoot: Widget.newsServer.url,
			parse: function(response){
				var dataTotal = {};
				_.each(response, function(value, key, response){
					dataTotal[key] = value;
					dataTotal[key + '_load'] = null;
				});
				return dataTotal;
			}
		});
		Widget.total = new Widget.Models.getTotal({
			id: 'total.json'
		});

		new Widget.Views.App({model: Widget.total, collection: Widget.newsServer});
	});

});
/*	$.ajax({
		url: 'http://geoinfo.rbc.ru/JSONP/getDataByZone/?nick=' + 'russia/novosibirskaya_obl/novosibirsk',
		dataType: 'jsonp',
		success: function(data, textStatus, jqXHR){
			handle(data);
		}
	});*/
/*http://geoinfo.rbc.ru/JSONP/getDataByZone/?nick=russia/novosibirskaya_obl/novosibirsk&callback=*/
/*
	setTimeout(function(){
		new Widget.Views.GetCity({collection: Widget.newsServer, url: 'getCitiesCount.json'})
	}, 2000);

	setTimeout(function(){
		new Widget.Views.GetWeather({url: 'russia/novosibirskaya_obl/novosibirsk'});
	}, 5000);*/