/**
* Register controller
* @namespace user_management.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('user_management.authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication', 'Snackbar', '$parse'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $scope, Authentication, Snackbar, $parse) {
    var vm = this;

    vm.register = register;

    activate();

    /**
     * @name activate
     * @desc Actions to be performed when this controller is instantiated
     * @memberOf user_management.authentication.controllers.RegisterController
     */
    function activate() {
      // If the user is authenticated, they should not be here.
      if (Authentication.isAuthenticated()) {
        $location.url('/');
      }
    }



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
    * @name register
    * @desc Register a new user
    * @memberOf user_management.authentication.controllers.RegisterController
    */
    function register() {
    if ($scope.registerForm.$valid) {
      // Submit as normal
      Authentication.register(vm.email, vm.first_name, vm.last_name, vm.password, vm.confirm_password).then(registerSuccessFn, registerErrorFn);

    } else {
      $scope.registerForm.submitted = true;
    }

  /**
  * @name registerSuccessFn
  * @desc Log the new user in
  */
  function registerSuccessFn(data, status, headers, config) {
    Authentication.login(vm.email, vm.password);
    Snackbar.show('You have been successfully registered');
  }

  /**
  * @name registerErrorFn
  * @desc Log "Epic failure!" to the console
  */
  function registerErrorFn(data, status, headers, config, statusText) {
    console.error('Epic failure!');
    displayError(data.data);


  }
    }
  }
})();