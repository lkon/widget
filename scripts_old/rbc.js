/** мы имеем вид приложения:
 * несколько рубрик,
 * в первой рубрике есть контент:
	 * видны 4 изображения и текст под ними, который является заголовком к каждой фотографии,
		 * отрисовка начального представления приложения:
		 * создаем глобальную коллекцию моделей новостей для каждой из рубрик(daily, top, archive)
			 * в коллекцию будут включены модели по порядку, т.к. это массив, при добавлении в коллекцию
			 * у модели будет атрибут data-id, именно по нему будет выборка из коллекции
		 * для представления на странице используем текущую коллекцию моделей, состоящую из 4 моделей,
		 * явно представленных на странице, для текущей коллекции реализуется представление, отслеживающее
		 * ее изменения: добавление модели или удаление будет вызывать событие change, на которое будет вид
		 * реагировать и соответственно изменять представление
			 * при создании текущей коллекции из элементов глобальной коллекции, для первой модели
			 * текущей коллекции устанавливается state: 'active'
	 * при наведении на фотографию, меняется статус - active, что влечет за собой изменение вида:
	 * снимается тень, меняется текст - соответствующий для этой фотографии заголовок,
	 * по умолчанию на первый элемент списка новостей ставится статус active.
 * в остальных рубриках контент скрыт.
 *
 * при клике на рулеры вперед и назад, меняется отображение контента:
	 * удаляется или добавляется предыдущее изображение в самом начале
	 * (тогда соответственно изображения сдвигаются вперед или назад)
	 * статус active всегда устанавливается на первый элемент списка и
	 * соответственно меняется вид: снимается тень и есть тект для этой фотографии
 *
 * при клике на саму фотографию меняется вид:
	 * блок с галерей (accordian-data_live) скрывается и
	 * показывается блок для этой новости (accordian-data_live-full)
	 * в этом блоке отображаются данные одной новости
	 * справа и слева есть рулеры, при клике на которых меняется вид новости:
		 * при клике вверх или вниз:
			 * просто прокручивается текст в своем контейнере,
		 * при клике вперед или назад:
			 * меняется контент, определяется data-id, удостоверяется,
			 * что в базе есть предыдущий или последующий элемент и берутся данные по data-id
			 * следующего или предыдущего элемента
 * при клике на кнопке возврата меняется вид:
	 * блок с галерей (accordian-data_live) показывается
		 * с этой новостью - первой в списке
	 * блок для этой новости (accordian-data_live-full) скрывается
 */
