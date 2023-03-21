import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Alert, Row, Col, Image } from 'antd';
import { getRequest } from '../../api';
import './Wine.scoped.scss';

interface Wine {
  image_url: string;
  name: string;
  wine_type: string;
  country: {
    name: string;
  };
  region: string;
  brand: {
    name: string;
  };
  tastes: string;
  sweetness: string;
  pairs_with: string;
}

export default function WinePage() {
  let params = useParams();

  const [id, setId] = useState<String>();
  const [error, setError] = useState<String>();
  const [wine, setWine] = useState<Wine>();

  const fetchWine = async () => {
    try {
      const result = await getRequest(`/api/wine/${id}/`);
      setWine(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        setError(err.response ? err.response.data.detail : '');
      }
    }
  };

  useEffect(() => {
    setId(params.id);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchWine();
  }, [id]);

  return (
    <Row className="content">
      {error && <Alert message="Error" type="error" showIcon />}
      {wine && (
        <>
          <Col span={8} className="wine-img">
            <Image src={wine.image_url} />
          </Col>
          <Col span={12}>
            <div className="main-info-section">
              <span className="name">{wine.name}</span>
              <div className="property">
                <span>Тип вина</span>
                <span>{wine.wine_type}</span>
              </div>
              <div className="property">
                <span>Країна</span>
                <span>{wine.country.name}</span>
              </div>
              <div className="property">
                <span>Регіон</span>
                <span>{wine.region}</span>
              </div>
              <div className="property">
                <span>Бренд</span>
                <span>{wine.brand.name}</span>
              </div>
              <div className="property">
                <span>Смаки</span>
                <span>{wine.tastes}</span>
              </div>
              <div className="property">
                <span>Солодкість</span>
                <span>{wine.sweetness}</span>
              </div>
              <div className="property">
                <span>Поєднання</span>
                <span>{wine.pairs_with}</span>
              </div>
            </div>
            <div className="shop-availability">
              <span className="name">Наявність в магазинах</span>
            </div>
          </Col>
        </>
      )}
    </Row>
  );
}
