function all_errors()
 {
        this.email = ko.observableArray([]);
        this.first_name = ko.observableArray([]);
        this.last_name = ko.observableArray([]);
        this.password = ko.observableArray([]);
        this.confirm_password = ko.observableArray([]);
        this.non_field_errors = ko.observableArray([]);
 }

 function RegisterViewModel()
    {
        self = this;
        self.email = ko.observable();
        self.first_name = ko.observable();
        self.last_name = ko.observable();
        self.password = ko.observable();
        self.confirm_password = ko.observable();
        self.errors = ko.observable(new all_errors());

        if(authenticated_user)
            window.location.href = '/'+authenticated_user_id+'/settings/';

        this.registerSubmit = function() {

        $.ajax({
            type: 'POST',
            url: '/api/v1/accounts/',
            data: {
                email: self.email(),
                first_name: self.first_name(),
                last_name: self.last_name(),
                password: self.password(),
                confirm_password: self.confirm_password()
              },
            beforeSend: function() {
                self.errors(new all_errors());
            },
            success: function RegisterSuccessFn(data, status, headers, config) {
                  console.log(data);
                  console.log(self.email());
                  console.log(self.password());

                  $.post('/api/v1/auth/login/', ko.toJSON({
                      email: self.email(),
                      password: self.password(),
                        })).then(loginSuccessFn, loginErrorFn);

                  function loginSuccessFn(data, status, headers, config) {
                  console.log(data);
                  window.location.href = '/'+data.id+'/settings/';
                  }


                  function loginErrorFn(data, status, headers, config) {
                    console.error('Login failure!');
                  }

          },
            error: function RegisterErrorFn(data, status, headers, config) {
                    console.error('Register failure!');
                    for (var key in data.responseJSON) {
                            if(key == 'email')
                                self.errors().email.push(data.responseJSON[key]);
                            else if(key == 'first_name')
                                self.errors().first_name.push(data.responseJSON[key]);
                            else if(key == 'last_name')
                                self.errors().last_name.push(data.responseJSON[key]);
                            else if(key == 'password')
                                self.errors().password.push(data.responseJSON[key]);
                            else if(key == 'confirm_password')
                                self.errors().confirm_password.push(data.responseJSON[key]);
                            else
                                self.errors().non_field_errors.push(data.responseJSON[key]);
                        }
              }
        });
        };
    }
    ko.applyBindings(RegisterViewModel, document.getElementById("registerModule"));