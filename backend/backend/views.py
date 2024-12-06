from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied, ValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.contrib.auth import login as django_login
from rest_framework.authtoken.models import Token

from allauth.account.internal.decorators import login_not_required
from allauth.socialaccount.adapter import get_adapter
from allauth.socialaccount.helpers import (
    render_authentication_error,
)
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
import requests


def csrf_token_view(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})


class ReactGoogleLoginView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(login_not_required)
    def dispatch(self, request, *args, **kwargs):
        self.adapter = get_adapter()
        self.provider = self.adapter.get_provider(
            request, GoogleOAuth2Adapter.provider_id
        )
        try:
            return super().dispatch(request, *args, **kwargs)
        except (
                OAuth2Error,
                requests.RequestException,
                PermissionDenied,
                ValidationError,
                jwt.InvalidTokenError,
        ) as exc:
            return render_authentication_error(request, self.provider, exception=exc)


    def post(self, request, *args, **kwargs):
        credential = request.POST.get("credential")
        print(credential)

        if not credential:
            raise PermissionDenied("No credential provided")

        try:
            # Verify token and get login object
            print('oooooo')
            # login = self.provider.verify_token(request, {"id_token": credential})
            decoded_token = jwt.decode(credential, options={"verify_signature": False})

            print('decoded_token')
            print('78987987987987')

            if not login.is_existing:
                # Look up and save the social account if it's a new user
                login.lookup()
                login.save(request, connect=True)

            # Authenticate and create a session for the user
            user = login.user
            user.backend = 'django.contrib.auth.backends.ModelBackend'  # Set the backend explicitly

            # Log in the user manually to create a session
            django_login(request, user)  # This creates the session

            # Generate or retrieve a token for the logged-in user
            token, created = Token.objects.get_or_create(user=user)

            # Send a success response back to the frontend with user details and token
            return JsonResponse({
                "success": True,
                "key": token.key,
                "created": created,
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "message": "Google login successful."
            })

        except Exception as e:
            # Handle any exceptions that might occur during authentication
            return render_authentication_error(
                request,
                self.provider,
                exception=OAuth2Error(f"Authentication failed: {str(e)}")
            )


react_google_login = ReactGoogleLoginView.as_view()
