from typing import Any

from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token: Any):
    print(type(reset_password_token))
    email_plaintext_message = "{}?token={}".format(
        reverse("password_reset:reset-password-request"),
        reset_password_token.key)
    send_mail("Password Reset for Wine Card", email_plaintext_message,
              "r_bogdan@knu.ua", [reset_password_token.user.email])