/**
 * События для элементов страницы:
 *
 * picture.mouseover =  1) статусы всех моделей текущей коллекции утсанавливаются
 * 							неактивным  {state: ''};
 * 						2) статус модели, связанной с видом, испытывающим событие непосредственно,
 * 							устанавливается активным: {state: 'active'};
 * 						3) текст подписи text заменяется на содержимое аналогичного
 * 							параметра модели с активным статусом
 * очевидно, вид рендерит представление:
 * все отображения неактивных моделей под blur,
 * отображение активной модели - снято blur,
 * подпись внизу - данные активной модели
 *
 * picture.mouseleave = 1) статусы всех моделей текущей коллекции устанавливаются
 * 							неактивным  {state: ''};
 * 						2) статус первой модели в коллекции
 * 							устанавливается активным: {state: 'active'};
 * 						3) текст подписи text заменяется на содержимое аналогичного
 * 							параметра модели с активным статусом
 * очевидно, вид рендерит представление:
 * все отображения неактивных моделей под blur,
 * отображение активной модели - снято blur,
 * подпись внизу - данные активной модели
 *
 * picture.click =  1) еще при наведении мышки на элемент, у его модели был
 * 						установлен активный статус;
 * 					2) скрывается представление галереи (уничтожается вид? нет вид уничтожать нельзя - слишком много операций по манипулированию DOM);
 * 					3) отображается представление полномасшабное для модели,
 * 						вид которой в галереи испытал событие клика - создается полный вид,
 * 						вид отображает модель в активном статусе, соответственно с данными
 * 						именно этой активной модели;
 * 					4) отображается элемент возврата из полномасштабного представления в галерею,
 * 						то есть в представлении полномасштабного вида прописывается, что этот элемент display:block,
 * 						соответственно в представлении вида галереи для этого элемента будет установлено dispaly:none
 *
 * rulerPrev.click =  	1) в текущую коллекцию добавляется модель с dataId = (dataId для модели с индексом 0 (или первой) в текущей коллекции) - 1,
 * 							модель выбирается из глобальной коллекции для соответствующей рубрики;
 * 						2) из конца текущей коллекции удаляется модель;
 * 						3) после обновления коллекции для первой модели устанавливается статус = active,
 * 							соответственно вид галереи рендерит представление: все элементы - blur,
 * 							картинка в активном статусе - не blur, в поле текста отображается текст модели в активном состоянии;
 *
 * rulerNext.click =  	1) из начала текущей коллекции удаляется модель;
 * 						2) в конец текущей коллекции добавляется модель  с dataId = (dataId для модели с индексом [length -1] (или последней) в текущей коллекции) +1,
 * 							модель выбирается из глобальной коллекции для соответствующей рубрики;
 * 						3) после обновления коллекции для первой модели устанавливается статус = active,
 * 							соответственно вид галереи рендерит представление: все элементы - blur,
 * 							картинка в активном статусе - не blur,
 * 							в поле текста отображается текст модели в активном состоянии;
 *
 * rulerPrevFull.click =  	1) устанавливается dataId модели в активном статусе
 * 								(потому что в полномасштабном представлении у нас отображается
 * 								только активная модель)
 * 							2) фильтруется глобальная коллекция моделей для поиска модели с dataId= (dataId активной модели) - 1;
 * 							3) у всех моделей и в глобальной и в текущей коллекции сносится статус active
 * 							3) полученная из фильтра модель
 */


/**
 * Представления для элементов страницы:
 *
 * 1) представление приложения, при котором происходит
 * 		загрузка страницы с полученим данных с сервера
 * 		(соответствует глобальной коллекции моделей для каждой из рубрик)
 *
 * 2) представление галереи изображений, при котором отображаются
 * 		4 картинки и текст для картинки-модели в активном статусе
 * 		(соответствует текущей коллекции моделей для каждой из рубрик)
 *
 * 3) представление для одной картинки в галереи
 *
 * 4) полномасштабное представление для одной картинки - модели в активном статусе
 *
 */


/**
 * функция фильтрует коллекцию моделей для получения
 * одной из них по заданному dataId
 * @param {Backbone.Collection} collection - экземпляр Backbone.Collection
 * @param {Number} dataId - свойство модели, имеющее уникальное значение,
 * 							по нему модель идентифициируется в коллекции
 * @return {Backbone.Model} clone - копия модели с задынным dataId
 */
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

/**
 * функция фильтрует коллекцию моделей для определения, которая
 * из моделей имеет активное состояние ({state: 'active'}),
 * потому что вид отрисовывает только активную модель
 * @param {Backbone.Collection} collection - экземпляр Backbone.Collection
 * @return {Number} значение dataId
 */
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

/*
 * функция обрабатывает все модели коллекции и устанавливает
 * для моделей состояние неактивное {state: ''}
 * @param {Backbone.Collection} collection - экземпляр Backbone.Collection
 */
var setNonActive = function(collection){
	_.each(collection.models, function(model){
		_.each(model.attributes, function(value, key){
			model.set({state: ''});
		});
	});
};

/**
 *
 * @param {String} tpl - html-шаблон в скриптовой вставке
 * @param {Object} props - объект свойств, по которым получаются
 * 					 значения из объекта новостей
 * @return {}
 */
var template = function(tpl, props) {
	return  _.template($(tpl).html(), props);
};

/**
 * Функция обрабатывает шаблон вставки изображений галереи в html-код
 * оперирует данными текущей коллекции, состоящей из 4 моделей,
 * для одной из которых установлено свойство state: 'active'
 * @param {Backbone.Collection} collection - текущая коллекция - экземпляр Backbone.Collection
 * @param {Number} dataId - номер, по которому индентифициируется модель с активным статусом
 * @param {String} context - контекст, в котором расположена галлерея
 */
