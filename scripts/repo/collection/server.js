define(['Backbone'],
	function(Backbone){
		Widget.Collections.newsServer = Backbone.Collection.extend({
			url: 'http://static.feed.rbc.ru/rbc/export/lg'
		});

		return Widget.Collections.newsServer;
	}
);



