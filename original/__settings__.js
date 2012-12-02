SmartJS.settings = {
	sources: {
		total: 'http://static.feed.rbc.ru/rbc/export/lg/total.json',
		rbctv: 'http://static.feed.rbc.ru/rbc/export/lg/archive.json',
		main: 'http://static.feed.rbc.ru/rbc/export/lg/top_rbc_ru.json',
		daily: 'http://static.feed.rbc.ru/rbc/export/lg/daily.json',
 		rate: 'http://static.feed.rbc.ru/rbc/export/lg/quoters.json',
		online: 'http://stb.live.rbctv.ru:8080/',
		weather: 'http://geoinfo.rbc.ru/JSONP/',
		weatherCity: 'http://static.feed.rbc.ru/rbc/export/lg/getCitiesCount.json'
	},	
	upInterval: {
		weather: 1800000,
		newsInit: 300000,
		news: 1800000
	},
	cityListInterval: 500,
	viewNewsNumber: 8
};