/*var galleryTemplate = function(collection, dataId, context){
	var place = $('.accordian-data_news-gallery', context)
	  , model = getModelRequredDataId (collection, dataId)
	  , _template = template(html-шаблон в скриптовой вставке, определенный в html-коде'#news-pic', {picture: model.attributes['picture']});
	place.append(_template);
};*/
var galleryTemplate = function(collection, dataId){
	var model = getModelRequredDataId (collection, dataId)
	  , _template = template(/*html-шаблон в скриптовой вставке, определенный в html-коде*/'#news-pic', {picture: model.attributes['picture']});
	  return _template;
};
/**
 * Пример вызова
 *
 * galleryTemplate(daily, 1, '#main')
 */

/**
 * Функция обрабатывает шаблон вставки текста заголовка активной картинки в html-код
 * оперирует данными текущей коллекции, состоящей из 4 моделей,
 * для одной из которых установлено свойство state: 'active'
 * @param {Backbone.Collection} collection - текущая коллекция - экземпляр Backbone.Collection
 * @param {Number} dataId - номер, по которому индентифициируется модель с активным статусом
 * @param {String} context - контекст, в котором расположена галлерея
 */
var titleTemplate = function(collection, dataId, context){
	var place = $('.accordian-data_news-text', context)
	  ,	model = getModelRequredDataId (collection, dataId)
	  , _template = template(/*html-шаблон в скриптовой вставке, определенный в html-коде*/'#news-title', {
			  title: model.attributes['title'],
			  date: model.attributes['date'],
			  time: model.attributes['time']
		  });
	place.html(_template);
};
/**
 * Пример вызова
 *
 * titleTemplate(daily, 1, '#main')
 */

/**
 * Функция обрабатывает шаблон вставки данных активной картинки в html-код
 * при полномасштабном представлении
 * оперирует данными текущей коллекции, состоящей из 4 моделей,
 * для одной из которых установлено свойство state: 'active',
 * @param {Backbone.Collection} collection - текущая коллекция - экземпляр Backbone.Collection
 * @param {Number} dataId - номер, по которому индентифициируется модель с активным статусом
 * @param {String} context - контекст, в котором расположено полномасштабное представление
 */
var fullTemplate = function(collection, dataId, context){
	var place = $('.accordian-data_live-text', context)
	  ,	model = getModelRequredDataId (collection, dataId)
	  , _template = template(/*html-шаблон в скриптовой вставке, определенный в html-коде*/'#news-full', {
			  title: model.attributes['title'],
			  date: model.attributes['date'],
			  time: model.attributes['time'],
			  picture: model.attributes['picture'],
			  text: model.attributes['text']
		  });
	place.html(_template);
};
/**
 * Пример вызова
 *
 * fullTemplate(daily, 1, '#main')
 */





	/**
	 *  в начало текущей коллекции добавляется модель с требуемым data-id
	 * @param {Array} collectionFrom - массив моделей глобальной коллекции (из которой копируется модель)
	 * @param {Object} collectionInto - коллекция, в которую копируетмя модель
	 * @param {Number} dataId - dataId модели глобальной коллекции, которая вставляется в текущую коллекцию
	 */
var	addIntoBegin = function(collectionFrom, collectionInto, dataId) {
		var modelRequired = getModelRequredDataId(collectionFrom, dataId);
		collectionInto.unshift(modelRequired);
	},
	/**
	 *  в конец текущей коллекции добавляется модель с требуемым data-id
	 * @param {Number} dataId - dataId модели глобальной коллекции, которая вставляется в текущую коллекцию
	 * @param {Array} collectionFrom - массив моделей глобальной коллекции (из которой копируется модель)
	 * @param {Object} collectionInto - коллекция, в которую копируетмя модель
	 */
	addIntoEnd  = function(collectionFrom, collectionInto, dataId) {
		var modelRequired = getModelRequredDataId(collectionFrom, dataId);
		collectionInto.push(modelRequired);
	},
	/**
	 *  из начала текущей коллекции удаляется модель в начале
	 * @param {Object} collection - коллекция, из которой удаляется первый элемент
	 */
	deleteBegin  = function(collection) {
		collection.shift();
	},
	/**
	 *  в конце текущей коллекции удаляется модель
	 * @param {Object} collection - коллекция, из которой удаляется последний элемент
	 */
	deleteEnd = function(collection) {
		collection.pop();
	}
