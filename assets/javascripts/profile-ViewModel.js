    function all_errors()
    {
        this.email = ko.observableArray([]);
        this.first_name = ko.observableArray([]);
        this.last_name = ko.observableArray([]);
        this.password = ko.observableArray([]);
        this.confirm_password = ko.observableArray([]);
        this.non_field_errors = ko.observableArray([]);
    }


    function UpdatedProfile(email, first_name, last_name, password, confirm_password )
    {
        this.first_name = ko.observable(user_first_name);
        this.last_name = ko.observable(user_last_name);
        this.email = ko.observable(user_email);
        this.password = ko.observable();
        this.confirm_password = ko.observable();

    }
    function ProfileViewModel()
    {
        self = this;
        self.user_profile = ko.observable(new UpdatedProfile());
        self.id = ko.observable(user_id);
        self.errors = ko.observable(new all_errors());

        self.updateSubmit = function() {
        console.log(self.user_profile().first_name);
        $.ajax({
            url: "/api/v1/accounts/" + self.id() + "/",
            data: {email: self.user_profile().email(), first_name: self.user_profile().first_name(), last_name: self.user_profile().last_name(), password: self.user_profile().password(), confirm_password: self.user_profile().confirm_password() },
            type: 'PUT',
            async: false,
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
            success: function updateSuccessFn(data, status, headers, config) {
              window.location.href = '/'+self.id()+'/settings/';
              },
            error: function updateErrorFn(data, status, headers, config) {
                    console.error('Update failure!');
                    Snackbar.error('Update failure!');
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
              },
          });

        };
    }
    ko.applyBindings(ProfileViewModel, document.getElementById("profileModule"));
