define([
	'Backbone'
  , 'repo/core'
  , 'repo/collection/city-model'
	],
	function(Backbone, Widget, CityModel){

		Widget.Collections.City = Backbone.Collection.extend({
			model: CityModel,

			initialize: function(){
	    		this.comparator = function(city){
					return city.get('name');
				};
	    	}
		});

		return Widget.Collections.City;
	}
);