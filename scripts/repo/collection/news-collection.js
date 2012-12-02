define([
	'Backbone'
  , 'repo/core'
  , 'repo/collection/news-model'
],
	function( Backbone, Widget, NewsModel ){

		Widget.Collections.News = Backbone.Collection.extend({
			model: NewsModel
		});

		return Widget.Collections.News;
	}
);