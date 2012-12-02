SmartJS.widgets.Weather.cityList = (function() {
var Settings = SmartJS.widgets.Weather.settings,
    cityListEl = {},
    letterList = false,
    arrLatter = [
            [ 'а', [] ],
            [ 'б', [] ],
            [ 'в', [] ],
            [ 'г', [] ],
            [ 'д', [] ],
            [ 'е', [] ],
            [ 'ж', [] ],
            [ 'з', [] ],
            [ 'и', [] ],
            //[ 'й', [] ],
            [ 'к', [] ],
            [ 'л', [] ],
            [ 'м', [] ],
            [ 'н', [] ],
            [ 'о', [] ],
            [ 'п', [] ],
            [ 'р', [] ],
            [ 'с', [] ],
            [ 'т', [] ],
            [ 'у', [] ],
            [ 'ф', [] ],
            [ 'х', [] ],
            [ 'ч', [] ],
            [ 'ш', [] ],
            [ 'э', [] ],
            [ 'ю', [] ],
            [ 'я', [] ]
        ];

function openPopup () {    
    SmartJS.widgets.Weather.navigation.cityListKeyNavigation( true );
    // Если список городов не был открыт
    if ( $(cityListEl.$wrapEl).length == 0 ) {
        $('.weather-popup').show();
        getCityList();
    } else {
    	$('.body-popup').find( 'ul:first-child li:first-child a' ).parent().addClass( 'active' );
    };
    closeLetter();
    $('.weather-popup').show();
    $('body').live( 'click', cityListMouseNavigation );
    $('.widget-back').show();
    $('.widget-back').live('click', function(){
    	closePopUp();  
    });
};

function closePopUp () {
	$('.weather-popup').unbind( 'keyup' );
	$('.weather-popup').unbind( 'keydown' );
	$('body').die( 'click' );
    $('.weather-popup').hide();
    $( document ).unbind('keyup');
    $( document ).unbind('keydown');
    SmartJS.controllers.navigation.keys.init();
    SmartJS.widgets.Weather.navigation.bindEvents();
    $('.change-city').show();
    $('.widget-back').die('click');
    $('.widget-back').hide();
    $('.weather-popup li').removeClass('active');
};

function getCityList () {
    $.ajax({
        url: SmartJS.settings.sources.weatherCity,
        dataType: 'jsonp',
        jsonpCallback: 'callbackGetCitiesAll',
        success: function( _data ) {
            upCityList( _data );
        	$('.body-popup').css('background-image', 'none');
            //Делаем активным перый элемент списка, если нет активного пунктв            
            cityListEl.$wrapEl.find( 'ul:first-child li:first-child a' ).parent().addClass( 'active' );
        }
    });;
};


/*
* Формирует список городов
*/
function upCityList ( _data ) {
    var maxColumnList = 6,
        arrCity = [],
        count = 0;

        getLetter( _data );
        drawLetterList();

    for (var city in _data) {
        count++;
        arrCity[count] = [];
        arrCity[count][0] = _data[city].name_rus;
        arrCity[count][1] = _data[city].name_eng;
        arrCity[count][2] = _data[city].nick;
    };
    arrCity.sort();
    
    cityListEl.$wrapEl = $('.weather-popup .body-popup');

    cityListEl.$wrapEl.empty();
    var currentCity = []
      , capitals = [];

    for (var k = 0; k < arrCity.length; k++) {
        if ( arrCity[ k ] ) {
            if (   arrCity[ k ][0] == 'Москва'
                || arrCity[ k ][0] == 'Санкт-Петербург'
                || arrCity[ k ][0] == 'Астана'
                || arrCity[ k ][0] == 'Владивосток'
                || arrCity[ k ][0] == 'Волгоград'
                || arrCity[ k ][0] == 'Воронеж'
                || arrCity[ k ][0] == 'Екатеринбург'
                || arrCity[ k ][0] == 'Ижевск'
                || arrCity[ k ][0] == 'Иркутск'
                || arrCity[ k ][0] == 'Казань'
                || arrCity[ k ][0] == 'Калининград'
                || arrCity[ k ][0] == 'Кемерово'
                || arrCity[ k ][0] == 'Киев'
                || arrCity[ k ][0] == 'Кишинев'
                || arrCity[ k ][0] == 'Краснодар'
                || arrCity[ k ][0] == 'Красноярск'
                || arrCity[ k ][0] == 'Лондон'
                || arrCity[ k ][0] == 'Минск'
                || arrCity[ k ][0] == 'Мюнхен'
                || arrCity[ k ][0] == 'Нижний Новгород'
                || arrCity[ k ][0] == 'Новосибирск'
                || arrCity[ k ][0] == 'Нью-Йорк'
                || arrCity[ k ][0] == 'Омск'
                || arrCity[ k ][0] == 'Пермь'
                || arrCity[ k ][0] == 'Рига'
                || arrCity[ k ][0] == 'Ростов-на-Дону'
                || arrCity[ k ][0] == 'Самара'
                || arrCity[ k ][0] == 'Саратов'
                || arrCity[ k ][0] == 'Томск'
                || arrCity[ k ][0] == 'Уфа'
                || arrCity[ k ][0] == 'Франкфурт'
                || arrCity[ k ][0] == 'Ханты-Мансийск'
                || arrCity[ k ][0] == 'Челябинск' ) {

                // Записываем столицы в отдельны массив, что бы вынести их в первые элементы
                if (   arrCity[ k ][0] == 'Москва'
                    || arrCity[ k ][0] == 'Санкт-Петербург' ) {
                    capitals.push( arrCity[ k ] );
                    continue;
                };

                currentCity.push( arrCity[ k ] );
                continue;
            };
        };
        
    };
    // Объеденяем столицы с остальными городами
    currentCity = capitals.concat( currentCity );

    var maxHeightColumn = Math.round( currentCity.length / maxColumnList );

    //Создаем список с городами
    for (var i = 0; i < maxColumnList; i++) {

        cityListEl.$wrapEl.append( '<ul></ul> ' );

        for (var k = maxHeightColumn * i; k < maxHeightColumn * ( i + 1 ); k++){

            if ( currentCity[ k ] ) {

                var item =  '<li id="'+ currentCity[ k ][1] +'" data-nick="'+ currentCity[ k ][2] +'">'+
                                '<a href="#"><span>'+ currentCity[ k ][0] + '</span>' +
                                '<i class="s_top"></i>'+
                                '<i class="s_right"></i>'+
                                '<i class="s_bottom"></i>'+
                                '<i class="s_left"></i>'+
                                '</a>'+
                            '</li> ';

                cityListEl.$wrapEl.find( 'ul:last-child' ).append( item );
                continue;
                

            };

        };
    };
};

function getLetter ( _data ) {
    
    for( var city in _data ){
        var name = _data[city].name_rus
          , firstLetter = name.slice(0, 1).toLowerCase();

        for( var i = 0; i < arrLatter.length; i++ ){
            if ( firstLetter == arrLatter[i][0] ) {
                arrLatter[i][1].push( _data[ city ] );
            };
        };
    };
    for (var i = 0; i < arrLatter.length; i++) {
        arrLatter[i][1].sort( sortObjCity );
    };
    return arrLatter;
};

/*
 * Сортирует объекты городов
 */
function sortObjCity ( a, b ) {
    var a = a.name_rus
      , b = b.name_rus;

    if ( a < b ) {
        return -1;
    };

    if ( a > b ) {
        return 1;
    };

    return 0;
};

function drawLetterList () {
    if ( !letterList ) {
        letterList = true;
        for(var i = 0; i<arrLatter.length; i++){
            var item = '<li> <a href="javascript: void(0);">'+ arrLatter[i][0]+ '<i class="s_top"></i>'
                        + '<i class="s_right"></i>'
                        + '<i class="s_bottom"></i>'
                        + '<i class="s_left"></i>'
                        + '</a></li> ';

            $('.weather-popup .letter-list ul').append( item );
        };
    };
};

function selectLetter ( letter ) {
    $('.city-letter').empty().scrollTop( 0 );

    $('.alphabet').css({
        marginTop: -225
    });
    var letter = letter.toLowerCase()
      , cityArr = [];
    for (var i = 0; i < arrLatter.length; i++) {
        if ( arrLatter[i][0] == letter ) {
            cityArr = arrLatter[i][1];
        };
    };

    
    drawColumn(cityArr);
};

function closeLetter () {
	activeLetterList = false;
	activeLetter = false;
	changeCity = false;
    $('.city-letter').empty().scrollTop( 0 );
    $('.alphabet').css({
        marginTop: 0
    });
};

function drawColumn ( city ) {
    // Добовляем новую калонку
    var maxColumnList = 6
      , maxHeightColumn = Math.round( city.length / maxColumnList );

    for (var i = 0; i < maxColumnList; i++) {

        $('.city-letter').append( '<ul></ul>  ' );

        // Записываем элементы в колонку
        for (var k = maxHeightColumn * i; k < maxHeightColumn * ( i + 1 ); k++){

            if ( city[ k ] ) {
                
                $('.city-letter').find( 'ul:last-child' )
                .append( '<li id="'+ city[ k ].name_eng +'" data-nick="'+ city[ k ].nick +'">'
                            + '<a href="#">'+ city[ k ].name_rus
                            + '<i class="s_top"></i>'
                            + '<i class="s_right"></i>'
                            + '<i class="s_bottom"></i>'
                            + '<i class="s_left"></i>'
                            + '</a>'
                        + '</li> ' );

            };

        };
    };  
};

/*--------------------List navigation------------------*/

/*
 * Скролим вниз новости
 */
function scrollDown () {
	var $el = $('.city-letter')
	  , scroll = $el.scrollTop();
	$el.scrollTop( scroll + 20 );
};

/*
 * Скролим вверх новости
 */
function scrollUp () {
	var $el = $('.city-letter')
	  , scroll = $el.scrollTop();
	$el.scrollTop( scroll - 20 );
};

var activeLetterList = false
  , activeLetter = false
  , changeCity = false 
  , showLetterListDalay;

function moveRight () {
	if( cityListEl.$wrapEl ){		
	    if ( activeLetter ) {
	        var $prevActive = $('.city-letter li.active')
	          , $activeMain = $('.city-letter').find('ul').eq( $prevActive.parent().index()+1 ).find('li').eq( $prevActive.index() );
	          
	        if ( $activeMain.length == 0 ) {
	        	$activeMain = $('.city-letter').find('ul').eq( 0 ).find('li').eq( $prevActive.index() );
	        };
	
	        $('.city-letter li').removeClass('active');
	        $activeMain.addClass('active');
	        return;
	    };
	
	    if ( activeLetterList ) {	
	        var $activeSub = $('.letter-list li.active')
	          , $next = $activeSub.next();
	
	        if ( $next.length == 0 ) {
	            $next = $('.letter-list li:first-child');
	        };
	
	        $('.letter-list li').removeClass( 'active' );
	        $next.addClass( 'active' );
	
	        changeCity = true;
	        clearTimeout( showLetterListDalay );
	        showLetterListDalay = setTimeout(function(){
	            var letter = $('.letter-list li.active').text();
	            letter = $.trim(letter);
	            selectLetter( letter );
	            changeCity = false;
	            return;
	
	        }, 500);
	        
	        return;
	    };
	
	    var $active = cityListEl.$wrapEl.find( 'li.active' )
	      , $nextEl = cityListEl.$wrapEl.find( 'ul' ).eq( $active.parent().index()+1 ).find( 'li' ).eq( $active.index() );
	
	    cityListEl.$wrapEl.find( 'li' ).removeClass( 'active' );
	
	    if ( $active.parent().index()+1 == 6
	        || $nextEl.length == 0 ) {
	        cityListEl.$wrapEl.find( 'ul' ).eq( 0 ).find( 'li' ).eq( $active.index() ).addClass( 'active' );
	    };
	
	    $nextEl.addClass( 'active' );
	};
};

function moveLeft () {

    if ( activeLetter ) {
        var $prevActive = $('.city-letter li.active')
          , $activeMain = $('.city-letter').find('ul').eq( $prevActive.parent().index()-1 ).find('li').eq( $prevActive.index() );
          
        

        $('.city-letter li').removeClass('active');
        $activeMain.addClass('active');
        return;
    };

    if ( activeLetterList ) {
        var $activeSub = $('.letter-list li.active')
          , $prev = $activeSub.prev();
        if ( $prev.length == 0 ) {
            $prev = $('.letter-list li:last-child');
        };

        $('.letter-list li').removeClass( 'active' );
        $prev.addClass( 'active' );

        
        changeCity = true;
        clearTimeout( showLetterListDalay );
        showLetterListDalay = setTimeout(function(){
            var letter = $('.letter-list li.active').text();
            letter = $.trim(letter);
            selectLetter( letter );
            changeCity = false;
            return;

        }, 500);
        
        return;
    };

    var $active = cityListEl.$wrapEl.find( 'li.active' )
      , $prevEl = cityListEl.$wrapEl.find( 'ul' ).eq( $active.parent().index()-1 ).find( 'li' ).eq( $active.index() );

    cityListEl.$wrapEl.find( 'li' ).removeClass( 'active' );
    
    if ( $active.parent().index()-1 == -1 ) {
        if ( cityListEl.$wrapEl.find( 'ul' ).eq( 5 ).find( 'li' ).eq( $active.index() ).length == 0 ) {
            cityListEl.$wrapEl.find( 'ul' ).eq( 4 ).find( 'li' ).eq( $active.index() ).addClass( 'active' );
            
        }else{
            cityListEl.$wrapEl.find( 'ul' ).eq( 5 ).find( 'li' ).eq( $active.index() ).addClass( 'active' );
        };

    };
    $prevEl.addClass( 'active' );
};

function moveDown () {
    
    if ( activeLetter ) {
        var $prevActive = $('.city-letter li.active')
          , $activeMain = $('.city-letter li.active').next();
        if ( $activeMain.length == 0 ) {
        	$activeMain = $prevActive.parent().find('li:first-child');
        };
        
        $('.city-letter li').removeClass('active');
        $activeMain.addClass('active');
        scrollDown();
        return;
    };

    if ( activeLetterList ) {
        var $next = $('.city-letter ul:first-child li:first-child');

        if ( $next.length == 0 || changeCity ) {
            return;
        };

        $('.letter-list li').removeClass( 'active' );
        $next.addClass('active');
        activeLetterList = false;
        activeLetter = true;  
        return;
    };

    var $active =  cityListEl.$wrapEl.find( 'li.active' );
    cityListEl.$wrapEl.find( 'li' ).removeClass( 'active' );
    
    if ( $active.next().length == 0 ) {
        $('.letter-list li:first-child').addClass('active');
        activeLetterList = true;

        clearTimeout( showLetterListDalay );
        showLetterListDalay = setTimeout(function(){
            var letter = $('.letter-list li.active').text();
            letter = $.trim(letter);
            selectLetter( letter );
            return;

        }, SmartJS.settings.cityListInterval);

        return false;
    };

    $active.next().addClass( 'active' );
};

function moveUp () {

    if ( activeLetter ) {
        var $activeMain = $('.city-letter li.active').prev();
        if ( $activeMain.length == 0 ) {
            $('.city-letter li.active').removeClass( 'active' );
            $('.letter-list li:first-child').addClass('active');
            activeLetter = false;
            activeLetterList = true;
        };

        $('.city-letter li').removeClass('active');
        $activeMain.addClass('active');
        scrollUp();
        return;
    };

    if ( activeLetterList ) {
        $('.letter-list li').removeClass( 'active' );
        cityListEl.$wrapEl.find( 'ul:first-child li:first-child' ).addClass('active');
        closeLetter();
        activeLetterList = false;
        return;
    };

    var $active =  cityListEl.$wrapEl.find( 'li.active' );

    cityListEl.$wrapEl.find( 'li' ).removeClass( 'active' );
    
    if ( $active.prev().length == 0 ) {
        $('.letter-list li:first-child').addClass('active');
        activeLetterList = true;

        clearTimeout( showLetterListDalay );
        showLetterListDalay = setTimeout(function(){
            var letter = $('.letter-list li.active').text();
            letter = $.trim(letter);
            selectLetter( letter );
            return;

        }, SmartJS.settings.cityListInterval);

    };

    $active.prev().addClass( 'active' );
    return false;
};

function selectCity () {

    if ( activeLetterList && !activeLetter ) {
        var letter = $('.letter-list li.active').text();
        letter = $.trim(letter);

        selectLetter( letter );
        return;
    };

    var $active =  $('.weather-popup').find( 'li.active' ).attr( 'data-nick' );
    activeLetterList = false;
    activeLetter = false;
    closePopUp();
    SmartJS.widgets.Weather.weather.upWeather( $active );
}

function cityListMouseNavigation ( e ) {
    e.target = $(e.target);
    // Если нажали не на ccылку
    if ( !e.target.attr( 'href' ) ) {
    	e.target = e.target.parent();
    	if ( !e.target.attr( 'href' ) ) {
	        $('.weather-popup').find( 'li.active a' );
	        return false;
    	}
    };

    $('.weather-popup').find( 'li' ).removeClass( 'active' );

    // Если нажали на выбор буквы
    if ( e.target.parents('div.letter-list').hasClass('letter-list') ) {
        var letter = e.target.text();
        e.target.parent().addClass( 'active' );
        letter = $.trim(letter);
        activeLetterList = true;
        selectLetter( letter );
        return;
    };

    $( e.target ).parent().addClass( 'active' );

    var $activeNick =  $('.weather-popup').find( 'li.active' ).attr( 'data-nick' );
    closePopUp();
    SmartJS.widgets.Weather.weather.upWeather( $activeNick );
};

/*--------------------/List navigation------------------*/

return {
     openPopup: openPopup
   , closePopUp: closePopUp
   , getCityList: getCityList
   , moveUp: moveUp
   , moveRight: moveRight
   , moveDown: moveDown
   , moveLeft: moveLeft
   , selectCity: selectCity
};

})();