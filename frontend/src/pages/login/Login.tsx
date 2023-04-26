import { useState } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Modal, notification } from 'antd';
import './Login.scoped.scss';
import messageImg from '../../assets/img/message.svg';
import heartImg from '../../assets/img/heart_26.svg';
import squares from '../../assets/img/squares.svg';
import emailIcon from '../../assets/img/email.svg';
import { Rule } from 'antd/es/form';
import { postRequestWithoutAthorization, getRequest } from '../../api';
import axios, { AxiosError } from 'axios';
import { UserContext } from '../../App';

const TextRules: Rule[] = [
  {
    required: true,
    message: 'Це поле обовʼязкове'
  }
];

const EmailRules: Rule[] = [
  {
    type: 'email',
    message: 'Введіть валідний e-mail'
  },
  ...TextRules
];

export default function Login() {
  const [api, contextHolder] = notification.useNotification();
  const [resetEmail, setResetEmail] = useState('');

  const [loginForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  const navigate = useNavigate();
  const { setUser }: UserContext = useOutletContext();

  const showModal: () => void = () => {
    setResetModalOpen(true);
  };

  const logIn = async (credentials: any) => {
    try {
      const { data } = await postRequestWithoutAthorization(
        '/auth/log-in/',
        credentials
      );

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      const user = await fetchUser();
      setUser(user);

      navigate('/', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const fetchUser = async () => {
    const { data } = await getRequest('/api/users/me/');
    return data;
  };

  const sendResetLink = async (param: any) => {
    try {
      await postRequestWithoutAthorization('/api/users/reset_password/', param);
      setResetEmail(param.email);

      setResetModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ email: string[] }>;
        openErrorNotification(err.response ? err.response.data.email[0] : '');
      }
    }
  };

  const openErrorNotification = (msg: string) => {
    api.error({
      message: msg || 'Помилка',
      placement: 'top'
    });
  };

  return (
    <Row className="content">
      {contextHolder}
      <Col span={11} className="input-section">
        <div className="title">Уже зареєстровані?</div>
        <Form
          layout={'vertical'}
          form={loginForm}
          initialValues={{ layout: 'vertical' }}
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
              Якщо у вас є акаунт, привʼязаний до цієї пошти {resetEmail}, ви
              отримаєте лист на пошту з посиланням для зміни паролю за мить.
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
