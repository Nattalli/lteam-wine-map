from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from config.sample_data_functions import sample_user

CHANGE_PASSWORD_URL = reverse("authentication:change-password")


class UnauthenticatedChangePasswordViewSetTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_auth_required(self) -> None:
        response = self.client.post(
            CHANGE_PASSWORD_URL,
            data={"first_password": "newpassword", "second_password": "newpassword"},
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PasswordChangingViewSetTests(TestCase):
    def setUp(self) -> None:
        self.user = sample_user(password="password")
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_success_password_changing(self):
        response = self.client.patch(
            CHANGE_PASSWORD_URL,
            data={"first_password": "newpassword", "second_password": "newpassword"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.user.check_password("newpassword"))

    def test_password_changing_with_different_passwords(self):
        response = self.client.patch(
            CHANGE_PASSWORD_URL,
            data={"first_password": "newpassword", "second_password": "newpassword1"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(self.user.check_password("password"))

    def test_password_changing_when_serializer_is_not_valid(self):
        response = self.client.patch(
            CHANGE_PASSWORD_URL,
            data={
                "first_password": "newpassword",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(self.user.check_password("password"))
