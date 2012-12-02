var getModelRequredDataId = function(collection, dataId){
	var isGet = false
	  , clone;
	_.each(collection.models, function(model){
		_.each(model.attributes, function(value, key){
			if(!isGet){
				if( key === 'dataId' ){
					if (value === dataId) {
						clone =  model.clone();
						isGet = true;
					}
				}
			}
		});
	});
	return clone;
};

var getModelActive = function(collection){
	var dataId;
	_.each(collection.models, function(model){
		_.each(model.attributes, function(value, key){
			if(key === 'state' && model.attributes[key])
				dataId = model.attributes['dataId'];
		});
	});
	return dataId;
};

var setNonActive = function(collection){
	_.each(collection.models, function(model){
		_.each(model.attributes, function(value, key){
			model.set({state: ''});
		});
	});
};

var template = function(tpl, props) {
	return  _.template($(tpl).html(), props);
};

var galleryTemplate = function(collection, dataId){
	var model = getModelRequredDataId (collection, dataId)
	  , _template = template(/*html-������ � ���������� �������, ������������ � html-����*/'#news-pic', {picture: model.attributes['picture']});
	  return _template;
};

var titleTemplate = function(collection, dataId, context){
	var place = $('.accordian-data_news-text', context)
	  ,	model = getModelRequredDataId (collection, dataId)
	  , _template = template(/*html-������ � ���������� �������, ������������ � html-����*/'#news-title', {
			  title: model.attributes['title'],
			  date: model.attributes['date'],
			  time: model.attributes['time']
		  });
	place.html(_template);
};

var fullTemplate = function(collection, dataId, context){
	var place = $('.accordian-data_live-text', context)
	  ,	model = getModelRequredDataId (collection, dataId)
	  , _template = template(/*html-������ � ���������� �������, ������������ � html-����*/'#news-full', {
			  title: model.attributes['title'],
			  date: model.attributes['date'],
			  time: model.attributes['time'],
			  picture: model.attributes['picture'],
			  text: model.attributes['text']
		  });
	place.html(_template);
};

var	addIntoBegin = function(collectionFrom, collectionInto, dataId) {
		var modelRequired = getModelRequredDataId(collectionFrom, dataId);
		collectionInto.unshift(modelRequired);
	},

	addIntoEnd  = function(collectionFrom, collectionInto, dataId) {
		var modelRequired = getModelRequredDataId(collectionFrom, dataId);
		collectionInto.push(modelRequired);
	},

	deleteBegin  = function(collection) {
		collection.shift();
	},

	deleteEnd = function(collection) {
		collection.pop();
	}
;

window.Widget = window.Widget || {};




var OneNewsModelView = Backbone.View.extend({
	tagName: 'div',
	className : 'accordian-data_news-pic',
	events: {
		"mouseover" : 'mouseoverPictureHandle',
		"mouseleave" : 'mouseleavePictureHandle',
		"click" : 'clickPictureHandle'
	},
	initialize: function(options){
		var dataId = this.options.dataId
		  , collection = this.collection
		  , space = this.options.space
		  , place = $('.accordian-data_news-gallery', space)
		  , template;

		this.model.on('change', this.viewActive, this);

		template = galleryTemplate(collection, dataId);

		place.append(this.$el.html(template));
	},
	render: function(){
	},
	viewActive: function(){
		if (this.model.get('state') == 'active'){
			this.$el.addClass('hover');
		} else {
			this.$el.removeClass('hover');
		}

	},
	mouseoverPictureHandle: function(){

	},
	mouseleavePictureHandle: function(){

	},
	clickPictureHandle: function(){

	}
});

var NewsOne = Backbone.Model.extend({
	setData: function(options) {
		this.set({status : this.get('status') || options.status});
		this.set({title : this.get('title') || options.title});
		this.set({date : this.get('date') || options.date});
		this.set({time : this.get('time') || options.time});
		this.set({text : this.get('text') || options.text});
		this.set({picture : this.get('picture') || options.picture});
		this.set({video : this.get('video') || options.video});
	}
});

var  NewsAll = Backbone.Collection.extend({
	model: NewsOne
});

var Server = Backbone.Collection.extend({
	url: 'http://static.feed.rbc.ru/rbc/export/lg'
});

