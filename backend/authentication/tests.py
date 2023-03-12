from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model


class TestAuth(APITestCase):
    def test_sign_up(self):
        self.client.post(
            reverse('sign-up'),
            {
                'email': 'test@app.com',
                'password': 'password##!123',
                'first_name': 'Test',
                'second_name': 'Sign Up'
            },
        )