;

/* namespace для нашего приложения */
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

/**
 * picture.mouseover =  1) статусы всех моделей текущей коллекции утсанавливаются
 * 							неактивным  {state: ''};
 * 						2) статус модели, связанной с видом, испытывающим событие непосредственно,
 * 							устанавливается активным: {state: 'active'};
 * 						3) текст подписи text заменяется на содержимое аналогичного
 * 							параметра модели с активным статусом
 * очевидно, вид рендерит представление:
 * все отображения неактивных моделей под blur,
 * отображение активной модели - снято blur,
 * подпись внизу - данные активной модели
 */
	},
	mouseleavePictureHandle: function(){
/**
 * picture.mouseleave = 1) статусы всех моделей текущей коллекции устанавливаются
 * 							неактивным  {state: ''};
 * 						2) статус первой модели в коллекции
 * 							устанавливается активным: {state: 'active'};
 * 						3) текст подписи text заменяется на содержимое аналогичного
 * 							параметра модели с активным статусом
 * очевидно, вид рендерит представление:
 * все отображения неактивных моделей под blur,
 * отображение активной модели - снято blur,
 * подпись внизу - данные активной модели
 */
	},
	clickPictureHandle: function(){
/**
 * picture.click =  1) еще при наведении мышки на элемент, у его модели был
 * 						установлен активный статус;
 * 					2) скрывается представление галереи (уничтожается вид? нет вид уничтожать нельзя - слишком много операций по манипулированию DOM);
 * 					3) отображается представление полномасшабное для модели,
 * 						вид которой в галереи испытал событие клика - создается полный вид,
 * 						вид отображает модель в активном статусе, соответственно с данными
 * 						именно этой активной модели;
 * 					4) отображается элемент возврата из полномасштабного представления в галерею,
 * 						то есть в представлении полномасштабного вида прописывается, что этот элемент display:block,
 * 						соответственно в представлении вида галереи для этого элемента будет установлено dispaly:none
 */
	}
});

/**
 * Конструктор для модели глобальной коллекции
 * при получении json-объекта с сервера данные обрабатываются:
 * каждый объект массива в отдельную модель
 * модель новостей будет иметь свойства:
 * status - не знаю
 * title - заголовок новости
 * date - дата новости
 * time - время новости
 * text - текст новости
 * picture - иллюстрация к новости
 * video - видео к новости
 * state - флаг активности: active || ''
 */
