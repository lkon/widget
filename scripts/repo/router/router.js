define([
		'Backbone'
	],
	function(Backbone){
		var Loader = Backbone.Router.extend({
			routes: {
				'': 'start',
				'daily': 'daily',
				'main': 'main',
				'rbctv': 'rbctv'
			},

			start: function(){
				console.log('start');
			},
			daily: function(){
				this.showOneRubric('daily');
			},
			main: function(){
				this.showOneRubric('main');
			},
			rbctv: function(){
				this.showOneRubric('rbctv');
			},
			showOneRubric: function(rubric){
				$('.' + rubric).trigger('click');
			}
		})
		  , controller = new Loader();

	  return controller;
	}
);