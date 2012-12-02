SmartJS.widgets.News.navigation = (function() {
	   var $list = {}
	      , $activeNews = {}
	      , type = ''
	      , key = '';
	   
	   /* Управление галерей: лево, право, ввод. */
	   function bindEvents(){
	        $(document).keyup(function ( e ) {
	        	key = SmartJS.controllers.navigation.dictionary[ e.which ];
		        switch( key ) {
		            case 'left':
			        	$('.accordian-data_news-pic').removeClass('hover');
		            	handleLeft();
		                break;
		            case 'right':
			        	$('.accordian-data_news-pic').removeClass('hover');
		            	handleRight();
		                break;
		            case 'enter':
		            	handleEnter();
		            	break;
		        };	            
	        });	
	   };

	   /* Перелистывание картинок новостей влево. 
	    * Берем из localStorage предыдущую новость по id.
	    * Вставляем ее в галерею.
	    * Последнюю новость удаляем. */
	   function handleLeft() {
	    	type = $('.ui-accordion-content-active').attr('id');
	        $list = $( '#' + type + ' .accordian-data_news-gallery' );        
	        $activeNews = $( '#' + type + ' .accordian-data_news-pic.active' );
	        var newsNumber = $('#' + type + ' .accordian-data_news-pic').length;
	        if ( newsNumber > 1){
		    	var currentPosition = $activeNews.attr( 'data-id' ),
		        	prevItem = getPrevItem( currentPosition ),
		        	list = '',
		        	item,
		        	titleHeight = 0;
		        
		        prevItem.data.id = prevItem.i;           
		        item = SmartJS.widgets.News.galleryNews.tmplImg( prevItem.data );       
		        list = SmartJS.widgets.News.galleryNews.tmplText( prevItem.data );
		        $('#' + type + ' .accordian-data_news-text').html( list );	       
		        	
		        titleHeight = $('#' + type + ' .accordian-data_news-title').height();
		        if ( titleHeight > 64 ){
		        	$('#' + type + ' .accordian-data_news-date').addClass('abs-right');
		        } else{
		        	$('#' + type + ' .accordian-data_news-date').removeClass('abs-right');
		        }
		        
		        $activeNews.removeClass( 'active' ).removeClass( 'hover' );
		        $list.prepend( item ).find( '.accordian-data_news-pic:first' ).hide().css( 'width', 0 ).show().css( 'width', 274 ).addClass( 'active' ).addClass( 'hover' );
		        $list.find( '.accordian-data_news-pic:last' ).remove();
	        };
	        var position = parseInt( $( '#' + type + ' .accordian-data_news-pic.active' ).attr('data-id') ) + 1;
        	$('.' + type + ' .news-number').html( position );
	    };
	    
	    /* Перелистывание картинок новостей вправо. 
		 * Берем из localStorage следующую новость после загруженных по id.
		 * Вставляем ее в галерею.
		 * Первую новость удаляем. */
	    function handleRight() {
	    	type = $('.ui-accordion-content-active').attr('id');
	        $list = $( '#' + type + ' .accordian-data_news-gallery' );        
	        $activeNews = $( '#' + type + ' .accordian-data_news-pic.active' );	    	
	        var newsNumber = $('#' + type + ' .accordian-data_news-pic').length;
		    if ( newsNumber > 1){
		        var currentPosition = $list.find('.accordian-data_news-pic.active').attr( 'data-id' ),
		        	nextItem = getNextItem( currentPosition ),
		        	lastPosition = $list.find('.accordian-data_news-pic:last').attr( 'data-id' ),
		        	lastItem = getNextItem( lastPosition ),
		        	item,
		        	list = '',
		        	titleHeight = 0;
		        
		        list = SmartJS.widgets.News.galleryNews.tmplText( nextItem.data );
		        $('#' + type + ' .accordian-data_news-text').html( list );	
		        
		        titleHeight = $('#' + type + ' .accordian-data_news-title').height();
		        
		        if ( titleHeight > 64 ){
		        	$('#' + type + ' .accordian-data_news-date').addClass('abs-right');
		        } else{
		        	$('#' + type + ' .accordian-data_news-date').removeClass('abs-right');
		        }
		        
		        lastItem.data.id = lastItem.i;   
		        item = SmartJS.widgets.News.galleryNews.tmplImg( lastItem.data );
		        
		        $activeNews.css( 'width', 0 );
		        $activeNews.next().addClass( 'active' ).addClass( 'hover' );
		        $activeNews.remove();	        
		        $list.append( item );
		     };
		    var position = parseInt( $( '#' + type + ' .accordian-data_news-pic.active' ).attr('data-id') ) + 1;
       		$('.' + type + ' .news-number').html( position );	     
	    };
	    
	    /* Показываем подробную информацию по новости.
	     * Изменяем навигацию в режиме подробного просмотра новости. */
	    function handleEnter( $news ){
	    	var newsNumber =  0,
	    		$activeNews = $('.accordian-data_news-pic.hover');
	    	
	    	if ( $news ){
	    		$activeNews = $news;
	    	};
	    	
	    	newsId = parseInt( $activeNews.attr('data-id'), 10);
	    	newsNumber =  newsId + 1;
	    	type = $('.ui-accordion-content-active').attr("id");	    	
			$('.' + type + ' .news-number').html( newsNumber );	
	    	bindNewsEvents();
	    	SmartJS.widgets.News.fullNews.viewNews( type, newsId );  
	    };
	    
	    /* Отключаем глобальную навигацию.
	     * Активируем навигацию вкладки: назад, следующая новость, предыдущая новость, скролл верх, скролл вниз. */
	    function bindNewsEvents(){
	    	$( document ).unbind('keyup');
	    	$( document ).unbind('keydown');	    	

	    	$('.widget-back').die('click');
	    	$('.widget-back').live('click', function(){
	    		unbindNewsEvents();
	    	});
	        $(document).keyup(function ( e ) {
	        	key = SmartJS.controllers.navigation.dictionary[ e.which ];
		        switch( key ) {
		        	/* Управление влево и вправо присутствует на вкладках главных новостей и дэйли. */
		            case 'left':
		            	handleNewsLeft();
		            	restartScroll();
		                break;
		            case 'right':
		            	handleNewsRight( true );
		            	restartScroll();
		                break;
		            /* Управление вверх и вниз присутствует на вкладке РБК-ТВ */
		            case 'up':
		            	handleNewsUp();
		            	scrollUp();
		                break;
		            case 'down':
		            	handleNewsDown();
		            	scrollDown();
		                break;	 
		            case 'play':
		            	SmartJS.widgets.News.play.executeAction('play');
		            	break;
		            case 'pause':
		            	SmartJS.widgets.News.play.executeAction('pause');
		            	break;	
		            case 'stop':
		            	SmartJS.widgets.News.play.executeAction('stop');
		            	break;		
		            case 'qmenu':
		            	SmartJS.widgets.News.play.executeAction('qmenu');
		            	break;	            	
		            case 'enter':
		            	handleNewsEnter();
		            	break;
		            case 'esc':
		            	if ( $('.online-popup').is(":visible") ){
		            		SmartJS.widgets.News.fullNews.closeOnline();
		            	} else {
		            		unbindNewsEvents();
		            	};
		            	break;	
		    	};
	        });			    
	    };

	    /*
		 * Возвращаем скролл на место
	     */
	    function restartScroll () {
	    	var $el = $('.accordian-data_news-info');
			$el.scrollTop( 0 );
	    };

	    /*
		 * Скролим вниз новости
	     */
	    function scrollDown () {
	    	var $el = $('.accordian-data_news-info')
	    	  , scroll = $el.scrollTop();
			$el.scrollTop( scroll + 20 );
	    };

	    /*
		 * Скролим вверх новости
	     */
	    function scrollUp () {
	    	var $el = $('.accordian-data_news-info')
	    	  , scroll = $el.scrollTop();
			$el.scrollTop( scroll - 20 );
	    };
	    
	    /* В вкладке РБК-ТВ при переходе по программе меняем видео. */
	    function changeVideo ( src ){
	    	var $currentPosition = {},
	    		video = '',
	    		object = ''; 
	    	
	    	if ( src ){
	    		video = src;
	    	} else {
	    		$currentPosition = $('.archive-programm-list li.active');
	    		video = $currentPosition.attr('data-src');	    		
	    	};

    		object = '<object width="640" height="428" downloadable="false" autostart="true" type="application/x-netcast-av" data="' + video + '" id="media"></object>';
    		$('#play').html( object );
    		
    		SmartJS.widgets.News.play.init();
	    };	    
	     function handleNewsEnter(){
	    	 if ( (type === 'rbctv') || ( type === 'main' ) ){
	    		 if (  $('#playButton').hasClass('active') || $('#pauseButton').hasClass('active') ){
	    			 SmartJS.widgets.News.play.executeAction('playToggle');
	    		 };
	    		 if ( $('#stopButton').hasClass('active') ){
	    			 SmartJS.widgets.News.play.executeAction('stop');
	    		 };
	    		 if ( $('#fullButton').hasClass('active') ){
	    			 SmartJS.widgets.News.play.executeAction('full');
	    		 };
	    		 if ( $('#widget-back').hasClass('active') ){
	    			 SmartJS.widgets.News.fullNews.closeOnline();
	    		 };
	    		 if ( $('#qmenu').hasClass('active') ){
	    			 SmartJS.widgets.News.play.executeAction('qmenu');
	    		 };
	    	 };
	     };
	    /* На вкладке РБК-ТВ листаем программу вверх. */
	    function handleNewsUp(){
	        var $currentPosition = {},
	        position = 0,
	        total = 0;
	        type = $('.ui-accordion-content-active').attr('id');        
	        if ( type === 'rbctv' ){	
	        	$('#controls a').removeClass('active');
	        	$('#fullButton').hide();
	        	$('#playButton').hide();
	        	$('#pauseButton').show();
	        	$('#pauseButton').addClass('active');
	        	
	        	$currentPosition = $('.archive-programm-list li.active');
	        	if( $currentPosition.prev().attr('data-src') ){
		        	$currentPosition.prev().addClass('active');
		        	$currentPosition.removeClass('active');	   
		        	$('.archive-programm-list li:visible:last').hide();	
		        	changeVideo ( $currentPosition.prev().attr('data-src') );
	        	};
		        position = parseInt( $('.' + type + ' .news-number').html(), 10) + 1;
		        total = parseInt( $('.' + type + ' .news-total').html(), 10) + 1;
	        	if ( position === total){
	        		$('.' + type + ' .news-number').html( position - 1 );
	        	} else {
	        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) + 1 );
	        	};
	        };
	        if( ( type === 'daily' ) || ( type === 'main' ) ){
	        	scrollUp();
	        };
	    };
	    
	    /* На вкладке РБК-ТВ листаем программу вниз. */
	    function handleNewsDown(){
	        var $currentPosition = {},
	    	position = 0;
	        type = $('.ui-accordion-content-active').attr('id');
	        
	        if ( type === 'rbctv' ){
	        	$currentPosition = $('.archive-programm-list li.active');
	        	if( !$('.archive-programm-list li.active').next().hasClass('prog-tv') ){
		        	$currentPosition.next().addClass('active');
		        	$currentPosition.removeClass('active');	   
		        	$('.archive-programm-list li:visible:last').next().show();	
		        	changeVideo ( $currentPosition.next().attr('data-src') );
		        	if( $('.archive-programm-list li.active').hasClass('live-st') ){
		        		$('#tv-video').addClass('live-video');
		        		$('#fullButton').show();
		        	};
	        	};
		        position = parseInt( $('.' + type + ' .news-number').html(), 10) - 1;
	        	if ( position === 0){
	        		$('.' + type + ' .news-number').html( '1' );
	        	} else {
	        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) - 1 );
	        	};
	        };
	        if( ( type === 'daily' ) || ( type === 'main' ) ){
	        	scrollDown();
	        };
	    };	    
	       
	    /* Отображаем предыдущую новость за просматриваемой. */
	    function handleNewsLeft( ) {
	        var currentPosition = 0,
		    	position = 0,
		    	total = 0;
	        type = $('.ui-accordion-content-active').attr('id');
	        
	        if ( type === 'daily' ){
		        currentPosition = $('.daily-news').attr('data-id'),       
		        prevItem = getPrevItem( currentPosition ); 
		        $activeNews = $( '#' + type + ' .daily-news' );
		        prevItem.data.id = prevItem.i;
		        updateFullNewsDaily( prevItem );
		        position = parseInt( $('.' + type + ' .news-number').html(), 10) - 1;
	        	total = parseInt( $('.' + type + ' .news-total').html(), 10);
	        	if ( position === 0){
	        		$('.' + type + ' .news-number').html( total );
	        	} else {
	        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) - 1 );
	        	};
	        };
	        if ( type === 'main' ){
	        	var $daily = $('.daily-news');
	        	if ( $('#controls').is(":visible") ){	       	
		        	if ( $daily.hasClass('active') ){
		        		$daily.removeClass('active');
		        		$('#stopButton').addClass('active');
		        	} else {
			        	var $new = $('#controls a.active').prev();
			        	if ( !$new.is(':visible') ){
			        		$new = $new.prev();
			        	};
			        	var $active = $('#controls a.active');
			        	if ( $new.attr('id') ){
			        		$new.addClass('active');
			        		$active.removeClass('active');
			        	} else {
					        currentPosition = $('.daily-news').attr('data-id'),       
					        prevItem = getPrevItem( currentPosition ); 		                
					        $activeNews = $( '#' + type + ' .daily-news' );
					        prevItem.data.id = prevItem.i;		        
					        updateFullNewsMain( prevItem );	   
					        position = parseInt( $('.' + type + ' .news-number').html(), 10) - 1;
				        	total = parseInt( $('.' + type + ' .news-total').html(), 10);
				        	if ( position === 0){
				        		$('.' + type + ' .news-number').html( total );
				        	} else {
				        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) - 1 );
				        	};		        		
			        	};        		
		        	};
	        	} else {
			        currentPosition = $('.daily-news').attr('data-id'),       
			        prevItem = getPrevItem( currentPosition ); 		                
			        $activeNews = $( '#' + type + ' .daily-news' );
			        prevItem.data.id = prevItem.i;		        
			        updateFullNewsMain( prevItem );	   
			        position = parseInt( $('.' + type + ' .news-number').html(), 10) - 1;
		        	total = parseInt( $('.' + type + ' .news-total').html(), 10);
		        	if ( position === 0){
		        		$('.' + type + ' .news-number').html( total );
		        	} else {
		        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) - 1 );
		        	};	
	        	};
	        };	
	        
	        if ( type === 'rbctv' ){
	        	var $active = $('#controls a.active'),
	        	    $new = $active.prev();
	        	if ( !$new.is(':visible') ){
	        		$new = $new.prev();
	        		if ( !$new.is(':visible') && $('.online-popup').is(':visible') ){
	        			$new = $('.widget-back');
	        		};
	        	};	        	
	        	if ( $new.attr('id') ){
	        		$new.addClass('active');
	        		$active.removeClass('active');
	        	}
	        };
	    };  
	    
	    /* Отображаем следующую новость за просматриваемой. */
	    function handleNewsRight( flag ) {
	    	var currentPosition = 0,
		    	position = 0,
		    	total = 0;
	    	type = $('.ui-accordion-content-active').attr('id');
	    	
	    	if ( type === 'daily' ){;
		        currentPosition = $('.daily-news').attr('data-id');       
		        nextItem = getNextItem( currentPosition );		
		        $activeNews = $( '#' + type + ' .daily-news' );	        		        
		        nextItem.data.id = nextItem.i; 
		        updateFullNewsDaily( nextItem ); 
		    	position = parseInt( $('.' + type + ' .news-number').html(), 10) + 1;
	        	total = parseInt( $('.' + type + ' .news-total').html(), 10) + 1;
	        	if ( position === total){
	        		$('.' + type + ' .news-number').html('1');
	        	} else {
	        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) + 1 );
	        	};
	    	};   
	    	if ( type === 'main' ){
	    		var $daily = $('.daily-news');
	    		if ( ( $('#controls').is(":visible")) && flag ){
		        	if ( $daily.hasClass('active') ){	
				        currentPosition = $('.daily-news').attr('data-id');       
				        nextItem = getNextItem( currentPosition );	
				        $activeNews = $( '#' + type + ' .daily-news' );	        		        
				        nextItem.data.id = nextItem.i; 
				        updateFullNewsMain( nextItem );		     
				    	position = parseInt( $('.' + type + ' .news-number').html(), 10) + 1;
			        	total = parseInt( $('.' + type + ' .news-total').html(), 10) + 1;
			        	if ( position === total){
			        		$('.' + type + ' .news-number').html('1');
			        	} else {
			        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) + 1 );
			        	};
		        	} else{	
			        	var $new = $('#controls a.active').next();
			        	if ( !$new.is(':visible')){
			        		$new = $new.next();
			        		if ( !$new.is(':visible')){
				        		$new = $new.next();
				        	};
			        	};
			        	var $active = $('#controls a.active');
			        	if ( $new.attr('id') ){
			        		$new.addClass('active');
			        		$active.removeClass('active');
			        	} else {
			        		$active.removeClass('active');
			        		$daily.addClass('active');
			        	};	        		
		        	};	
	    		} else {    		
			        currentPosition = $('.daily-news').attr('data-id');       
			        nextItem = getNextItem( currentPosition );	
			        $activeNews = $( '#' + type + ' .daily-news' );	        		        
			        nextItem.data.id = nextItem.i; 
			        updateFullNewsMain( nextItem );		     
			    	position = parseInt( $('.' + type + ' .news-number').html(), 10) + 1;
		        	total = parseInt( $('.' + type + ' .news-total').html(), 10) + 1;
		        	if ( position === total){
		        		$('.' + type + ' .news-number').html('1');
		        	} else {
		        		$('.' + type + ' .news-number').html( parseInt( $('.' + type + ' .news-number').html(), 10) + 1 );
		        	};	    			
	    		};
	    	};  
	    	
	        if ( type === 'rbctv' ){
	        	var $active = $('#controls a.active'),
	        		$new = $active.next();

        		if ( $('.online-popup').is(':visible') && $('.widget-back').hasClass('active')){
        			$active = $('.widget-back.active');
        			$new = $('#controls a:visible:first');
        		};
	        	
	        	if ( !$new.is(':visible')){
	        		$new = $new.next();
	        	};
	        	if ( $new.attr('id') && $new.is(':visible')){
	        		$new.addClass('active');
	        		$active.removeClass('active');
	        	};
	        };	    	
	    }; 	    
	    
	    function updateFullNewsDaily( nextItem ){
	        $('.daily-news').attr('data-id', nextItem.data.id);
	        $('.daily-news img').attr('src', nextItem.data.picture);
	        $('.daily-news .accordian-data_news-date_date').html( nextItem.data.date );
	        $('.daily-news .accordian-data_news-date_time').html( nextItem.data.time );
	        $('.daily-news .daily-news-title').html( nextItem.data.title ); 
	        $('.daily-news .daily-news-text').html( SmartJS.widgets.News.fullNews.uncode(nextItem.data.text) ); 	    	
	    };
	    
	    function updateFullNewsMain( nextItem ){
	        $('.daily-news').attr('data-id', nextItem.data.id);
	        $('.daily-news .accordian-data_news-date_date').html( nextItem.data.date );
	        $('.daily-news .accordian-data_news-date_time').html( nextItem.data.time );
	        $('.daily-news .daily-news-title').html( nextItem.data.title ); 
	        $('.daily-news .daily-news-text').html( SmartJS.widgets.News.fullNews.uncode(nextItem.data.text) );  
        	$('.accordian-data_news-images').removeClass('vd');
        	$('.accordian-data_news-info').removeClass('vd');
        	$('.accordian-data_news-images').html('');
        	
	        if ( nextItem.data.video ){
	        	$('.accordian-data_news-images').addClass('vd');
	        	$('.accordian-data_news-info').addClass('vd');
	        	$('#loadingIcon').addClass('mtv');
	        	$('#loadingIcon').show();
	        	$('#controls').addClass('mtv');
	        	$('.accordian-data_news-images').html( '<div class="tv-video" id="tv-video">'
							 + '<div id="play">'
						 	 + '<object width="450" height="300" downloadable="false" autostart="true" type="application/x-netcast-av" data="' + nextItem.data.video + '" id="media">'
						 	 + '<embed 	flashvars="image=images/loading.gif"/>'
							 + '</object>'
						 + '</div>'
						 + '<div id="PlayIcon" style="left: 220px; top: 150px;" ></div>'
					 + '</div>'
				+ '</div>');
	        	SmartJS.widgets.News.play.init();
	        } else {
	        	$('#loadingIcon').hide();
		    	$('#controls').hide();
	        	$('.accordian-data_news-images').html( '<img src="' + nextItem.data.picture + '" />' );
	        };
	    };
	    
	    /* При закрытие подробного описания новости:
	     * Навешиваем события вкладки.
	     * Скрываем/отображаем элементы. */
	    function unbindNewsEvents(){	    
	    	$(document).unbind('keyup');
	    	bindEvents();
	    	SmartJS.controllers.navigation.keys.init();
	    	$('#' + type + ' .accordian-data_live').show();
	    	$('#' + type + ' .accordian-data_live-full').hide();
	    	SmartJS.widgets.News.closeWidget();
	    };	   
	    
	    function getData() {
	    	var data =  SmartJS.widgets.News.dataNews.getDataStorage( type );
	        return data;
	    };  
	    
	    function getPrevItem( currentPosition ) {
	        var data = getData()
	          , prevItemPosition;
	        
	        currentPosition === '0' ? prevItemPosition = data.length - 1 : prevItemPosition = currentPosition - 1;
	        return {
	            i: prevItemPosition
	          , data: data[ prevItemPosition ]
	        };
	    };

	    function getNextItem( nextPosition ) {
	        var data = getData()
	          , nextItemPosition = '';

	        nextPosition === (data.length - 1).toString() ?
	            nextItemPosition = 0 : nextItemPosition = (nextPosition / 1) + 1;
	        
	        return {
	            i: nextItemPosition
	          , data: data[ nextItemPosition ]
	        };
	    };    
	    
    return {
    	bindEvents: bindEvents
      , bindNewsEvents: bindNewsEvents
      , handleRight: handleRight
      , handleLeft: handleLeft
      , handleNewsRight: handleNewsRight
      , handleNewsLeft: handleNewsLeft
      , handleNewsUp: handleNewsUp
      , handleNewsDown: handleNewsDown
      , handleEnter: handleEnter    
      , changeVideo: changeVideo
      , restartScroll: restartScroll
      , unbindNewsEvents: unbindNewsEvents
    };
})();