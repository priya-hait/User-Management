/**
* LoginController
* @namespace User_Management.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('user_management.authentication.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace LoginController
  */
  function LoginController($location, $scope, Authentication) {
    var vm = this;

    vm.login = login;

    activate();


    function displayError(errors)
      {
        vm.serverErrors = [];
        for (var field in errors)
        {
            var msg = field + ":" + errors[field];
            vm.serverErrors.push(msg);

        }

      }


    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf user_management.authentication.controllers.LoginController
    */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }

    /**
    * @name login
    * @desc Log the user in
    * @memberOf user_management.authentication.controllers.LoginController
    */
    function login() {

    if ($scope.loginForm.$valid) {
      // Submit as normal
      Authentication.login(vm.email, vm.password).then(loginSuccessFn, loginErrorFn);

    } else {
      $scope.loginForm.submitted = true;
    }

  /**
   * @name loginSuccessFn
   * @desc Set the authenticated account and redirect to index
   */
  function loginSuccessFn(data, status, headers, config) {
    Authentication.setAuthenticatedAccount(data.data);
    window.location = '/';
  }

  /**
   * @name loginErrorFn
   * @desc Log "Epic failure!" to the console
   */
  function loginErrorFn(data, status, headers, config) {
    console.error('Epic failure!');
    displayError(data.data);
  }
    }
  }
})();