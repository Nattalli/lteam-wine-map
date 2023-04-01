import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Col, Row, Button, Form, Input, notification } from 'antd';
import { Rule } from 'antd/es/form';
import { patchRequest } from '../../api';
import squares from '../../assets/img/squares.svg';
import './UserProfile.scoped.scss';

interface UserContext {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const TextRules: Rule[] = [
  {
    required: true,
    message: 'Це поле обовʼязкове',
  },
];

const EmailRules: Rule[] = [
  {
    type: 'email',
    message: 'Введіть валідний e-mail',
  },
  ...TextRules,
];

export default function UserProfile() {
  const [personalInfoForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();

  const { user }: UserContext = useOutletContext();
  const [api, contextHolder] = notification.useNotification();

  const changePersonalInfo = async ({ username, email }: any) => {
    if (username === user.first_name && email === user.email) return;
    try {
      await patchRequest(`/api/users/me/`, {
        first_name: username,
        email,
      });
      openSuccessNotification('Особисту інформацію успішно змінено');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const changePassword = async ({ newPassword, repeatNewPassword }: any) => {
    if (newPassword !== repeatNewPassword) {
      openInfoNotification('Паролі мають співпадати');
      return;
    }

    try {
      console.log(newPassword, repeatNewPassword);
      await patchRequest(`/auth/change-password/`, {
        first_password: newPassword,
        second_password: repeatNewPassword,
      });
      openSuccessNotification('Пароль успішно змінено');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    personalInfoForm.setFieldsValue({
      username: user.first_name,
      email: user.email,
    });
  }, [user]);

  const openSuccessNotification = (msg: string) => {
    api.success({
      message: msg,
      placement: 'top',
    });
  };

  const openErrorNotification = (msg: string) => {
    api.error({
      message: msg || 'Помилка',
      placement: 'top',
    });
  };

  const openInfoNotification = (msg: string) => {
    api.info({
      message: msg,
      placement: 'top',
    });
  };

  return (
    <Row className="user-profile" justify={'center'}>
      {contextHolder}
      <Col span={10}>
        <div className="title">Особистий кабінет</div>
        <div className="personal-info">
          <div>Особиста інформація</div>
          <Form
            layout={'vertical'}
            form={personalInfoForm}
            initialValues={{ layout: 'vertical' }}
            onFinish={changePersonalInfo}
          >
            <Form.Item name="username" rules={TextRules}>
              <Input placeholder="Імʼя" />
            </Form.Item>
            <Form.Item name="email" rules={EmailRules}>
              <Input placeholder="Електронна пошта" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" block htmlType="submit">
                Змінити
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="change-password">
          <div>Зміна паролю</div>
          <Form
            layout={'vertical'}
            form={changePasswordForm}
            initialValues={{ layout: 'vertical' }}
            onFinish={changePassword}
          >
            <Form.Item name="newPassword">
              <Input.Password placeholder="Новий пароль" minLength={8} />
            </Form.Item>
            <Form.Item name="repeatNewPassword">
              <Input.Password
                placeholder="Повторити новий пароль"
                minLength={8}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" block htmlType="submit">
                Змінити
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
      <img className="squares-img" src={squares} alt="Squares" />
    </Row>
  );
}
