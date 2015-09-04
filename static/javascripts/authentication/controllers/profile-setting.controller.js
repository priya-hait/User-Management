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
    '$location', '$routeParams', 'Authentication', 'Snackbar'
  ];

  /**
  * @namespace ProfileSettingsController
  */
  function ProfileSettingsController($location, $routeParams, Authentication, Snackbar) {
    var vm = this;

    vm.update = update;

    activate();


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
        Snackbar.error('You are not authorized to view this page. 1');
      } else {
        // Redirect if logged in, but not the owner of this profile.
        if (authenticatedAccount.id != id) {
          $location.url('/');
          Snackbar.error('You are not authorized to view this page. 2');
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
      Authentication.update(vm.profile);
    }
  }
})();