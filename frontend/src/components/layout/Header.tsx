import { Layout, Button, Space, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import './Header.scss';

export default function Header() {
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
              <Button type="primary">
                <Link to={'linktologin'}>Get Started</Link>
              </Button>
            </Space>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
}
