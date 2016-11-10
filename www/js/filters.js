(function() {
  'use strict';

  angular
  .module('timetracker.filters', [])
  .filter('timeFilter', timeFilter)
  .filter('dateFilter', dateFilter)
  .filter('statusFilter', timeStatus);

  function timeFilter() {
    return filterFilter

    function filterFilter(params) {
      if( params > 0 ){
        var sec_num = parseInt(params, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = '0'+hours;}
        if (minutes < 10) {minutes = '0'+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        params = `${hours}:${minutes}:${seconds}`;
      } else {
        params = '00:00:00';
      }

      return params;
    }
  }

  function dateFilter() {
    return filterFilter

    function filterFilter(params, format) {
      if( params ){
        var t = new Date(params);
        var day = t.getDate();
        var month = t.getMonth()+1;
        var year = t.getFullYear();
        var hours = t.getHours();
        var minutes = t.getMinutes();
        var seconds = t.getSeconds();

        if (day     < 10) {day     = '0'+day;}
        if (month   < 10) {month   = '0'+month;}
        if (hours   < 10) {hours   = '0'+hours;}
        if (minutes < 10) {minutes = '0'+minutes;}
        if (seconds < 10) {seconds = '0'+seconds;}
        if( format === 'onlyDate'){
          params = `${day}/${month}/${year}`;
        } else {
          params = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }

      }

      return params;
    }
  }

  function timeStatus() {
    return filterFilter

    function filterFilter(params) {
      switch(params) {
        case 'started':
          params = 'iniziata';
          break;
        case 'closed':
          params = 'terminata';
          break;
        case 'afterwards':
          params = 'inserita';
          break;
        default:

      }
      return params;
    }
  }


})();