var NewsOne = Backbone.Model.extend({
	/**
	 * метод модели, устанавливающий значения для свойств модели
	 * @param {Object} options - объект данных массива новостей json-объекта,
	 * 							полученного с сервера
	 */
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

/**
 * Констркутор для глобальной коллекции новостей с данными,
 * полученными с сервера в json-объекте
 */
var  NewsAll = Backbone.Collection.extend({
	/**
	 * Свойство коллекции, связывающее её с классом моделей,
	 * входящих в неё
	 * @type {Backbone.Model}
	 */
	model: NewsOne
});

/**
 * Конструктор коллекции моделей серверов для запроса новостей
 * по каждой из рубрик
 */
var Server = Backbone.Collection.extend({
	/**
	 * Свойство (или функция) url указывает положение коллекции на сервере.
	 * Модели в коллекции будут использовать его, чтобы конструировать
	 * свои собственные URL'ы. Тогда это будет выглядеть url-collection/url-model
	 * @type String
	 */
	url: 'http://static.feed.rbc.ru/rbc/export/lg'
});

/**
 * Конструктор представления, обрабатывающего создание и изменение глобальной коллекции новостей
 * по каждой из рубрик
 */
var GetDataFromServer = Backbone.View.extend({
	/**
	 * При создании объекта представления с помощью этого конструктора
	 * (GetDataFromServer) будут выполнены действия, предписанные в этом методе
	 * @param {Object} options - данные, которые мы хотим передать в
	 * 					создаваемый экземпляр вида, внутри него будут
	 * 					доступны как this.options.[...]
	 */
	initialize: function(options) {
		var that = this
		/**
		 * Указатель на имя сервера, по которому будет сделан ajax-запрос
		 */
		  , urlServer = this.options.url;
		/**
		 * свойство collection указывает для какой коллекции
		 * вид обрабатывает представление
		 */
		this.collection.on('all', function(eventName) {

		}, this);

		/**
		 * при инициализации объекта Вида будет создана коллекция:
		 * ajax-методом она запросит данные с сервера и при успешном
		 * их получении будет создана глобальная коллекция новостей
		 */
		this.collection.create(
			{
				/*
				 * в этом свойстве устанавливается по какому серверу
				 * будет запрос для одной из рубрик:
				 * rbctv: 'archive.json',
				 * main: 'top_rbc_ru.json',
				 * daily: 'daily.json'
				 */
				id: urlServer
			},
			{
				dataType: 'jsonp',
				jsonpCallback: 'callbackWidget',
				/**
				 * при успешном выполненни запроса ответ обработает эта функция
				 * @param {Backbone.Model} model - чей хеш attributes содержит
				 * 				{id: 'daily.json', total: Number, news: Array}
				 * 				id мы задавали сами для указания сервера, к которому будет выполнен ajax-запрос;
				 * 				total и news содержат данные, переданные json-объектом в ответе
				 * @param {Object} response - ответ с сервера, {news: Array, total: Number}
				 */
				success: function (model, response) {
					/* если принято решение: сразу же организовать все данные
					 * по одной из рубрик в глобальную коллекцию моделей новостей
					 */
					that.getData(response);
					/* если принято решение: предварительно сохранить данные,
					 * полученные с сервера в локальное хранилище на клиенте,
					 * чтобы можно было потом манипулировать ими из любого уровня
					 * локализации
					 * localStorage.setItem('daily', JSON.stringify(response));
					 */
				}
			}
		);
	},
	/**
	 * При каждом изменение глобальной колеекции новостей
	 * этот метод будет рендерить (осталось определиться что именно)
	 */
	render: function() {
		var view = new ViewForOneNews();
	},

	/**
	 * Этот метод вида обрабатывает данные json-объекта, полученного с сервера
	 * каждый объект в массиве новостей обработает метод news.setData -
	 * будет создана модель новости, которая потом будет добавлена в глобальную
	 * коллекция новостей. Для каждой из рубрик будут выполнены аналогичные действия
	 *
	 * Метод ничего не возвращает, только наполняет глобальную коллекцию, объявленную глобально
	 *
	 * @param {Object} ответ с сервера, {news: Array, total: Number}
	 *
	 */
	getData : function(/*constructorModel, constructorCollection*/) {
		/**
		 * Реализация счетчика, каждый вызов этой функции
		 * вернет значение на единицу больше
		 */
		var counter = function() {
			var i = 0;
			return function() {
				return i += 1;
			};
		}()
		/**
		 * объект данных, переданный с сервера
		 * @type {Object} {news: Array, total: Number}
		 */
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
						/**
						 * В модель добавляются свойства dataId - уникальный номер для каждой модели;
						 * state - флаг, сообщающий о состоянии активности одной из моделей коллекции
						 */
						news.set({dataId: counter(), state: ''});
						/**
						 * модели добавлются в глобальную коллекцию
						 */
						Widget.globalDaily.add(news);
					}
				}
				else if (key === 'total'){
					Widget.globalDaily.total = data[key];
				}
			}
		}
	}
});

/**
 * Конструктор текущей коллекции моделей новостей, состоящей
 * из 4 моделей, имеющих представление в галерее
 */
var CurrentForFour = Backbone.Collection;
/**
 * Конструктор представления, обрабатывающего создание и изменение
 * текущей коллекции новостей, состоящей из 4 элементов, представленных в галерее
 * @type {Backbone.View}
 */
