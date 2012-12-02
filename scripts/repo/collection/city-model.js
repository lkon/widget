define([
	'Backbone'
  , 'repo/core'
	],
	function(Backbone, Widget){

		Widget.Models.City = Backbone.Model.extend({
			setData: function(options) {
				this.set({name : this.get('name') || options.name});
				this.set({server : this.get('server') || options.server});
			}
		});

		return Widget.Models.City;
	}
);