import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Modal } from 'antd';
import './Login.scss';
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

export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <Row className="content">
      <Col span={11} className="input-section">
        <div className="title">Already registered?</div>
        <Form
          layout={'vertical'}
          form={form}
          initialValues={{ layout: 'vertical' }}
        >
          <Form.Item name="email" rules={EmailRules}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={PasswordRules}>
            <Input placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div onClick={showModal} className="forgot-password">
          I forgot the password
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
        <div className="title">Is this your first visit?</div>
        <Link to="/register">
          <Button type="primary" size="large" block className="create-account">
            Create an account
          </Button>
        </Link>
        <div className="advantages">
          <span>Advantages:</span>
          <div className="list-item">
            <img src={messageImg} alt="Img" />
            <span>Ability to leave comments</span>
          </div>
          <div className="list-item">
            <img src={heartImg} alt="Img" />
            <span>Add wines to favourites</span>
          </div>
        </div>
      </Col>
    </Row>
  );
}
