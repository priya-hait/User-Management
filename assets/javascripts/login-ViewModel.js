
    function LoginViewModel()
    {
        self = this;
        self.email = ko.observable();
        self.password = ko.observable();
        self.errors = ko.observableArray([]);

        if(authenticated_user)
            window.location.href = '/'+authenticated_user_id+'/settings/';

        self.loginsubmit = function() {

        $.ajax({
            url: '/api/v1/auth/login/',
            data: ko.toJSON({
                  email: self.email(),
                  password: self.password(),
                    }),
            type: 'POST',
            beforeSend: function() {
                self.errors([]);
            },
            success: function loginSuccessFn(data, status, headers, config) {
                      console.log(data);
                      window.location.href = '/'+data.id+'/settings/';
                      },
            error: function loginErrorFn(data, status, headers, config) {
                        console.error('Login failure!');
                        console.error(data);
                        for (var key in data.responseJSON) {
                                console.log("done");
                                self.errors.push(data.responseJSON[key]);
                                console.log(errors());
                                console.log("done");
                            }

                      }
          });

        };
    }
    ko.applyBindings(LoginViewModel, document.getElementById("loginModule"));