var GetDataFromServer = Backbone.View.extend({
	initialize: function(options) {
		var that = this
		  , urlServer = this.options.url;
		this.collection.on('complete', this.render, this);
		this.collection.create(
			{
				id: urlServer
			},
			{
				dataType: 'jsonp',
				jsonpCallback: 'callbackWidget',
				success: function (model, response) {
					that.getData(response);
				}
			}
		);
	},
	render: function() {
		new ViewForFour({collection: Widget.cntForFour, globalCollection: Widget.globalDaily, space: '#main'}); // ������������� ������� ���������
	},
	getData : function() {
		var counter = function() {
			var i = 0;
			return function() {
				return i += 1;
			};
		}()
		  , data = arguments[0];
		if(data){
			for ( var key in data) {
				if(key === 'news'){
					var arrayOfNews = data[key];
					for ( var i = 0; i < arrayOfNews.length; i++) {
						var news = new NewsOne();
						for ( var aNewsKey in arrayOfNews[i]) {
							switch (aNewsKey) {
								case 'date'    : news.setData({date: arrayOfNews[i][aNewsKey]}); break;
								case 'time'    : news.setData({time: arrayOfNews[i][aNewsKey]}); break;
								case 'picture' : news.setData({picture: arrayOfNews[i][aNewsKey]}); break;
								case 'status'  : news.setData({status: arrayOfNews[i][aNewsKey]}); break;
								case 'title'   : news.setData({title: arrayOfNews[i][aNewsKey]}); break;
								case 'text'    : news.setData({text: arrayOfNews[i][aNewsKey]}); break;
								case 'video'   : news.setData({video: arrayOfNews[i][aNewsKey]}); break;
								default : break;
							}
						}
						news.set({dataId: counter(), state: ''});
						Widget.globalDaily.add(news);
					}
				}
				else if (key === 'total'){
					Widget.globalDaily.total = data[key];
				}
			}
		}
		if(Widget.globalDaily.length != 0){
			this.collection.trigger('complete');
		}
	}

});

var ViewForFour = Backbone.View.extend({
	el: $('.accordian-data_inner'),
	events:{
		"mouseover .accordian-data_news-pic" : 'mouseoverPictureHandle',
		"mouseleave .accordian-data_news-pic" : 'mouseleavePictureHandle',
		"click .accordian-data_news-pic" : 'clickPictureHandle',
		"click .nav-left" : 'clickRulerPrevHandle',
		"click .nav-nav-right" : 'clickRulerNextHandle'
	},
	initialize: function(options) {
		var that = this
		  ,	global = this.options.globalCollection
		  , current = this.collection
		  , amountFlag = 0
		  , AMOUNT = 4
		  , space = this.options.space;
//// надо переписать потому, что коллекция глобальная уже создана и события add нет,
		  // поэтому просто берем данные из глобальной коллекции и запихиваем в текущую
		global.on('add', function(){
			if (amountFlag < AMOUNT) {
				var oneNewsModel = new Backbone.Model();
				oneNewsModel = _.last(global.models);
				current.add(oneNewsModel);
				new OneNewsModelView({model: oneNewsModel, collection: current, dataId: _.last(current.models).get('dataId'), space: space});
				amountFlag++;
			} else if(amountFlag === 4 ){
				current.trigger('complete');
			}
			current.at(0).set({state: 'active'});
		});

		current.on('complete', function(){
			this.render(space)
		}, this);
		current.on('change', this.changeActiveHandle);


	},
	changeActiveHandle: function(){
		console.log(this);
	},
	render: function(space){
		$('.accordian-data_live').css('backgroundImage', 'none');
	},
	mouseoverPictureHandle: function(){
		setNonActive(this.options.collection);
		console.log(this.options.collection.pluck('state'));
	},
	mouseleavePictureHandle: function(){
	},
	clickPictureHandle: function(){
	},
	clickRulerPrevHandle: function(){
	},
	clickRulerNextHandle: function(){
	}
});


$(function() {
	Widget.data = new Server();				// ��������� ��������
	Widget.globalDaily = new NewsAll();		// ���������� ��������� ��������
	Widget.cntForFour = new Backbone.Collection();// ������� ���������� ��������
	new GetDataFromServer({el: $('#daily'), collection: Widget.data, url: 'daily.json'}); // ������������� ���������� ��������� : �������� ������ � �� ���������� ������z reload
});

