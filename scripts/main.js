requirejs.config({
	paths:{
		repo: 'repo'
	}
});

require([
	'jquery'
   ,'accordion'
   ,'Backbone'
   ,'repo/core'
   ,'repo/collection/server'
   ,'repo/view/app'
],function($, accordion, Backbone, Widget, Server, App){
	$(function() {

		$( ".accordion" ).accordion();

		Widget.newsServer = new Server;

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

		new App({model: Widget.total, collection: Widget.newsServer});

		Backbone.history.start({pushState: true, root: 'http://localhost/widget/#'});

/*		$.ajax({
			url: "http://geoinfo.rbc.ru/JSONP/" + 'getDataByClientIp/',
			dataType: 'jsonp',
			success: function(data, textStatus, jqXHR){
				console.log(data);
			}
		setTimeout(function(){
			new Widget.Views.GetWeather({url: 'russia/novosibirskaya_obl/novosibirsk'});
		}, 5000);
		});*/


	});
});