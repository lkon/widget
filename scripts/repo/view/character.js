define(['Backbone', 'repo/core', 'repo/util', 'repo/view/oneCityView'],
function( Backbone, Widget, util, OneCityView){
	Widget.Views.GetChar = Backbone.View.extend({
		tagName: 'li', // .alphabet>.letter-list>ul>li
		events:{
			'click' : 'showCitiesList',
			'mouseover' : 'showBorder',
			'mouseout' : 'hideBorder'
		},
		initialize: function(options){
			var that = this
			  , collection = that.collection; // Widget.weather.charCollection[_'char']

/* ???????????????????????????????????????????????????????????????????????????????????*/
			collection.on('resetWeatherView', function(){
				console.log('weartherGotten trigger resetWeatherView')
			}, this);
/* ???????????????????????????????????????????????????????????????????????????????????*/
		},
		render: function(){
			var that = this
			  , collection = that.collection
			  , capital = collection.at(0).get('name').slice(0,1)//заглавная буква
			  , template = util.template('#character-item', {
			  		char: capital
			  });
			this.$el.html(template);
			return this.el;
		},
		showCitiesList: function(){
			var that = this
			  , $citiesList = that.options.$citiesList.empty() // div.city-letter
			  , collection = that.collection // [models]
			  , LIST_NUM = 6
			  , limite = Math.ceil(collection.length/LIST_NUM)
			  , city
			  , $frag = $(document.createDocumentFragment());

			$citiesList.css({'marginTop': ''});

			collection.forEach(function(model, index){
				if(index % limite == 0){
					city = new OneCityView({model: model});
					$frag.append('<ul>').children().last().append(city.render().el);
				} else {
					city = new OneCityView({model: model});
					$frag.children().last().append(city.render().el);
				}
			});
			$citiesList.append($frag.get(0));
		},
		showBorder: function(){
			this.$el.find('i').each(function(){
				$(this).show();
			})
		},
		hideBorder: function(){
			this.$el.find('i').each(function(){
				$(this).hide();
			})
		}
	});

	return Widget.Views.GetChar;
}
);