var ViewForFour = Backbone.View.extend({
	/**
	 * представление имеет своим корнем этот html-элемент
	 */
	el: $('.accordian-data_inner'),
	/**
	 * Представление будет отслеживать следующие события,
	 * возникающие на дочерних элементах
	 * @type
	 */
	events:{
		"mouseover .accordian-data_news-pic" : 'mouseoverPictureHandle',
		"mouseleave .accordian-data_news-pic" : 'mouseleavePictureHandle',
		"click .accordian-data_news-pic" : 'clickPictureHandle',
		"click .nav-left" : 'clickRulerPrevHandle',
		"click .nav-nav-right" : 'clickRulerNextHandle'
	},
	/**
	 * При создании объекта представления, обрабатывающего создание и изменение
	 * текущей коллекции моделей новостей галереи, с помощью этого конструктора
	 * (ViewForFour) будут выполнены действия, предписанные в этом методе:
	 *
	 * @param {Object} options - данные, которые мы хотим передать в
	 * 					создаваемый экземпляр вида, внутри него будут
	 * 					доступны как this.options.[...]
	 */
	initialize: function(options) {
		var that = this
		  ,	global = this.options.globalCollection
		  , current = this.collection
		  , amountFlag = 0
		  , AMOUNT = 4
		  , space = this.options.space;
/**
 * при каждом добавлении в глобальную колллекцию модели новости,
 * её копия будет добавляться в текущую коллекцию. Всего в текущую коллекцию будет
 * добавлено 4 модели (ограничивает флаг). Тогда экземпляр этого конструктора Вида
 * будет представлять текущую коллекцию из 4 элементов.
 */
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
			// При каждом первоначальном наполнении
			// текущей коллекции, первая модель коллекции
			// получает статус active
			current.at(0).set({state: 'active'});
		});

		current.on('complete', function(){
			this.render(space)
		}, this);
		/**
		 *
		 */
		//current.on('add', this.setFirstActive);
		current.on('change', this.changeActiveHandle);


	},
/*	setFirstActive: function(){
		this.at(0).get('state') == 'active' ? true : this.at(0).set({state: 'active'});
	},*/
	changeActiveHandle: function(){
		console.log(this);
	},
	/**
	 * Перерисовывает вид в зависимости от изменения коллекции
	 */
	render: function(space){
		$('.accordian-data_live').css('backgroundImage', 'none');
	},
	mouseoverPictureHandle: function(){
/**
 * picture.mouseover =  1) статусы всех моделей текущей коллекции утсанавливаются
 * 							неактивным  {state: ''};
 * 						2) статус модели, связанной с видом, испытывающим событие непосредственно,
 * 							устанавливается активным: {state: 'active'};
 * 						3) текст подписи text заменяется на содержимое аналогичного
 * 							параметра модели с активным статусом
 * очевидно, вид рендерит представление:
 * все отображения неактивных моделей под blur,
 * отображение активной модели - снято blur,
 * подпись внизу - данные активной модели
 */
		setNonActive(this.options.collection);
		console.log(this.options.collection.pluck('state'));
	},
	mouseleavePictureHandle: function(){
/**
 * picture.mouseleave = 1) статусы всех моделей текущей коллекции устанавливаются
 * 							неактивным  {state: ''};
 * 						2) статус первой модели в коллекции
 * 							устанавливается активным: {state: 'active'};
 * 						3) текст подписи text заменяется на содержимое аналогичного
 * 							параметра модели с активным статусом
 * очевидно, вид рендерит представление:
 * все отображения неактивных моделей под blur,
 * отображение активной модели - снято blur,
 * подпись внизу - данные активной модели
 */
	},
	clickPictureHandle: function(){
/**
 * picture.click =  1) еще при наведении мышки на элемент, у его модели был
 * 						установлен активный статус;
 * 					2) скрывается представление галереи (уничтожается вид? нет вид уничтожать нельзя - слишком много операций по манипулированию DOM);
 * 					3) отображается представление полномасшабное для модели,
 * 						вид которой в галереи испытал событие клика - создается полный вид,
 * 						вид отображает модель в активном статусе, соответственно с данными
 * 						именно этой активной модели;
 * 					4) отображается элемент возврата из полномасштабного представления в галерею,
 * 						то есть в представлении полномасштабного вида прописывается, что этот элемент display:block,
 * 						соответственно в представлении вида галереи для этого элемента будет установлено dispaly:none
 */
	},
	clickRulerPrevHandle: function(){
/**
 * rulerPrev.click =  	1) в текущую коллекцию добавляется модель с dataId = (dataId для модели с индексом 0 (или первой) в текущей коллекции) - 1,
 * 							модель выбирается из глобальной коллекции для соответствующей рубрики;
 * 						2) из конца текущей коллекции удаляется модель;
 * 						3) после обновления коллекции для первой модели устанавливается статус = active,
 * 							соответственно вид галереи рендерит представление: все элементы - blur,
 * 							картинка в активном статусе - не blur, в поле текста отображается текст модели в активном состоянии;
 */
	},
	clickRulerNextHandle: function(){
/**
 * rulerNext.click =  	1) из начала текущей коллекции удаляется модель;
 * 						2) в конец текущей коллекции добавляется модель  с dataId = (dataId для модели с индексом [length -1] (или последней) в текущей коллекции) +1,
 * 							модель выбирается из глобальной коллекции для соответствующей рубрики;
 * 						3) после обновления коллекции для первой модели устанавливается статус = active,
 * 							соответственно вид галереи рендерит представление: все элементы - blur,
 * 							картинка в активном статусе - не blur,
 * 							в поле текста отображается текст модели в активном состоянии;
 */
	}
});



