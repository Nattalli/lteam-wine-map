import { useEffect, useState } from 'react';
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

  const [error, setError] = useState<String>();

  const changePersonalInfo = async ({ username, email }: any) => {
    if (username === user.first_name && email === user.email) return;
    try {
      const result = await patchRequest(`/api/users/me/`, {
        first_name: username,
        email,
      });
      console.log(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        setError(err.response ? err.response.data.detail : '');
        openNotification();
      }
    }
  };

  const changePassword = async ({ newPassword, repeatNewPassword }: any) => {
    try {
      console.log(newPassword, repeatNewPassword);
      // const result = await patchRequest(`/api/users/set_password/`, {
      //   first_name: username,
      //   email,
      // });
      // console.log(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        setError(err.response ? err.response.data.detail : '');
        openNotification();
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

  const openNotification = () => {
    api.error({
      message: 'Помилка',
      description: error,
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
              <Input.Password placeholder="Новий пароль" />
            </Form.Item>
            <Form.Item name="repeatNew">
              <Input.Password placeholder="Повторити новий пароль" />
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
