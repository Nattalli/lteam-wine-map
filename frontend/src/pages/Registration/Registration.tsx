import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Modal } from 'antd';
import './Registration.scss';
import messageImg from '../../assets/img/message.svg';
import heartImg from '../../assets/img/heart.svg';
import { type Rule } from 'antd/es/form';

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

const PasswordRules: Rule[] = [
  {
    required: true,
    message: 'This field is required',
  },
];

export default function Registration() {
  const [form] = Form.useForm();

  return (
    <Row className="content">
      <Col span={11} className="input-section">
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
        >
          <Form.Item name="email" rules={EmailRules}>
            <Input placeholder="Email" />
          </Form.Item>
          <div className="name-input">
            <Form.Item name="firstName" rules={PasswordRules}>
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item name="lastName" rules={PasswordRules}>
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>
          <Form.Item name="password" rules={PasswordRules}>
            <Input placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block>
              Create an account
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