/** мы имеем вид приложения:
 * несколько рубрик,
 * в первой рубрике есть контент:
	 * видны 4 изображения и текст под ними, который является заголовком к каждой фотографии,
		 * отрисовка начального представления приложения:
		 * создаем глобальную коллекцию моделей новостей для каждой из рубрик(daily, top, archive)
			 * в коллекцию будут включены модели по порядку, т.к. это массив, при добавлении в коллекцию
			 * у модели будет атрибут data-id, именно по нему будет выборка из коллекции
		 * для представления на странице используем текущую коллекцию моделей, состоящую из 4 моделей,
		 * явно представленных на странице, для текущей коллекции реализуется представление, отслеживающее
		 * ее изменения: добавление модели или удаление будет вызывать событие change, на которое будет вид
		 * реагировать и соответственно изменять представление
			 * при создании текущей коллекции из элементов глобальной коллекции, для первой модели
			 * текущей коллекции устанавливается state: 'active'
	 * при наведении на фотографию, меняется статус - active, что влечет за собой изменение вида:
	 * снимается тень, меняется текст - соответствующий для этой фотографии заголовок,
	 * по умолчанию на первый элемент списка новостей ставится статус active.
 * в остальных рубриках контент скрыт.
/**
 * при загрузке страницы:
 * делается запрос на сервер по всем адресам рубрик, тогда:
	 * 1) создается или обновляется глобальная коллекция моделей новостей для каждой из рубрик(daily, top, archive)
	 * в коллекцию будут включены модели по порядку, т.к. это массив, при добавлении в коллекцию
	 * у модели будет атрибут dataId, именно по нему будет выборка из коллекции
	 	* при создании или обновлении глобальной коллекции должна обновляться текущая коллекция новостей
 */
$(function() {

//  создан экземпляр коллекции серверов для запроса данных
	Widget.data = new Server();
	/**
	 * создан экземпляр вида, обрабатывающего изменение только
	 * что созданной коллекции серверов.
	 * При создании вида в него  передается хеш данных:
	 * el - html-элемент, к которому будет привязан этот вид
	 * collection - ссылка на коллекцию, которую он представляет
	 * url - строка адреса сервера, куда будет выполнен ajax-запрос
	 * для наполнения коллекции, уточнение: эта строка при запросе конкатенируется с url коллекции,
	 * тогда итоговый адрес выглядит  "/[collection.url]/[id]"
	 */
	Widget.globalDaily = new NewsAll();

	/**
	 * Экземпляр текущей коллекции моделей новостей, состоящей
	 * из 4 моделей, имеющих представление в галерее
	 */
	Widget.cntForFour = new CurrentForFour();

	new GetDataFromServer({el: $('#daily'), collection: Widget.data, url: 'daily.json'});
//	здесь space - это область содержимого для каждой из рубрик - у DOM-элементов есть id
	new ViewForFour({collection: Widget.cntForFour, globalCollection: Widget.globalDaily, space: '#main'});
});

