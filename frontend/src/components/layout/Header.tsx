import { Layout, Button, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';

import './Header.scss';

export default function Header() {
  return (
    <Layout.Header className="header">
      <Typography.Title level={3} className="header-title">
        LWINE
      </Typography.Title>
      <Space size={35} className="header-tabs">
        <Typography.Link>Catalog</Typography.Link>
        <Typography.Link>Quiz</Typography.Link>
        <Button type="primary">
          <Link to={'linktologin'}>Get Started</Link>
        </Button>
      </Space>
    </Layout.Header>
  );
}
