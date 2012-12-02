SmartJS.widgets.Weather.weather = (function() {

/*
* Обновляет данные о погоде в виджете
* Читает куки. Если есть, то берет значение города из них; если нет, то определяет город по IP юзера
* Если передать агрумент (зона), будет брать данные для указанной зоны
*/
function upWeather ( request ) {
    if( request ){
        ajaxRequest( Settings.geoinfoAPI.getDataByZone( request ) );
    }else{
        if ( localStorage.getItem( 'userAlias' ) ) {
            ajaxRequest( Settings.geoinfoAPI.getDataByZone( localStorage.getItem( 'userAlias' ) ) );
        }else{
            ajaxRequest( Settings.geoinfoAPI.getDataByClientIp() );
        };
    };
};

function ajaxRequest ( request ) {
    $.ajax({
        url: request,
        dataType: 'jsonp',
        success: function( _data ) {
            setVariables( _data );
        }
    });
};

function setCookie() {
    if ( !$.cookie( 'userAlias' ) ) {
        $.cookie( 'userAlias', Settings.userAlias );
    };
};

function setLocalStorage ( city ) {
    localStorage.setItem( 'userAlias', city );
};

/*
* Сохраняет DOM элементы страницы, в которые будет записывать значение
*/
 function saveEl() {
    var Settings = SmartJS.widgets.Weather.settings;

    //Элементы для актуальной сейчас погоды
    Now = {
        $top_temp: $('.header-weather_temp')
        ,$top_phenomenon: $('.header-weather_icon .ico_weather')
        ,$top_windDirection: $('.header-weather_wind .ico-wind_direction')
        ,$top_windVariable: $('.header-weather_wind .wind_variable')
        ,$top_weather_temp: $('.header-weather_temp')
        ,$top_curCity: $('.header-weather_city')

        ,$cityName: $('.city_name')
        ,$time: $('.now .time')
        ,$temp: $('.now .variable')
        ,$phenomenon: $('.now .phenomenon_now')
        ,$phenomenon_descr: $('.now .descripton')
        ,$windDirection: $('.accordian-data_weather_headling .wind_direction')
        ,$windVariable: $('.accordian-data_weather_headling .wind_variable')
        ,$humidity: $('.accordian-data_weather_headling .humidity .variable')
    };
    Settings.weatherEl.now = Now;

    //Элементы для списка дней
    for (var i = 0; i < 4; i++) {
        var Day = {
            $headlingDate: $('.accordian-data_weather_days .date:nth-child('+ ( i+1 ) +') .date_nim')
            ,$phenomenon: $('.accordian-data_weather_days .date:nth-child('+ ( i+1 ) +') .ico_weather')
            ,$temp: $('.accordian-data_weather_days .date:nth-child('+ ( i+1 ) +') .variable')
            ,$descripton: $('.accordian-data_weather_days .date:nth-child('+ ( i+1 ) +') .descripton')
        };
        Settings.weatherEl.days.push( Day );
    };
};

/*
* Записывает значения огоды на страницу
*/
function setVariables( _data ) {
	$('.accordian-data_weather_days').css('background', 'none');	
    for (var i in _data){
        var city = _data[ i ],
            cityTime = new Date (),
            now = Settings.weatherEl.now;

        Settings.userAlias = city.alias;
        setLocalStorage( Settings.userAlias );


            //Записываем актуальную сейчас погоду
            now.$top_weather_temp.html( city.weather.day0.day.temp +'...'+ city.weather.day0.night.temp );
            now.$top_curCity.html( city.name );
            now.$top_phenomenon.attr( 'data-phenomenon', city.weather.phenomenon );
            now.$top_windDirection.attr( 'data-direction', city.weather.wind.direction );
            now.$top_windVariable.html( city.weather.wind.min + ' м/c' );

            now.$cityName.html( city.name );
            now.$time.html( cityTime.getDate() +' '+ getRUMonth(cityTime.getMonth()) +' '+ cityTime.getHours() +':'+ curMinutes(cityTime.getMinutes() ) );
            now.$temp.html( city.weather.temp + '&deg;C');
            now.$phenomenon.attr( 'data-phenomenon', city.weather.phenomenon );
            now.$phenomenon_descr.html( city.weather.phenomenon_descr );
            now.$humidity.html( city.weather.humidity.min +'%' );
            now.$windDirection.attr( 'data-direction', city.weather.wind.direction );
            now.$windVariable.html( city.weather.wind.min + ' м/c' );

            //Записываем прогноз на след дни
            for (var k = 0; k < 4; k++) {
                var dayCounter = 'day' + k;
                
                dataDay = city.weather[ dayCounter ];
                day = Settings.weatherEl.days[ k ];
                
                var month = getRUMonth( new Date( dataDay.day.date *1000).getMonth() )
                    ,numDay = new Date( dataDay.day.date *1000).getDate();


                $( day.$headlingDate ).html( numDay + ' ' +   month );

                for (var b = 0; b < 2; b++) {
                    if ( b == 0 ) {
                        $( day.$phenomenon[b] ).attr( 'data-phenomenon', dataDay.day.phenomenon );
                        $( day.$temp[b] ).text( dataDay.day.temp );
                        $( day.$descripton[b] ).text( dataDay.day.phenomenon_descr );
                    } else {
                        $( day.$phenomenon[b] ).attr( 'data-phenomenon', dataDay.night.phenomenon );
                        $( day.$temp[b] ).text( dataDay.night.temp );
                        $( day.$descripton[b] ).text( dataDay.night.phenomenon_descr );
                    };
                };
            };
        };
};

function getRUMonth( numMonth ) {
    var arrMonth = [
        "Января"
        ,"Февраля"
        ,"Марта"
        ,"Апреля"
        ,"Мая"
        ,"Июня"
        ,"Июля"
        ,"Августа"
        ,"Сентября"
        ,"Октября"
        ,"Ноября"
        ,"Декабря"
    ];

    return arrMonth[ numMonth ];
};

function curMinutes( minutes ) {
    if ( minutes < 10) {
        return '0' + minutes;
    };

    return minutes;
};

return {
    upWeather: upWeather
    ,saveEl: saveEl
};

})();