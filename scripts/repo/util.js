define([
	'underscore'
  , 'repo/core'
  , 'repo/collection/news-model'
	],
	function( _, Widget, NewsModel ){
		var getModelRequredDataId = function(collection, dataId){
			return collection.where({dataId: dataId})[0];
		},

		template = function(tpl, props) {
			return  _.template($(tpl).html(), props);
		},

		setActive = function(model){
			model.set({state: 'active'});
		},

		setNonActive = function(elsSet){
			_.each(elsSet, function(model){
					model.set({state: ''});
			});
		},

		getIdForActive = function(elsSet){
			var isGet = false
			  , dataId;

			_.each(elsSet, function(model){
				if(!isGet){
				  	if(model.get('state') == 'active') {
				  		dataId = model.get('dataId');
						isGet = true;
				  	}
				}
			});
			return dataId;

			/*return elsSet.where({state: 'active'})[0].get('dataId');*/
		},

		getActive = function(collection){
			var active = collection.where({state: 'active'});
			if(active.length != 1){
				console.log(active);
			} else {
				return active[0];
			}
		},

		newsDataHandle = function(response, context, rubric, collection) {
			var counter = function() {
				var i = 0;
				return function() {
					return i += 1;
				};
			}()
			  , data = response
			  , VISIBLE = 4
			  , arrayOfNews
			  , news
			  , currentNewsNum
			  , arrayOfTVNews = []
			  , dataId;

			if(data){
				rubric.collection.reset();
				for ( var key in data) {
					if (key === 'total'){
						rubric.total = data[key];
					}
					else if(key === 'news'){
						arrayOfNews = data[key];
						if(context == 'rbctv'){
							currentNewsNum = _.indexOf(_.pluck(arrayOfNews, 'status'), 'now') + 1;
							arrayOfTVNews = arrayOfNews.slice(0, currentNewsNum);
							arrayOfTVNews.reverse();
							arrayOfNews = arrayOfTVNews;
							rubric.total = arrayOfNews.length;
						}

						for ( var i = 0; i < arrayOfNews.length; i++) {
							news = new NewsModel();
							news.set({dataId: counter(), state: ''}, {silent: true});
							if ( news.get('dataId') <= VISIBLE ){
								news.set({visibility: "visible"}, {silent: true});
							}
						 	if(context == 'rbctv'){
							news.set({display: 'none'}, {silent: true});
						 	}
							news.set({context: context}, {silent: true});
							news.set({border: false}, {silent: true});
							for ( var aNewsKey in arrayOfNews[i]) {
								switch (aNewsKey) {
									case 'date'    : news.setData({date: arrayOfNews[i][aNewsKey]}, {silent: true}); break;
									case 'time'    : news.setData({time: arrayOfNews[i][aNewsKey]}, {silent: true}); break;
									case 'picture' : news.setData({picture: arrayOfNews[i][aNewsKey]}, {silent: true}); break;
									case 'status'  : news.setData({status: arrayOfNews[i][aNewsKey]}, {silent: true}); break;
									case 'title'   : news.setData({title: arrayOfNews[i][aNewsKey]}, {silent: true}); break;
									case 'text'    : news.setData({text: arrayOfNews[i][aNewsKey]}, {silent: true}); break;
									case 'video'   : news.setData({video: arrayOfNews[i][aNewsKey]}, {silent: true}); break;
									default : break;
								}
							}
							news.collection = rubric.collection;
							rubric.collection.add(news, {silent: true});
						}
					}
				}
			}

			collection.last().trigger('newsGotten');

		};

		return {
			getModelRequredDataId : getModelRequredDataId,
			template : template,
			setActive : setActive,
			setNonActive : setNonActive,
			getIdForActive : getIdForActive,
			getActive : getActive,
			newsDataHandle : newsDataHandle
		};
	}
);



