import { Col, Layout, Row, Typography } from 'antd';

import './Footer.scss';

export default function Footer() {
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
                <span className="footer-link-title-text">Quick Links</span>
              </div>
              <div>Sign Up</div>
              <div>Login</div>
              <div>Favorite</div>
            </div>
            <Col className="footer-link-section">
              <div className="footer-link-title">
                <span className="footer-link-title-text">Others</span>
              </div>
              <div>Quiz</div>
              <div>Catalog</div>
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
