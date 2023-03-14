import { Link, useNavigate } from 'react-router-dom';
import { Col, Row, Button, Form, Input } from 'antd';
import './Registration.scoped.scss';
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

export default function Registration() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const signUp = async (values: object) => {
    const { data } = await postRequest('/auth/sign-up/', values);
    if (!data) return;

    navigate('/login', { replace: true });
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
          <Form.Item name="password" rules={TextRules}>
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit">
              Створити акаунт
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
