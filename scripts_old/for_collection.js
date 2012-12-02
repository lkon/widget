var OneNews = Backbone.Model.extend({
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

var AllNews = Backbone.Collection.extend({
	model: OneNews
});

var allNews = new AllNews();



var ViewForOneNews = Backbone.View.extend({
	tagName: 'li',
	className: 'one-news',
	events : {
		"click .news__title": 'hideNews'
	},
	hideNews : function() {
		this.el.hide('slow');
	}
});

var DataFromServerCollection = Backbone.Collection.extend({
	url: 'http://static.feed.rbc.ru/rbc/export/lg'
});

var newsOnDisplay_Constructor = Backbone.View.extend({
	initialize: function() {
		this.collection.on('change', function() {
			alert('change happen');
		}, this);
	},

	events: {
		'click .js-daily': 'loadNewsOnDisplay',
		'click .js-archive': 'loadNewsOnDisplay'
	},

	loadNewsOnDisplay: function(e) {
		e.preventDefault();
		var that = this
		  , id = null;

		switch (e.target.className) {
		case 'js-daily' :
			id = 'daily.json';
			break;
		case 'js-archive' :
			id = 'top_rbc_ru.json';
			break;
		default :
			break;
		}

		this.collection.create(
			{
				id: id
			},
			{
				dataType: 'jsonp',
				jsonpCallback: 'callbackWidget',
				success: function (model, response) {
	                that.callback( response );
				},
				complete: function(jqXHR, textStatus) {
				}
			}
		);
	},

	render: function() {
		var view = new ViewForOneNews();
	},

	callback : function() {
	var objectTotalFromServerHandler = function(objectTotalFromServer){
		if(objectTotalFromServer){
			for ( var key in objectTotalFromServer) {
				if(key === 'news'){
					var arrayOfNews = objectTotalFromServer[key];
					for ( var index = 0; index < arrayOfNews.length; index++) {
						var news = new OneNews();
						for ( var aNewsKey in arrayOfNews[index]) {
							switch (aNewsKey) {
							case 'date' :
								news.setData({date: arrayOfNews[index][aNewsKey]});
								break;
							case 'time' :
								news.setData({time: arrayOfNews[index][aNewsKey]});
								break;
							case 'picture' :
								news.setData({picture: arrayOfNews[index][aNewsKey]});
								break;
							case 'status' :
								news.setData({status: arrayOfNews[index][aNewsKey]});
								break;
							case 'title' :
								news.setData({title: arrayOfNews[index][aNewsKey]});
								break;
							case 'text' :
								news.setData({text: arrayOfNews[index][aNewsKey]});
								break;
							case 'video' :
								news.setData({video: arrayOfNews[index][aNewsKey]});
								break;

							default :
								break;
							}
						}
						allNews.add(news);
					}
				}
			}
		}
	};
	if(arguments[0]){
		objectTotalFromServerHandler(arguments[0]);
	}
}


});



$(function() {
	var dataFromServer = new DataFromServerCollection();
	new newsOnDisplay_Constructor({el: $('.fieldset'), collection: dataFromServer});
});

/* при загрузке страница пустая, есть две кнопки:
 *  одна кнопка - daily,
 *  вторая кнопка - archive
 *  при нажатии на любой из кнопок
 *  должно выводится содержимое, соответствующее
 *  надписи на кнопке
 *
 *  при загрузке страницы должен создаваться вид, отслеживающий поведение двух кнопок
 *
 * то есть в самом начале у нас уже должна быть коллекция с нескольким моделями, содержащими
 * индивидуальные url-адреса для запроса на сервер, именно для этой коллекции создается вид,
 * который следит за кнопками и выдает соответствующее поведение при нажатии каждой из них
 *
 *
 *  для вывода данных необходимо сделать запрос на сервер
 *  по методу ajax
 *  условия для запроса на сервер содержит отдельная модель,
 *  в нашем случае модель будет содержать индивидуальную часть url-адреса,
 *  а коллекция, вмещающая все эти модели, будет содержать основную часть url-адреса
 *  модель и коллекция ничего не делают только объектно объединяют данные
 *
 *  реакция на действия пользователя обрабатывается в виде:
 *  при клике на кнопке, вид должен отобразить данные полученные с сервера(если
 *  они изменились, если нет - то из хранилища)
 *  при срабатывании события клика вид возбуждает событие вытягивания данных с сервера
 *  данные приходят одним объектом, который мы должны распарсить необходимым нам образом:
 *  преобразуем глобальный объект данных в модели отдельных новостей, которые составят потом коллекцию
 *
 *  запрос возвращает json, завернутый в callback
 *  json состоит из массива объектов, содержимое
 *  которых переписывается в свойства моделей, в итоге
 *  получается коллекция моделей отдельных новостей
 *  дальше для каждой модели в коллекции делается свой вид,
 *  который будет следить за изменениями отдельной модели,
 *  также этот вид будет определять html-стрктуру модели
 *
 *  получается что есть необходимость в использовании глобального вида,
 *  который будет отслеживать поведение модели данных, получаемых с сервера,
 *  причем при каждом запросе на сервер для выдачи данных следует
 *  проверять если модель изменилась, то запрашивать её выдачу с сервера,
 *  если модель не изменилась, то показать имеющуюся,
 *  для этого все глобальные модели данных, получаемых с сервера должны
 *  быть сохранены в коллекции моделей,
 *  на коллекцию следует повесить слушатель изменения данных,
 *  чтобы в случае изменения модели, глобальный вид мог перерисовать себя
 *
 *
 *  и индивидуального вида для модели одной новости (элемента списка новостей),
 *  чтобы при задании поведения для одной новости вид перисовывал бы себя
 */

