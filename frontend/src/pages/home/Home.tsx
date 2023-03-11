import { Row, Col, Typography } from 'antd';
import { aboutUsText, goodMoodText, socializingText } from './homeTextConsts';

import AboutUs from '../../assets/img/about-us.svg';
import SocializingIcon from '../../assets/img/socializing.svg';
import GoodMood from '../../assets/img/good-mood.svg';
import Wines from '../../assets/img/wines.svg';
import './Home.scss';

export default function Home() {
  return (
    <>
      <Row className="home-info-section about-us-section" align="top">
        <Col xs={24} md={14}>
          <Typography.Title level={1} className="home-info-title">
            About Us: Our Team
          </Typography.Title>
          <Typography.Paragraph className="home-info-paragraph">
            {aboutUsText}
          </Typography.Paragraph>
        </Col>
        <Col xs={24} md={10}>
          <Row justify="center">
            <img src={AboutUs} alt="About us" />
          </Row>
        </Col>
      </Row>
      <div className="why-wine-section">
        <Row justify="center" align="middle" className="why-wine-header">
          <Typography.Title level={2} className="why-wine-title">
            Why Wine?
          </Typography.Title>
        </Row>
        <Row
          gutter={[50, 60]}
          justify="center"
          align="middle"
          className="why-wine-subsection"
        >
          <Col xs={24} md={6}>
            <Row justify="center" align="middle" gutter={[50, 0]}>
              <Col span={8}>
                <img src={SocializingIcon} alt="Socializing" />
              </Col>
              <Col span={16} className="why-wine-subsection-title">
                Socializing
              </Col>
            </Row>
          </Col>
          <Col span={18} className="why-wine-subsection-text">
            {socializingText}
          </Col>
          <Col xs={24} md={6}>
            <Row justify="center" align="middle" gutter={[50, 0]}>
              <Col span={8}>
                <img src={GoodMood} alt="Socializing" />
              </Col>
              <Col span={16} className="why-wine-subsection-title">
                Good mood
              </Col>
            </Row>
          </Col>
          <Col span={18} className="why-wine-subsection-text">
            {goodMoodText}
          </Col>
        </Row>
      </div>
      <div className="home-info-section">
        <div className="suggest-section">
          <Typography.Title level={1} className="home-info-title">
            What Do We Suggest?
          </Typography.Title>
          <Typography.Paragraph className="home-info-paragraph">
            Drink wine every day and enjoy your life ;)
          </Typography.Paragraph>
        </div>
        <div className="wines-image">
          <Row justify="center" align="middle">
            <img src={Wines} alt="Wines" />
          </Row>
        </div>
      </div>
    </>
  );
}
