import { Layout, Button, Space, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import './Header.scss';

export default function Header() {
  // toDo pass user as prop and conditionally render button or username
  return (
    <Layout.Header className="header">
      <Row justify="space-between" align="middle">
        <Col flex="150px">
          <Typography.Title className="header-title">LWINE</Typography.Title>
        </Col>
        <Col flex="auto">
          <Row justify="end" align="middle">
            <Space size={[35, 5]} className="header-tabs">
              <Typography.Link>Catalog</Typography.Link>
              <Typography.Link>Quiz</Typography.Link>
              <Button type="primary" className="get-started-btn">
                <Link to={'login'}>Get Started</Link>
              </Button>
            </Space>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
}
