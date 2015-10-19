
    function LogoutViewModel()
    {
        self = this;
        self.logout = function() {

              $.ajax({
                    url: '/api/v1/auth/logout/',
                    type: 'POST',
                    beforeSend: function(xhr, settings) {
                                    function getCookie(name) {
                                         var cookieValue = null;
                                         if (document.cookie && document.cookie != '') {
                                             var cookies = document.cookie.split(';');
                                             for (var i = 0; i < cookies.length; i++) {
                                                 var cookie = jQuery.trim(cookies[i]);
                                                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                                     break;
                                                 }
                                             }
                                         }
                                         return cookieValue;
                                     }
                                     if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                                         xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                                     }
                                    self.errors(new all_errors());

                    },
                    success: function logoutSuccessFn(data, status, headers, config) {

                        window.location.href = '/login/';
                      },
                    error: function logoutErrorFn(data, status, headers, config) {
                        console.error('Logout failure!');
                      },
                  });



          };
      }
      ko.applyBindings(LogoutViewModel, document.getElementById("navbar"));