(function () {
  'use strict';

  angular
    .module('user_management', [
      'user_management.routes',
      'user_management.authentication',
      'user_management.config',
      'user_management.layout'
    ]);

  angular
    .module('user_management.routes', ['ngRoute']);

    angular
  .module('user_management.config', []);

  angular
   .module('user_management')
   .run(run);

    run.$inject = ['$http'];

    /**
    * @name run
    * @desc Update xsrf $http headers to align with Django's defaults
    */
    function run($http) {
      $http.defaults.xsrfHeaderName = 'X-CSRFToken';
      $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();