import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Alert } from 'antd';
import { Rule } from 'antd/es/form';
import { postRequestWithoutAthorization } from '../../api';
import './NewPassword.scoped.scss';
import axios, { AxiosError } from 'axios';

const TextRules: Rule[] = [
  {
    required: true,
    message: 'Це поле обовʼязкове',
  },
];

export default function NewPassword() {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [loginForm] = Form.useForm();

  const changePassword = async ({ password }: any) => {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    const requstBody = {
      uid: params.get('uid'),
      token: params.get('token'),
      new_password: password,
    };

    try {
      await postRequestWithoutAthorization(
        '/api/users/reset_password_confirm/',
        requstBody
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ new_password: string }>;
        setErrorMessage(err.response ? err.response.data.new_password : '');
      }
    }

    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
    setErrorMessage('');
  };

  return (
    <Row align="middle" justify="center" className="content">
      <Col span={10}>
        <div className="title">Зміна паролю</div>
        <Form
          layout={'vertical'}
          form={loginForm}
          initialValues={{ layout: 'vertical' }}
          onFinish={changePassword}
          onInput={hideAlert}
        >
          <Form.Item name="password" rules={TextRules}>
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          {!isAlertVisible && (
            <Form.Item>
              <Button type="primary" size="large" block htmlType="submit">
                Змінити
              </Button>
            </Form.Item>
          )}
        </Form>
        {isAlertVisible && (
          <div className="response-block">
            <Alert
              message={errorMessage || 'Пароль успішно змінено'}
              type={errorMessage ? 'error' : 'success'}
              showIcon
            />
            {!errorMessage && (
              <Link to="/login">
                <Button type="primary" size="large" block className="login-btn">
                  Увійти
                </Button>
              </Link>
            )}
          </div>
        )}
      </Col>
    </Row>
  );
}
