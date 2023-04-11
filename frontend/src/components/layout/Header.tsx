import { Button, Col, Dropdown, Layout, MenuProps, Row, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../App';
import { getRequest } from '../../api';
import userIcon from '../../assets/img/user.svg';
import heartIcon from '../../assets/img/heart_26.svg';

import './Header.scss';


interface HeaderProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function Header({ user, setUser }: HeaderProps) {
  const navigate = useNavigate();

  const logout = async () => {
    await getRequest('/auth/logout/');
    setUser(null);

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login', { replace: true });
  };

  const redirectToProfilePage = () => {
    navigate('/user-profile', { replace: true });
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={redirectToProfilePage}>Особистий кабінет</div>,
    },
    {
      key: '2',
      label: <div onClick={logout}>Вийти</div>,
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
              <Link to="wines">Каталог</Link>
              <Typography.Link>Тест</Typography.Link>
              {!user ? (
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
