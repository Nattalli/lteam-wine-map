import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Modal } from 'antd';
import './Login.scoped.scss';
import messageImg from '../../assets/img/message.svg';
import heartImg from '../../assets/img/heart.svg';
import squares from '../../assets/img/squares.svg';
import { type Rule } from 'antd/es/form';
import { postRequest } from '../../api';

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
  setToken: Function;
}

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setToken }: TokenContext = useOutletContext();
  const [form] = Form.useForm();

  const showModal: () => void = () => {
    setIsModalOpen(true);
  };

  const handleOk: () => void = () => {
    setIsModalOpen(false);
  };

  const handleCancel: () => void = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (credentials: any) => {
    const { data } = await postRequest('/auth/log-in/', credentials);
    if (!data) return;

    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);

    // toDo: setUser instead
    setToken(data.access);

    // toDo: fetch user
  };

  return (
    <Row className="content">
      <Col span={11} className="input-section">
        <div className="title">Уже зареєстровані?</div>
        <Form
          layout={'vertical'}
          form={form}
          initialValues={{ layout: 'vertical' }}
          onFinish={onFinish}
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
          title="I forgot the password"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          footer={null}
        >
          <Form
            layout={'vertical'}
            form={form}
            initialValues={{ layout: 'vertical' }}
            className="forgot-password-form"
          >
            <Form.Item name="forgot-email" rules={EmailRules}>
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size="large" block>
                Send
              </Button>
            </Form.Item>
          </Form>
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
