/**
* ProfileSettingsController
* @namespace user_management.profiles.controllers
*/
(function () {
  'use strict';

  angular
    .module('user_management.authentication.controllers')
    .controller('ProfileSettingsController', ProfileSettingsController);

  ProfileSettingsController.$inject = [
    '$location', '$scope', '$routeParams', 'Authentication', 'Snackbar'
  ];

  /**
  * @namespace ProfileSettingsController
  */
  function ProfileSettingsController($location, $scope, $routeParams, Authentication, Snackbar) {
    var vm = this;

    vm.update = update;

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
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf user_management.profiles.controllers.ProfileSettingsController
    */
    function activate() {
      var authenticatedAccount = Authentication.getAuthenticatedAccount();
      var id = $routeParams.id;

      // Redirect if not logged in
      if (!authenticatedAccount) {
        $location.url('/');
        Snackbar.error('You are not authorized to view this page.');
      } else {
        // Redirect if logged in, but not the owner of this profile.
        if (authenticatedAccount.id != id) {
          $location.url('/');
          Snackbar.error('You are not authorized to view this page.');
        }
      }

      Authentication.get(id).then(profileSuccessFn, profileErrorFn);

      /**
      * @name profileSuccessFn
      * @desc Update `profile` for view
      */
      function profileSuccessFn(data, status, headers, config) {
        vm.profile = data.data;
      }

      /**
      * @name profileErrorFn
      * @desc Redirect to index
      */
      function profileErrorFn(data, status, headers, config) {
        $location.url('/');
        Snackbar.error('That user does not exist.');
      }
    }





    /**
    * @name update
    * @desc Update this user's profile
    * @memberOf user_management.profiles.controllers.ProfileSettingsController
    */
    function update() {

    if ($scope.updateForm.$valid) {
      // Submit as normal
      Authentication.update(vm.profile).then(profileSuccessFn, profileErrorFn);

    } else {
      $scope.updateForm.submitted = true;
    }


      /**
      * @name profileSuccessFn
      * @desc Show success snackbar
      */
      function profileSuccessFn(data, status, headers, config) {


        Snackbar.show('Your profile has been updated.');
//        window.location = '/';
      }


      /**
      * @name profileErrorFn
      * @desc Show error snackbar
      */
      function profileErrorFn(data, status, headers, config) {
        console.log("Profile updation failed");
        displayError(data.data)
      }

    }
  }
})();