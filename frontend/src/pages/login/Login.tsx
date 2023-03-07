import {useState} from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Form, Input, Modal} from 'antd';
import './Login.scss';

export default function Login () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Row className='content'>
      <Col span={11} className="input-section">
        <div className='title'>Already registered?</div>
        <Form
          layout={'vertical'}
          form={form}
          initialValues={{ layout: 'vertical' }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size='large' block>Login</Button>
          </Form.Item>
        </Form>
        <div onClick={showModal} className="forgot-password">I forgot the password</div>

        <Modal title="I forgot the password" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered footer={null}>
          <Form
            layout={'vertical'}
            form={form}
            initialValues={{ layout: 'vertical' }}
            className="forgot-password-form"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Enter valid email',
                },
                {
                  required: true,
                  message: 'This field is required',
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" size='large' block>Send</Button>
            </Form.Item>
          </Form>
      </Modal>
      </Col>
      <Col span={13} className="register-section">
        <div className='title'>Is this your first visit?</div>
        <Link to="/register">
          <Button type="primary" size='large' block className='create-account'>Create an account</Button>
        </Link>
        <div className='advantages'>
          <span>Advantages:</span>
          <div className='list-item'>
            <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.64706 6.75H19.3158M6.64706 11.5H19.3158M25 22L21.3651 17.4942C20.9854 17.0236 20.4132 16.75 19.8085 16.75H3C1.89543 16.75 1 15.8546 1 14.75V4C1 2.34315 2.34315 1 4 1H21C23.2091 1 25 2.79086 25 5V22Z" stroke="#CA3047" strokeWidth="2"/>
            </svg>
            <span>Ability to leave comments</span>
          </div>
          <div className='list-item'>
            <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.1494 3.03337C22.5629 2.38873 21.8667 1.87736 21.1003 1.52847C20.334 1.17958 19.5126 1 18.6831 1C17.8535 1 17.0321 1.17958 16.2658 1.52847C15.4994 1.87736 14.8032 2.38873 14.2167 3.03337L12.9997 4.37059L11.7826 3.03337C10.5981 1.73186 8.99152 1.00067 7.31633 1.00067C5.64114 1.00067 4.03455 1.73186 2.85001 3.03337C1.66547 4.33488 1 6.1001 1 7.94072C1 9.78133 1.66547 11.5466 2.85001 12.8481L4.06705 14.1853L12.9997 24L21.9323 14.1853L23.1494 12.8481C23.7361 12.2037 24.2015 11.4387 24.519 10.5967C24.8366 9.75467 25 8.85216 25 7.94072C25 7.02928 24.8366 6.12677 24.519 5.28475C24.2015 4.44273 23.7361 3.6777 23.1494 3.03337Z" stroke="#C92F49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add wines to "favourites"</span>
          </div>
        </div>
      </Col>
    </Row>
  )
}