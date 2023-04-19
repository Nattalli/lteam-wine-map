import { Link } from 'react-router-dom';
import { Col, Layout, Row, Typography } from 'antd';
import { User } from '../../App';

import './Footer.scss';

interface HeaderProps {
  user: User | null;
}

export default function Footer({ user }: HeaderProps) {
  return (
    <Layout.Footer className="footer">
      <Row className="footer-main-section" justify="center" align="middle">
        <Col xs={24} md={6}>
          <Typography.Title className="footer-title">LWINE</Typography.Title>
        </Col>
        <Col xs={24} md={18}>
          <Row justify="end">
            <div className="footer-link-section">
              <div className="footer-link-title">
                <span className="footer-link-title-text">Посилання</span>
              </div>
              <Link to="/register">Реєстрація</Link>
              <Link to="/login">Авторизація</Link>
              {user && <Link to="/favourites">Обране</Link>}
            </div>
            <Col className="footer-link-section">
              <div className="footer-link-title">
                <span className="footer-link-title-text">Інше</span>
              </div>
              <Link to="/quiz">Тест</Link>
              <Link to="/wines">Каталог</Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="center" align="middle" className="footer-copyright-section">
        <Typography.Text className="footer-copyright-text">
          Copyright © 2023. All rights reserved.
        </Typography.Text>
      </Row>
    </Layout.Footer>
  );
}
