define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
	],
	function( Backbone, Widget, util){
		Widget.Views.OneNewsFullView = Backbone.View.extend({
			initialize: function(){
				this.model.view = this;
			},
			render: function(){
				var DEFAULT_IMG = 'http://pics.v2.rbctv.ru/rbctv_pics/uniora/51/13/e970689be0060f1d99d9a3a134809b42_480x360.png'
				  , model = this.model
				  , _template = util.template('#news-full', {
						  title: model.get('title'),
						  date: model.get('date'),
						  time: model.get('time'),
						  picture: model.get('picture') === undefined ? DEFAULT_IMG : model.get('picture'),
						  text: '<p>' + model.get('text') + '</p>'
					  });
				this.$el.html(_template);
			}
		});

		return Widget.Views.OneNewsFullView;
	}
);