// контейнер, в который помещаются 4 картинки
var gallery = $('.accordian-data_news-gallery')
// контейнер для самой картинки
  , picture = $('.accordian-data_news-pic')
// контейнер для текста подписи к картинке со статусом active
  , text = $('.accordian-data_news-text')
// ruler, управляющий сдвигом картинок галереи влево (назад)
  , rulerPrev = $('.nav-left')
// ruler, управляющий сдвигом картинок галереи вправо (вперед)
  , rulerNext = $('.nav-right')
// ruler, управляющий сдвигом картинок галереи влево (назад)
// при полном виде просмотра новости
  , rulerPrevFull = $('.nav-left-full')
// ruler, управляющий сдвигом картинок галереи вправо (вперед)
// при полном виде просмотра новости
  , rulerNextFull = $('.nav-right-full')
// элемент, активизирующий обновление глобальной коллекции
//  моделей новостей с сервера
  , reload = $('.widget-reload')
// элемент, реализующий возврат полномасштаного представления
//  одной новости к представлению галереи новостей
  , back = $('.widget-back');


























/**
 *
 * @param {String} tpl - html-шаблон в скриптовой вставке
 * @param {Object} props - объект свойств, по которым получаются
 * 					 значения из объекта новостей
 * @return {}
 */
var template = function(tpl, props) {
	return  _.template($(tpl).html(), props);
};
/**
 * в локальном хранилище читает объект данных json,
 * полученный с сервера и сохраненный в виде строки
 * @param {String} store - строка объекта json
 * @return {Object} объект {news: Array, total: Number}
 */
var getObStored = function(store) {
	return JSON.parse(localStorage.getItem(store));
};
/**
 * выбирает данные из объекта данных
 * @param {String} store - строка объекта json
 * @param {String} param - ключ news или total
 * @param {Number} index - индекс объекта новостей в массиве объектов новотей news
 * @param {String} key - свойство в объекте новостей title date time text picture
 * @return {} значение свойства в объекте новостей title date time text picture
 */
var parseStore = function(store, param, index, key) {
	return getObStored(store)[param][index][key];
};
/*var galleryTemplate = function(context){
	var place = $('.accordian-data_news-gallery', context);
	var tpl = template('#news-pic', {picture: parseStore('daily', 'news', 0, 'picture')})
};
$('#main .accordian-data_news-gallery').html();

$('#main .accordian-data_news-text').html(template('#news-title', {
	title: parseStore('daily', 'news', 0, 'title'),
	date: parseStore('daily', 'news', 0, 'date'),
	time: parseStore('daily', 'news', 0, 'time')
}
));
$('#main .accordian-data_live-text').html(template('#news-full', {
	title: parseStore('daily', 'news', 0, 'title'),
	date: parseStore('daily', 'news', 0, 'date'),
	time: parseStore('daily', 'news', 0, 'time'),
	text: parseStore('daily', 'news', 0, 'text'),
	picture: parseStore('daily', 'news', 0, 'picture')
}
));*/
/**
 *
collection.at(index)
Возвращает модель из коллекции по индексу. Полезно, если ваша коллекция отсортирована; если нет, то этот метод возвращает модели по порядку вставки.

collection.push(model, [options])
Добавляет модель в конец коллекции. Принимает те же аргументы, что и add.

collection.pop([options])
Удаляет последнюю модель из коллекции и возвращает ее. Принимает те же аргументы, что и remove.

collection.unshift(model, [options])
Добавляет модель в начало коллекции. Принимает те же аргументы, что и add.

collection.shift([options])
Удаляет первую модель из коллекции и возвращает ее. Принимает те же аргументы, что и remove.

collection.length
Подобно массивам, коллекции поддерживают свойство length, равное количеству моделей, которые они содержат
 */





