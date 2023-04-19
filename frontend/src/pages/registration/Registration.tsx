import { Link, useNavigate } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Alert } from 'antd';
import './Registration.scoped.scss';
import squares from '../../assets/img/squares.svg';
import { Rule } from 'antd/es/form';
import { postRequestWithoutAthorization } from '../../api';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const TextRules: Rule[] = [
  {
    required: true,
    message: 'Це поле обовʼязкове'
  },
  { min: 3, message: 'Поле має містити мінімум 3 символи' }
];

const PasswordRules: Rule[] = [
  ...TextRules,
  { min: 8, message: 'Пароль має містити мінімум 8 символів' }
];

const EmailRules: Rule[] = [
  {
    type: 'email',
    message: 'Введіть валідний e-mail'
  },
  ...TextRules
];

export default function Registration() {
  const [error, setError] = useState('');

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const signUp = async (values: object) => {
    try {
      await postRequestWithoutAthorization('/auth/sign-up/', values);

      navigate('/login', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        setError(err.response ? err.response.data.detail : '');
      }
    }
  };

  return (
    <Row className="content">
      <Col span={11} className="login-redirect">
        <div className="title">Уже зареєстровані?</div>
        <img className="squares-img" src={squares} alt="Squares" />
        <Link to="/login">
          <Button type="primary" size="large" block className="login-btn">
            Увійти
          </Button>
        </Link>
      </Col>
      <Col span={13} className="register-section">
        <div className="title">Вперше на сайті?</div>
        <Form
          layout={'vertical'}
          form={form}
          initialValues={{ layout: 'vertical' }}
          onFinish={signUp}
        >
          <Form.Item name="email" rules={EmailRules}>
            <Input placeholder="Електронна пошта" />
          </Form.Item>
          <div className="name-input">
            <Form.Item name="first_name" rules={TextRules}>
              <Input placeholder="Імʼя" />
            </Form.Item>
            <Form.Item name="last_name" rules={TextRules}>
              <Input placeholder="Прізвище" />
            </Form.Item>
          </div>
          <Form.Item name="password" rules={PasswordRules}>
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit">
              Створити акаунт
            </Button>
          </Form.Item>
        </Form>
        {error && <Alert message={error} type="error" showIcon />}
      </Col>
    </Row>
  );
}
