define([
	'Backbone'
  , 'repo/core'
  , 'repo/util'
  , 'repo/view/pictureOfGallery'
	],
	function( Backbone, Widget, util, Picture ){
		Widget.Views.getNews = Backbone.View.extend({
			/*el = $('#daily') || $('#main') || $('#rbctv') - div with content*/

			events:{
				"click .nav-left" : 'clickPrev',
				"click .nav-right" : 'clickNext'
			},
			initialize: function(options) {

				this.currentRubric = this.defineRubric();

				var that = this
				  , collection = this.collection // Widget.newsServer
				  , server = this.options.url
				  , rubric = this.currentRubric
				  , context = this.options.context.replace(/(?:\W)(\w+)/,'$1');


				collection.create(
					{
						id: server
					},
					{
						dataType: 'jsonp',
						jsonpCallback: 'callbackWidget',
						success: function (model, response) {
							util.newsDataHandle(response, context, rubric, collection);

						}
					}
				);


				collection.last().on('newsGotten', function(){
					that.present(rubric);
				}, this);

				collection.last().on('presentComlete', function(){
					var collection = rubric.collection
					  , visibleSet = collection.where({visibility:'visible'})
					  , first = _.first(visibleSet);

					that.titleTemplate(collection, first.get('dataId'));
				});

				collection.on('changeModel', function(){
					that.render(rubric.collection);
				}, this);

				collection.on('reloadApp', function(){
					that.reloadApp();
				}, this);
			},

			reloadApp: function(){
				alert('reloadApp');
			},

			setCorrectEnding: function(number, subject, context){
				var numStr = '' + number;

				if (numStr.split('').pop() !== '1'){
					subject.html('сюжетов')
				} else {
					if($(context).hasClass('ui-accordion-content-active')){
						subject.html('сюжета')
					} else{
						subject.html('сюжет')
					}
				}
			},

			displaySelfDataId: function(){
				var that = this
				  , content = $('.ui-accordion-content')
				  , context = this.options.context
				  , newsNumber = $('.news-number', $(context).prev())
				  , newsTotal = $('.news-total', $(context).prev())
				  , subject = $('.subject', $(context).prev())
				  , from = newsNumber.next()
				  , dataId = util.getIdForActive(this.visibleSet);

				_.each(content, function(rubricBody){
					if(rubricBody.id == context.slice(1)){
						if($(rubricBody).hasClass('ui-accordion-content-active')){
							newsNumber.html(dataId).show();
							from.show();
							newsTotal.html(that.currentRubric.total);
							that.setCorrectEnding(that.currentRubric.total, subject, context);
						} else {
							newsNumber.html(dataId);
							newsTotal.html(that.currentRubric.total);
							that.setCorrectEnding(that.currentRubric.total, subject, context);
						}
					}
				})
			},

			visibleSet: [],

			getGallery: function(rubric, visibleSet){
		 		var fragment = document.createDocumentFragment()
				  , view
				  , elsSet = rubric;

				if (Widget.visible.length != 0){
					_.each(Widget.visible, function(view, index){
						delete view;
					})
					Widget.visible.length = 0;
				}


				_.each(visibleSet, function(model, index, arrayOfModels){
					view = new Picture({
								collection: rubric,
								model: model
							});
					$(fragment).append(view.render());
					Widget.visible.push(view);
				});

				util.setNonActive(elsSet);
				_.first(visibleSet).set({state: 'active'});

				return fragment;
			},

			present: function(rubric) {
				this.setLoadSignHidden();

				var collection = rubric.collection
				  , context = '#' + collection.at(0).get('context')
				  , nodeTarget = $('.accordian-data_news-gallery', context)
				  , visibleSet = collection.where({visibility:'visible'})
				  , fragment = this.getGallery(collection, visibleSet);

				nodeTarget.html(fragment);

				this.setFirstActive(visibleSet);
				this.visibleSet = visibleSet;
				this.displaySelfDataId();
				this.collection.last().trigger('presentComlete');

			},

			render: function(rubric) {

				var context = this.options.context
				  , nodeTarget = $('.accordian-data_news-gallery', context)
				  , visibleSet = this.visibleSet
				  , fragment = this.getGallery(rubric, visibleSet)
				  , newsNumber = $('.news-number', $(context).prev());

				nodeTarget.html(fragment);
				this.setFirstActive(visibleSet);
				this.displaySelfDataId();
			},

			setFirstActive: function(obj){
				var first = _.first(obj)
				  , elsSet = first.collection.collection;

				util.setNonActive(elsSet);
				util.setActive(first);
				this.displayBorder(first);
			},

			setLoadSignHidden: function(){
				$('.accordian-data_live').css('backgroundImage', 'none');
			},

			displayBorder : function(model){
				model.set({border: true});
			},

			currentRubric: {},

			defineRubric: function(){
				var rubric
				  , context = this.options.context.replace(/(?:\W)(\w+)/,'$1');

				switch (context) {
					case 'main'    : rubric = Widget.rubric.main; break;
					case 'daily'   : rubric = Widget.rubric.daily; break;
					case 'rbctv'   : rubric = Widget.rubric.rbctv; break;
					default : break;
				}
				return rubric;
			},

			titleTemplate : function(collection, dataId){
				var context = '#' + collection.at(0).get('context')
				  , parentNode = $('.accordian-data_news-text', context)
				  ,	model = util.getModelRequredDataId(collection, dataId)
				  , _template = util.template('#news-title', {
						  title: model.get('title'),
						  date: model.get('date'),
						  time: model.get('time')
					  });
				parentNode.html(_template);
			},

			clickPrev: function(){
				var rubric = this.currentRubric
				  , elsSet = rubric.collection
				  , visibleSet = this.visibleSet
				  , dataIdFirst = _.first(visibleSet).get('dataId')
				  , min = elsSet.first().get('dataId') //1
				  , max = elsSet.last().get('dataId')	//9
				  , requredDataIdPrev = (dataIdFirst == min) ? max : dataIdFirst - 1
				  , prevModel = util.getModelRequredDataId(elsSet, requredDataIdPrev);

				prevModel.set({visibility: "visible"});
				visibleSet.unshift(prevModel);

				_.last(visibleSet).set({visibility: "hidden"});
				visibleSet.pop(_.last(visibleSet));

				this.visibleSet = visibleSet;

				this.collection.trigger('changeModel');
			},
			clickNext: function(){
				var rubric = this.currentRubric
				  , elsSet = rubric.collection
				  , visibleSet = this.visibleSet
				  , dataIdLast = _.last(visibleSet).get('dataId')
				  , min = elsSet.first().get('dataId')
				  , max = elsSet.last().get('dataId')
				  , requredDataIdNext = (dataIdLast == max) ? min : dataIdLast + 1
				  , nextModel = util.getModelRequredDataId(elsSet, requredDataIdNext);

				nextModel.set({visibility: "visible"});
				visibleSet.push(nextModel);

				_.first(visibleSet).set({visibility: "hidden"});
				visibleSet.shift(_.first(visibleSet));

				this.visibleSet = visibleSet;

				this.collection.trigger('changeModel');
			}
		});

		return Widget.Views.getNews;
	}
);
