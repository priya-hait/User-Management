from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers

from authentication.models import Account


class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Account
        fields = ('id', 'email', 'first_name', 'last_name', 'password',
                  'confirm_password',)

    def create(self, validated_data):

        if validated_data.get('password') == validated_data.get('confirm_password'):
            return Account.objects.create_user(**validated_data)
        else:
            raise serializers.ValidationError({'Password': ["Passwords don't match"]})



class AccountUpdateSerializer(AccountSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email')
        instance.first_name = validated_data.get('first_name')
        instance.last_name = validated_data.get('last_name')

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password == confirm_password:
            if password:
                instance.set_password(password)
                instance.save()
                update_session_auth_hash(self.context.get('request'), instance)

            else:
                instance.save()

            return instance
        else:

            raise serializers.ValidationError({'Password': ["Passwords don't match"]})





