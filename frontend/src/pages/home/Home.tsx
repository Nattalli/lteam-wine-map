import { Row, Col, Typography } from 'antd';

import firstImage from '../../assets/img/home-page-img.svg';
import './Home.scss';

export default function Home() {
  return (
    <Row className="home-info-section about-us-section" align="top">
      <Col span={14}>
        <Typography.Title level={1} className="home-info-title">
          About Us: Our Team
        </Typography.Title>
        <Typography.Paragraph className="home-info-paragraph">
          Our team consists of experts in the field of viticulture, winemaking,
          and wine tasting. We work diligently to provide users with the best
          possible experience when they are looking to choose the right wine. We
          have created several custom algorithms and a unique test that factors
          in the user’s taste preferences and budget to provide you with the
          perfect wine recommendation.
        </Typography.Paragraph>
      </Col>
      <Col span={10}>
        <Row justify="center">
          <img src={firstImage} alt="Img" />
        </Row>
      </Col>
    </Row>
  );
}
