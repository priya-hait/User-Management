/**
* Authentication
* @namespace user_management.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('user_management.authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', 'Snackbar'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $http, Snackbar) {
    /**
    * @name Authentication
    * @desc The Factory to be returned
    */
    var Authentication = {
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unauthenticate: unauthenticate,
      get: get,
      update: update
    };

    return Authentication;



      function displayError(errors)
      {
        for (var key in errors)
        {
            var msg = key + ":" + errors[key];
            Snackbar.error(msg);
            console.log(msg);
        }

      }




      /**
      * @name get
      * @desc Gets the profile for user with username `username`
      * @param {string} username The username of the user to fetch
      * @returns {Promise}
      * @memberOf user_management.profiles.services.Profile
      */
      function get(id) {
        return $http.get('/api/v1/accounts/' + id + '/');
      }


      /**
      * @name update
      * @desc Update the given profile
      * @param {Object} profile The profile to be updated
      * @returns {Promise}
      * @memberOf user_management.authentication.services.Profile
      */
      function update(profile) {
        return $http.put('/api/v1/accounts/' + profile.id + '/', profile).then(profileSuccessFn, profileErrorFn);

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

    ////////////////////

    /**
    * @name register
    * @desc Try to register a new user
    * @param {string} username The username entered by the user
    * @param {string} password The password entered by the user
    * @param {string} email The email entered by the user
    * @returns {Promise}
    * @memberOf user_management.authentication.services.Authentication
    */
    function register(email, first_name, last_name, password, confirm_password) {
      return $http.post('/api/v1/accounts/', {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password,
        confirm_password: confirm_password
      }).then(registerSuccessFn, registerErrorFn);

  /**
  * @name registerSuccessFn
  * @desc Log the new user in
  */
  function registerSuccessFn(data, status, headers, config) {
    Authentication.login(email, password);
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

    /**
   * @name login
   * @desc Try to log in with email `email` and password `password`
   * @param {string} email The email entered by the user
   * @param {string} password The password entered by the user
   * @returns {Promise}
   * @memberOf user_management.authentication.services.Authentication
   */
  function login(email, password) {
    return $http.post('/api/v1/auth/login/', {
      email: email,
      password: password
    }).then(loginSuccessFn, loginErrorFn);

  /**
   * @name loginSuccessFn
   * @desc Set the authenticated account and redirect to index
   */
  function loginSuccessFn(data, status, headers, config) {
    Authentication.setAuthenticatedAccount(data.data);
    Snackbar.show('user logged in successfully');

    window.location = '/';
  }

  /**
   * @name loginErrorFn
   * @desc Log "Epic failure!" to the console
   */
  function loginErrorFn(data, status, headers, config) {
    console.error('Epic failure!');
    Snackbar.error('Error in login credentials');
    displayError(data.data);
  }
}


    /**
     * @name logout
     * @desc Try to log the user out
     * @returns {Promise}
     * @memberOf user_management.authentication.services.Authentication
     */
    function logout() {
      return $http.post('/api/v1/auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);

      /**
       * @name logoutSuccessFn
       * @desc Unauthenticate and redirect to index with page reload
       */
      function logoutSuccessFn(data, status, headers, config) {
        Authentication.unauthenticate();

        window.location = '/';
      }

      /**
       * @name logoutErrorFn
       * @desc Log "Epic failure!" to the console
       */
      function logoutErrorFn(data, status, headers, config) {
        console.error('Epic failure!');
      }
    }

      /**
     * @name getAuthenticatedAccount
     * @desc Return the currently authenticated account
     * @returns {object|undefined} Account if authenticated, else `undefined`
     * @memberOf user_management.authentication.services.Authentication
     */
    function getAuthenticatedAccount() {
      if (!$cookies.authenticatedAccount) {
        return;
      }

      return JSON.parse($cookies.authenticatedAccount);
    }

    /**
     * @name isAuthenticated
     * @desc Check if the current user is authenticated
     * @returns {boolean} True is user is authenticated, else false.
     * @memberOf user_management.authentication.services.Authentication
     */
    function isAuthenticated() {
      return !!$cookies.authenticatedAccount;
    }



    /**
     * @name setAuthenticatedAccount
     * @desc Stringify the account object and store it in a cookie
     * @param {Object} user The account object to be stored
     * @returns {undefined}
     * @memberOf user_management.authentication.services.Authentication
     */
    function setAuthenticatedAccount(account) {
      $cookies.authenticatedAccount = JSON.stringify(account);
    }

    /**
     * @name unauthenticate
     * @desc Delete the cookie where the user object is stored
     * @returns {undefined}
     * @memberOf user_management.authentication.services.Authentication
     */
    function unauthenticate() {
      delete $cookies.authenticatedAccount;
    }

  }


})();