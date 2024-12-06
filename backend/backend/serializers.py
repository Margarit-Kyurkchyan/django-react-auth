import uuid
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db import transaction

User = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    # Override the username field to make it optional since we'll set it to email
    username = serializers.CharField(required=False)

    def validate(self, data):
        # Set username to email during validation
        data['username'] = data.get('email', '')
        return super().validate(data)

    @transaction.atomic
    def save(self, request):
        try:
            # Set a unique temporary placeholder for username using UUID
            temp_username = str(uuid.uuid4())

            # Temporarily set the data dictionary's username field
            self.validated_data['username'] = temp_username

            # Call super to create the user with a guaranteed unique temporary username
            user = super().save(request)

            # After the user is created, change the username to email or a unique form of email's local part
            base_username = user.email.split('@')[0]
            username = base_username
            counter = 1

            # Ensure the final username is unique
            while User.objects.filter(username=username).exclude(pk=user.pk).exists():
                username = f"{base_username}{counter}"
                counter += 1

            # Set the new username and save the user object again
            user.username = username
            user.save(update_fields=['username'])

            return user

        except Exception as e:
            # Log the error or handle it appropriately
            raise serializers.ValidationError(
                f"Could not create user account: {str(e)}"
            )

    class Meta:
        model = User
        fields = ('email', 'password1', 'password2')
