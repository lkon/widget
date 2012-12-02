define([
	'Backbone'
	],
	function(Backbone){
		Widget.Models.Weather = Backbone.Model.extend({
			setData: function(options) {
				this.set({alias : this.get('alias') || options.alias});
				this.set({name : this.get('name') || options.name});
				this.set({temp : this.get('temp') || options.temp});
				this.set({phenomenon_descr : this.get('phenomenon_descr') || options.phenomenon_descr});
				this.set({humidity : this.get('humidity') || options.humidity});
				this.set({wind : this.get('wind') || options.wind});
				this.set({day0 : this.get('day0') || options.day0});
				this.set({day1 : this.get('day1') || options.day1});
				this.set({day2 : this.get('day2') || options.day2});
				this.set({day3 : this.get('day3') || options.day3});
			}
		});
		return Widget.Models.Weather;
	}
);