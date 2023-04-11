import { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Row, notification, Image, Button } from 'antd';
import heartImgFilled from '../../assets/img/heart_filled_59.svg';
import squaresImg from '../../assets/img/squares.svg';
import { getRequest, putRequest } from '../../api';
import './Favourites.scoped.scss';

interface Wine {
  id: number;
  image_url: string;
  name: string;
}

export default function Favourites() {
  const [api, contextHolder] = notification.useNotification();

  const [favourites, setFavourites] = useState<Wine[]>();

  const fetchFavourites = async () => {
    try {
      const { data } = await getRequest(`/api/wine/favourites/`);
      setFavourites(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const updateFavourites = async (wine: Wine) => {
    try {
      await putRequest(`/api/wine/favourites/${wine.id}/`, {});
      openSuccessNotification('Вино вилучено з обраних');
      await fetchFavourites();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const clearFavourites = async () => {
    try {
      await putRequest(`/api/wine/favourites/clear/`, {});
      openSuccessNotification('Обране успішно видалено');
      await fetchFavourites();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const openSuccessNotification = (msg: string) => {
    api.success({
      message: msg,
      placement: 'top',
    });
  };

  const openErrorNotification = (msg: string) => {
    api.error({
      message: msg || 'Помилка',
      placement: 'top',
    });
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <Row className="content">
      {contextHolder}
      <div className="header">Обране</div>
      {favourites && favourites.length === 0 && (
        <div className="no-fav">
          Упс, здається у Вас все ще немає обраних вин. Перейдіть до сторінки&nbsp;
          <Link to="/wines">каталогу</Link>, щоб додати вина до цього
          списку.
        </div>
      )}
      {favourites && favourites.length !== 0 && (
        <div className="fav-section">
          {favourites.map((wine, index) => (
            <Link className="fav-wine" to={`/wine/${wine.id}`} key={index}>
              <div className="img-section">
                <Image src={wine.image_url} className="main-img" />
                <img
                  src={heartImgFilled}
                  alt="fav"
                  className="fav-icon"
                  onClick={() => updateFavourites(wine)}
                />
              </div>
              <span>{wine.name}</span>
            </Link>
          ))}
          <Button onClick={clearFavourites}>Очистити все</Button>
        </div>
      )}
    </Row>
  );
}
