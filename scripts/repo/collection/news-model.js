define([
	'Backbone'
  , 'repo/core'
],
	function(Backbone, Widget){
		Widget.Models.News = Backbone.Model.extend({
			setData: function(options) {
				this.set({status : this.get('status') || options.status});
				this.set({title : this.get('title') || options.title});
				this.set({date : this.get('date') || options.date});
				this.set({time : this.get('time') || options.time});
				this.set({text : this.get('text') || options.text});
				this.set({picture : this.get('picture') || options.picture});
				this.set({video : this.get('video') || options.video});
				this.set({state : ""});
			}
		});
		return Widget.Models.News;
	}
);