import { Link, useNavigate } from 'react-router-dom';
import { Col, Row, Button, Form, Input } from 'antd';
import './Registration.scss';
import { type Rule } from 'antd/es/form';
import { postRequest } from '../../api';

const EmailRules: Rule[] = [
  {
    type: 'email',
    message: 'Enter valid email',
  },
  {
    required: true,
    message: 'This field is required',
  },
];

const TextRules: Rule[] = [
  {
    required: true,
    message: 'This field is required',
  },
];

export default function Registration() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: object) => {
    const { data } = await postRequest('/auth/sign-up/', values);
    if (!data) return;

    navigate('/login', { replace: true });
  };

  return (
    <Row className="content">
      <Col span={11} className="login-redirect">
        <div className="title">Already registered?</div>
        <Link to="/login">
          <Button type="primary" size="large" block className="login-btn">
            Login
          </Button>
        </Link>
      </Col>
      <Col span={13} className="register-section">
        <div className="title">Is this your first visit?</div>
        <Form
          layout={'vertical'}
          form={form}
          initialValues={{ layout: 'vertical' }}
          onFinish={onFinish}
        >
          <Form.Item name="email" rules={EmailRules}>
            <Input placeholder="Email" />
          </Form.Item>
          <div className="name-input">
            <Form.Item name="first_name" rules={TextRules}>
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item name="last_name" rules={TextRules}>
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>
          <Form.Item name="password" rules={TextRules}>
            <Input placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit">
              Create an account
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
