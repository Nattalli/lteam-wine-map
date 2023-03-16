import { useState } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Modal, Alert } from 'antd';
import './Login.scoped.scss';
import messageImg from '../../assets/img/message.svg';
import heartImg from '../../assets/img/heart.svg';
import squares from '../../assets/img/squares.svg';
import emailIcon from '../../assets/img/email.svg';
import { Rule } from 'antd/es/form';
import { postRequest, getRequest } from '../../api';
import axios, { AxiosError } from 'axios';

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

interface TokenContext {
  setUser: Function;
}

export default function Login() {
  const [loginError, setLoginError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [resetEmail, setResetEmail] = useState('');

  const [loginForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();
  const { setUser }: TokenContext = useOutletContext();

  const showModal: () => void = () => {
    setResetModalOpen(true);
  };

  const logIn = async (credentials: any) => {
    try {
      const { data } = await postRequest('/auth/log-in/', credentials);

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      const user = await fetchUser();
      setUser(user);

      navigate('/', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        setLoginError(err.response ? err.response.data.detail: '');
      }
    }
  };

  const fetchUser = async () => {
    const { data } = await getRequest('/api/users/me');
    return data;
  };

  const sendResetLink = async (param: any) => {
    try {
      await postRequest('/api/users/reset_password/', param);
      setResetEmail(param.email);

      setResetModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ email: string[] }>;
        setEmailError(err.response ? err.response.data.email[0] : '');
      }
    }
  };

  return (
    <Row className="content">
      <Col span={11} className="input-section">
        <div className="title">Уже зареєстровані?</div>
        <Form
          layout={'vertical'}
          form={loginForm}
          initialValues={{ layout: 'vertical' }}
          onInput={() => setLoginError('')}
          onFinish={logIn}
        >
          <Form.Item name="username" rules={EmailRules}>
            <Input placeholder="Електронна пошта" />
          </Form.Item>
          <Form.Item name="password" rules={TextRules}>
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit">
              Увійти
            </Button>
          </Form.Item>
        </Form>
        <div onClick={showModal} className="forgot-password">
          Забув(ла) пароль
        </div>
        {loginError && <Alert message={loginError} type="error" showIcon />}
        <Modal
          title="Я забув(ла) пароль"
          open={isResetModalOpen}
          centered
          footer={null}
          onCancel={() => setResetModalOpen(false)}
        >
          <Form
            layout={'vertical'}
            form={resetPasswordForm}
            initialValues={{ layout: 'vertical' }}
            className="forgot-password-form"
            onFinish={sendResetLink}
            onInput={() => setEmailError('')}
          >
            <Form.Item name="email" rules={EmailRules}>
              <Input placeholder="Електронна пошта" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" block htmlType="submit">
                Надіслати
              </Button>
            </Form.Item>
          </Form>
          {emailError && <Alert message={emailError} type="error" showIcon />}
        </Modal>
        <Modal
          title="Я забув(ла) пароль"
          open={isSuccessModalOpen}
          centered
          footer={null}
          onCancel={() => setSuccessModalOpen(false)}
        >
          <div className="success-sent">
            <img src={emailIcon} alt="email" />
            <span>
              If you have an account linked to {resetEmail}, you will receive an
              email with a password reset link.
            </span>
          </div>
        </Modal>
      </Col>
      <Col span={13} className="register-section">
        <div className="title">Вперше на сайті?</div>
        <img className="squares-img" src={squares} alt="Squares" />
        <Link to="/register">
          <Button type="primary" size="large" block className="create-account">
            Створити акаунт
          </Button>
        </Link>
        <div className="advantages">
          <span>Переваги:</span>
          <div className="list-item">
            <img src={messageImg} alt="Img" />
            <span>Можливість залишати коментарі</span>
          </div>
          <div className="list-item">
            <img src={heartImg} alt="Img" />
            <span>Додавати вина до обраного</span>
          </div>
        </div>
      </Col>
    </Row>
  );
}
