SmartJS.widgets.Weather.settings = (function() {

var userAlias,    

    weatherEl = {
        now: {},
        days: []
    },

    geoinfoAPI = {
        getDataByClientIp: function(){
            return SmartJS.settings.sources.weather + 'getDataByClientIp/';
        }
        ,getDataByZone: function( zone ){
            return SmartJS.settings.sources.weather + 'getDataByZone/?nick='+ zone;
        }
        ,getCitiesAll: function(){
            return SmartJS.settings.sources.weather + 'getCitiesAll/';
        }
    };
    
return {
    userAlias: userAlias,
    weatherEl: weatherEl,
    geoinfoAPI: geoinfoAPI    
};

})();