import { Col, Row, Typography, notification } from 'antd';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import { getRequestWithoutAuthorization } from '../../api';
import { aboutUsText, goodMoodText, socializingText } from './homeTextConsts';

import AboutUs from '../../assets/img/about-us.svg';
import GoodMood from '../../assets/img/good-mood.svg';
import QuizSlide from '../../assets/img/quiz-slide.svg';
import SocializingIcon from '../../assets/img/socializing.svg';
import Squares from '../../assets/img/squares.svg';
import WineOfTheDaySlide from '../../assets/img/wine-of-the-day-slide.svg';
import Wines from '../../assets/img/wines.svg';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Home.scss';

const renderCarouselArrowPrev = (clickHandler: () => void, hasPrev: boolean) => {
  if (!hasPrev) return null;

  return (
    <button className="carousel-change-button carousel-prev-button" onClick={clickHandler}></button>
  );
}

const renderCarouselArrowNext = (clickHandler: () => void, hasNext: boolean) => {
  if (!hasNext) return null;

  return (
    <button className="carousel-change-button carousel-next-button" onClick={clickHandler}></button>
  );
}

export default function Home() {
  const [wineOfTheDayId, setWineOfTheDayId] = useState();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    getWineOfTheDay();
  }, []);

  const getWineOfTheDay = async () => {
    try {
      const { data } = await getRequestWithoutAuthorization(`/api/wine/wine-of-the-day/`);
      setWineOfTheDayId(data.id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        api.error({
          message: (err.response?.data.detail) || 'Помилка',
          placement: 'top',
        });
      }
    }
  }

  return (
    <>
      {contextHolder}
      <Carousel 
        showIndicators={false} 
        showArrows={true} 
        showThumbs={false} 
        showStatus={false}
        renderArrowPrev={renderCarouselArrowPrev}
        renderArrowNext={renderCarouselArrowNext}
        >
        <div>
          <img src={WineOfTheDaySlide} alt="Вино дня" />
          <Link to={`wines/${wineOfTheDayId}`} className="carousel-button carousel-wine-button">Подивитись</Link>
        </div>
        <div>
          <img src={QuizSlide} alt="Тест" />
          <Link to="/" className="carousel-button carousel-quiz-button">Пройти тест</Link>
        </div>
      </Carousel>
      <Row className="home-info-section about-us-section" align="top">
        <Col xs={24} md={14}>
          <Typography.Title level={1} className="home-info-title">
            Про нас
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
      <div className="why-wine-section-wrapper">
        <img className="why-wine-squares-img" src={Squares} alt="Squares" />
        <div className="why-wine-section">
          <Row justify="center" align="middle" className="why-wine-header">
            <Typography.Title level={2} className="why-wine-title">
              Чому вино?
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
                  Соціалізація
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
                  Гарний настрій
                </Col>
              </Row>
            </Col>
            <Col span={18} className="why-wine-subsection-text">
              {goodMoodText}
            </Col>
          </Row>
        </div>
      </div>
      <div className="home-info-section suggest-section-wrapper">
        <div className="suggest-section">
          <img className="why-wine-squares-img" src={Squares} alt="Squares" />
          <Typography.Title level={1} className="home-info-title">
            Що ми рекомендуємо?
          </Typography.Title>
          <Typography.Paragraph className="home-info-paragraph">
            Пий вино щодня та насолоджуйся життям :)
          </Typography.Paragraph>
          <div className="wines-image">
            <Row justify="center" align="middle">
              <img src={Wines} alt="Wines" />
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
