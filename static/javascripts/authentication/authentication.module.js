(function () {
  'use strict';

  angular
    .module('user_management.authentication', [
      'user_management.authentication.controllers',
      'user_management.authentication.services'
    ]);

  angular
    .module('user_management.authentication.controllers', []);

  angular
    .module('user_management.authentication.services', ['ngCookies']);
})();