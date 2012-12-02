define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
  , 'repo/collection/city-model'
  , 'repo/collection/city-collection'
  , 'repo/view/character'
	],
	function( Backbone, Widget, util, CityModel, CityCollection, Getchar){

		Widget.Views.GetCity = Backbone.View.extend({
			el : $('.weather-popup'),

			events: {

			},

			initialize: function(options) {
				var that = this
				  , collection = this.collection //Widget.newsServer
				  , server = options.url
				  , charObject;


				collection.create(
					{
						id: server
					},
					{
						dataType: 'jsonp',
						jsonpCallback: 'callbackGetCitiesAll',
						success: function (model, response) {
							charObject = that.getCityCollections(response);
							that.collection.last().trigger('citiesGotten');
						}
					}
				);

				collection.last().on('citiesGotten', function(){
					that.render(charObject);
				}, this);
/* ???????????????????????????????????????????????????????????????????????????????????*/
				collection.last().on('CapitalCreated', function(){
					this.$el.show();
				}, this);

				collection.last().on('', function(){
					this.$el.hide();
				}, this);
/* ???????????????????????????????????????????????????????????????????????????????????*/

			},

			render: function(charObject){
				var $letterList = this.$('.letter-list ul')
				  ,	$citiesList = this.$('.city-letter')
				  , citiesListHeight = $citiesList.height()
				  , character
				  , list = _.toArray(charObject)
				  , sortCharObject = function(a, b){
				  		var a = a.at(0).get('name').slice(0,1).toLowerCase()
					      , b = b.at(0).get('name').slice(0,1).toLowerCase();

					    if ( a < b ) {
					        return -1;
					    } else if ( a > b ) {
					        return 1;
					    } else return 0;
				  }
				  , frag = document.createDocumentFragment();

				list.sort(sortCharObject);

				_.each(list, function(collection, index, list){
					character = new Getchar({collection: collection, $citiesList: $citiesList});
					$(frag).append(character.render());
				});
				/**
				 * убираем лишнюю высоту списка городов $citiesList
				 */
				$citiesList.css({'marginTop': - citiesListHeight});
				$letterList.html(frag);

				this.collection.last().trigger('CapitalCreated');
			},

			getCityCollections: function(data){
				var city
				  , capitals = new CityCollection
				  , character; /*литера*/

				_.each(data, function(object){
					city = new CityModel;
					_.each(object, function(value, key, town){
						switch (key) {
							case 'name_rus':
								city.setData({name: town[key]}, {silent: true});
	 							 if (  town[key] == 'Москва'
							        || town[key] == 'Санкт-Петербург'
							        || town[key] == 'Астана'
							        || town[key] == 'Владивосток'
							        || town[key] == 'Волгоград'
							        || town[key] == 'Воронеж'
							        || town[key] == 'Екатеринбург'
							        || town[key] == 'Ижевск'
							        || town[key] == 'Иркутск'
							        || town[key] == 'Казань'
							        || town[key] == 'Калининград'
							        || town[key] == 'Кемерово'
							        || town[key] == 'Киев'
							        || town[key] == 'Кишинев'
							        || town[key] == 'Краснодар'
							        || town[key] == 'Красноярск'
							        || town[key] == 'Лондон'
							        || town[key] == 'Минск'
							        || town[key] == 'Мюнхен'
							        || town[key] == 'Нижний Новгород'
							        || town[key] == 'Новосибирск'
							        || town[key] == 'Нью-Йорк'
							        || town[key] == 'Омск'
							        || town[key] == 'Пермь'
							        || town[key] == 'Рига'
							        || town[key] == 'Ростов-на-Дону'
							        || town[key] == 'Самара'
							        || town[key] == 'Саратов'
							        || town[key] == 'Томск'
							        || town[key] == 'Уфа'
							        || town[key] == 'Франкфурт'
							        || town[key] == 'Ханты-Мансийск'
							        || town[key] == 'Челябинск' ) {

							        city.set({capital: true}, {silent: true});
							        capitals.add(city,{silent:true});
							     } else {
								    character = town[key].slice(0,1).toLowerCase();
								    Widget.weather.charObject[character] = Widget.weather.charObject[character] ||  new CityCollection;
								    Widget.weather.charObject[character].add(city,{silent:true});
							     }
								break;
							case 'nick':
								city.setData({server: town[key]}, {silent: true});
								break;
							default : break;
						}
					});
				});
				Widget.weather.capitals = capitals;
				return Widget.weather.charObject;
			}
		});

		return Widget.Views.GetCity;
	}
);