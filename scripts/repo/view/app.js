define(
	[
		'jquery'
	  , 'Backbone'
   	  , 'repo/core'
   	  , 'repo/collection/news-collection'
   	  , 'repo/view/getNews'
   	  , 'repo/view/getCity'
   	  , 'repo/router/router'
	],
	function( $, Backbone, Widget, News, GetNews, GetCity, controller ){
		Widget.Views.App = Backbone.View.extend({
			el: $('.content'),

			events: {
				'click .widget-reload' : 'reloadApp',
				'click .widget-back' : 'backToRubrics',
				'click .nav-up' : 'scrollRubricUp',
				'click .nav-down' : 'scrollRubricDown',
				'click .ui-accordion-header' : 'setRubricActive'
			},

			initialize: function(options){
				var that = this
				  , total = this.model  // Widget.total
				  ,	collection = this.collection // Widget.newsServer
				  ,	index = this.index
				  , sources = [
					  {main: 'top_rbc_ru.json'},
					  {daily: 'daily.json'},
					  {rbctv: 'archive.json'},
					  {weather: 'getCitiesCount.json'}
				  ], defineConditions = function(){
				  		var index = that.index
						  , server = sources[index]
						  , context
						  , url;

						if(that.index < sources.length){
							_.each(server, function(value, key, server){
								context = key;
								url = value;
							});
							that.index = index + 1;
						} else {
							that.index = 0;
						}
						return {
							context: context,
							url: url
						};
				  };

				/**
				 * get data total
				 */
				this.model.fetch(
					{
						dataType: 'jsonp',
						jsonpCallback: 'callbackWidgetTotal',
						success: function (model, response) {
							that.showTotal(response);
							that.model.set({main_load: true});
						}
					}
				);

				this.model.on('change:main_load', function(){
					if (that.model.has('main_load')){
						var conditions = defineConditions();
						that.loadData(collection, conditions.context, conditions.url);
						setTimeout(function(){
							that.model.set({daily_load: true});

						}, 1000);
					}
				});

				this.model.on('change:daily_load', function(){
					if (that.model.has('daily_load')){
						var conditions = defineConditions();
						that.loadData(collection, conditions.context, conditions.url);
						setTimeout(function(){
							that.model.set({rbctv_load: true});
						}, 2000);
					}
				});

				this.model.on('change:rbctv_load', function(){
					if (that.model.has('rbctv_load')){
						var conditions = defineConditions();
						that.loadData(collection, conditions.context, conditions.url);
						setTimeout(function(){
							that.model.set({weather_load: true});
						}, 3000);
					}
				});

				this.model.on('change:weather_load', function(){
					if (that.model.has('weather_load')){
						var conditions = defineConditions();
						that.loadCity(collection, conditions.context, conditions.url);
					}
				});

				collection.on('reloadForOneRubricComplete', function(){
					that.reloadData(collection, index);
				});

				this.showReloadBtn();
				this.showDate.init();
				this.showDate.renew();
			},

			showTotal:function(object){
				var that = this
				  , rubricSet = that.parseTotal(object)
				  , total;
				_.each(rubricSet, function(value, key, rubricSet){
					_.each(value, function(val, k, value){
						if(k == 'total')
						total =	 val;
					});

					that.insertTotal(key, total);
				});
			},

			parseTotal: function(data){
				_.each(data, function(value, key, data){
					Widget.rubric[key] = Widget.rubric[key] || {};
					Widget.rubric[key].total = value;
				});

				return Widget.rubric;
			},

			insertTotal: function(name, total){
				var that = this
				  , context = that.$('.' + name)
				  , newsTotal = $('.news-total', context)
				  , subject = $('.subject', context);

				newsTotal.html(total);
				that.setCorrectEnding(total, subject);
			},

			setCorrectEnding: function(number, subject){
				var numStr = '' + number;

				if (numStr.split('').pop() !== '1'){
					subject.html('сюжетов')
				} else {
					subject.html('сюжет')
				}
			},

			loadData: function(collection, context, url){
				var that = this;

			  	Widget.rubric[context].collection = {};
			  	Widget.rubric[context].collection = new News();
			  	Widget.getData[context] = new GetNews({
					el: $('#' + context),
					collection: collection, //Widget.newsServer
					url: url,
					context: '#' + context
				})
			},
			loadCity: function(collection, context, url){
				var that = this;

			  	Widget.getData[context] = new GetCity({
					collection: collection, //Widget.newsServer
					url: url
				});
			},
		/*	loadData: function(collection){
				var that = this
				  , sources = [
					  {main: 'top_rbc_ru.json'},
					  {daily: 'daily.json'},
					  {rbctv: 'archive.json'}
				  ], TIMEOUT_NEWS_LOAD = 500
				  , index = this.index
				  , getNews = function(context, url){


				  	*//************************************************************************************************//*
					  	Widget.rubric[context] = new Widget.Collections.News();
					  	Widget.getData[context] = new Widget.Views.getNews({
							el: $('#' + context),
							collection: collection, //Widget.newsServer
							url: url,
							context: '#' + context
						});
				  }, loadForOne = function(){
				  		var server = sources[index];
				  		for (var type in server){
				  			getNews(type, server[type]);
				  		}
				  }, letContinue = function(){
						that.index = index + 1;
						if(that.index < sources.length){
							that.collection.trigger('loadForOneRubricComplete');
						} else {
							that.index = 0;
						}
				  };
				setTimeout(function(){
					loadForOne();
					letContinue();
				}, TIMEOUT_NEWS_LOAD);
			},*/

			defineContext: function(server){
				var context
				  , _server = server.replace(/(\w+)(?:\.(.+))/,'$1');

				switch (_server) {
					case 'top_rbc_ru' : context = 'main'; break;
					case 'daily'      : context = 'daily'; break;
					case 'archive'    : context = 'rbctv'; break;
					case 'getCitiesCount': context = 'weather'; break;
					default : break;
				}
				return context;
			},

			index: 0,
		/*
			reloadData: function(collection){

				var that = this
				  ,	elsSet = collection.models
				  , index = this.index
				  , TIMEOUT_NEWS_RELOAD = 500
				  , fetch = function(){
				  		var context = that.defineContext(elsSet[index].id)
				  		  , rubric = Widget.rubric[context]
						  , collectionFromServer = Widget.getData[context].collection;
						elsSet[index].fetch({
							dataType: 'jsonp',
							jsonpCallback: 'callbackWidget',
							success: function (model, response) {
								Widget.util.newsDataHandle(response, context, rubric, collectionFromServer);
							}
						});
				  }, letContinue = function(){
						that.index = index + 1;
						if(that.index < elsSet.length){
							that.collection.trigger('reloadForOneRubricComplete');
						} else {
							that.index = 0;
						}
				  };
				setTimeout(function(){
					fetch();
					letContinue();
				}, TIMEOUT_NEWS_RELOAD);
			},*/

			reloadApp: function(){
				var collection = this.collection;
				/*this.reloadData(collection);*/
				collection.trigger('reloadApp');
				this.resetFullView();
				this.hideReloadBtn();
			},

			openGalleryForFirstRubric: function(e){
				$('.ui-accordion-header:first').trigger('click');
			},

			setRubricActive: function(e){
				e.stopPropagation();
				this.resetFullView(e);
				this.displayRubricFirst(e);
				this.hideBackBtn();
				this.checkRoute(e);
			},

			setFirstActive: function(e){
				var context
				  , collection
				  , elsSet
				  , visibleSet;

				if(Widget.context !== ''){
					context = Widget.context.slice(1);
				} else if ( $(e.target).hasClass('ui-accordion-header') ){
					context = $(e.target).attr('aria-controls');
				} else if(  e.target.nodeName.toLowerCase() == 'a'
						 && $(e.target).parent().hasClass('ui-accordion-header')) {
					context = $(e.target).parent().attr('aria-controls');
				}
				if(context){
				    collection =  Widget.rubric[context].collection;
				    elsSet = collection.models;
				    visibleSet = collection.where({visibility:'visible'});

					Widget.util.setNonActive(elsSet);
					Widget.util.setActive(_.first(visibleSet));
				}
			},

			resetFullView: function(){
				_.each( $('.accordian-data_live-full'), function(el, index, elsSet){
						$(el).css('display') === 'none' ? true : $(el).hide();
					}
				);
				_.each( $('.accordian-data_live'), function(el, index, elsSet){
						$(el).css('display') === 'block' ? true : $(el).show();
					}
				);
			},

			backToRubrics:function(e){
				this.resetFullView();
				this.setFirstActive(e);
				$('.widget-back').hide();
			},

			scrollRubricUp: function(e){
				var app = $('.accordion')
				  , fragment = document.createDocumentFragment()
				  , head = app.find('h3:first')
				  , body = head.next();

				app.append($(fragment).append(head).append(body));

				this.openGalleryForFirstRubric(e);
			},
			scrollRubricDown: function(e){
				var app = $('.accordion')
				  , fragment = document.createDocumentFragment()
				  , head = app.find('h3:last')
				  , body = head.next();

				app.find('h3:first').before($(fragment).append(head).append(body));

				this.openGalleryForFirstRubric(e);
			},

			displayRubricFirst: function(e){
				var app = $('.accordion')
				  , fragment = document.createDocumentFragment()
				  , head
				  , body
				  , context
				  , shiftRubric = function(event){
					 	if(!( (event.target == $('h3:first').get(0))
					 	      ||($(event.target).parent().get(0) == $('h3:first').get(0)) )){

							head = (e.target.nodeName.toLowerCase() == 'a') ? $(event.target).parent() : event.target;
							body = $(head).next().get(0);

							app.find('h3:first').before($(fragment).append(head).append(body));
					 	}
				  };

				if ( $(e.target).hasClass('ui-accordion-header') ){

					context = e.target;
					this.showSubjectNum(context);
					shiftRubric(e);

				} else if(  e.target.nodeName.toLowerCase() == 'a'
						 && $(e.target).parent().hasClass('ui-accordion-header')) {

					context = $(e.target).parent();
					this.showSubjectNum(context);
					shiftRubric(e);

				}
				context = app.find($('h3:not(:first)'));
				this.hideSubjectNum(context);
			},

			showSubjectNum: function( context ){
				var newsNumber = $('.news-number', context)
				  ,	from = newsNumber.next();

				newsNumber.show();
				from.show();
			},

			hideSubjectNum: function( context ){
				var newsNumber = $('.news-number', context)
				  ,	from = newsNumber.next();

				newsNumber.hide();
				from.hide();
			},

			showReloadBtn: function(){
				var TIMEOUT_RELOAD_BTN_SHOW = 20000;
				setTimeout(function(){
					$('.widget-reload').show();
				}, TIMEOUT_RELOAD_BTN_SHOW);
			},

			hideReloadBtn: function(){
				$('.widget-reload').hide();
				this.showReloadBtn();
			},

			hideBackBtn: function(){
				$('.widget-back').hide();
			},

			showDate: (function(){
				var setTime = function(){
					var today = new Date()
					  , day = today.getDay()
					  , data = '' + today.getDate()
					  , month = today.getMonth()
					  , year = '' + today.getFullYear()
					  , hour = '' + today.getHours()
					  , minute = ('' + today.getMinutes()).length == 1 ? '0' + today.getMinutes() : today.getMinutes()
					  , days = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС']
					  , cntMonth = (month + 1) + ''
					  , cntYear = year.slice(2)
					  , cntDay = days[day-1];


					$('.header-clock').find('.header-clock-time').html(hour+':'+minute)
						.end().find('.header-clock-date').html(data+'.'+cntMonth+'.'+cntYear)
						.end().find('.header-clock-day').html(cntDay)
						.end().show();
				};

				return {
					init: setTime,
					renew: function(){
						setInterval(setTime, 1000);
					}
				};
			}()),

			checkRoute: function(e){
				var page;

				e.stopPropagation();

				if ( $(e.target).hasClass('ui-accordion-header') ){
					page = $(e.target).children().last().attr('href').slice(3);
				} else if(  e.target.nodeName.toLowerCase() == 'a'
						 && $(e.target).parent().hasClass('ui-accordion-header')) {
					page = $(e.target).attr('href').slice(3);
				}
				switch (page){
					case 'daily': controller.navigate('daily', {trigger: true}); break;
					case 'main': controller.navigate('main', {trigger: true}); break;
					case 'rbctv': controller.navigate('rbctv', {trigger: true}); break;
				}
			}

		});
		return Widget.Views.App;
	}
);
