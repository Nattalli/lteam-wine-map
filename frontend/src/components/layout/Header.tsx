import { Layout, Button, Space, Typography, Row, Col, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../../assets/img/user.svg';

import './Header.scss';
import { getRequest } from '../../api';

interface HeaderProps {
  user: {
    first_name: string;
  },
  setUser: Function;
}


export default function Header({ user, setUser}: HeaderProps) {
  const navigate = useNavigate();

  const logout = async () => {
    await getRequest('/auth/logout/');
    setUser({});

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login', { replace: true });
  }

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={logout}>Вийти</div>
      ),
    },
  ];
  return (
    <Layout.Header className="header">
      <Row justify="space-between" align="middle">
        <Col flex="150px">
          <Typography.Title className="header-title">
            <Link to="/">LWINE</Link>
          </Typography.Title>
        </Col>
        <Col flex="auto">
          <Row justify="end" align="middle">
            <Space size={[35, 5]} className="header-tabs">
              <Typography.Link>Каталог</Typography.Link>
              <Typography.Link>Тест</Typography.Link>
              {!user.first_name ? (
                <Button type="primary" className="get-started-btn">
                  <Link to={'login'}>Увійти</Link>
                </Button>
              ) : (
                <Dropdown menu={{ items: menuItems }} placement="bottom" arrow>
                  <Typography.Link className="user-header">
                    <span> {user.first_name}</span>
                    <img src={userIcon} alt="user" />
                  </Typography.Link>
                </Dropdown>
              )}
            </Space>
          </Row>
        </Col>
      </Row>
    </Layout.Header>
  );
}
