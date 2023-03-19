from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError
from django.test import TestCase

from config.sample_data_functions import sample_user


class UserTest(TestCase):
    def setUp(self) -> None:
        self.user = sample_user()

    def test_user_str(self) -> None:
        self.assertTrue(isinstance(self.user, get_user_model()))
        self.assertEqual(str(self.user), self.user.username)

    def test_empty_email_asserts_an_error(self) -> None:
        with self.assertRaises(ValueError):
            sample_user(email="", username="")

    def test_username_field_should_be_unique(self) -> None:
        with self.assertRaises(IntegrityError):
            sample_user()
