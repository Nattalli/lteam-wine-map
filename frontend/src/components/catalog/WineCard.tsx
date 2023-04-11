import { Col, notification } from 'antd';
import axios, { AxiosError } from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { UserContext } from '../../App';
import { putRequest } from '../../api';
import { Wine } from '../../pages/winePage/Wine';

import Heart from '../../assets/img/heart_26.svg';
import HeartFilled from '../../assets/img/heart_filled_26.svg';

import './WineCard.scoped.scss';

interface WineCardProps {
  wine: Wine;
  isFavourite: boolean;
  reloadFavourites: () => Promise<void>;
}

export default function WineCard({
  wine,
  isFavourite,
  reloadFavourites,
}: WineCardProps) {
  const { user }: UserContext = useOutletContext();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const changeFavouriteState = async (
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    e.stopPropagation();
    try {
      await putRequest(`/api/wine/favourites/${wine.id}/`, {});
      const msg = isFavourite
        ? 'Вино вилучено з обраних'
        : 'Вино додано до обраних';
      openSuccessNotification(msg);
      await reloadFavourites();
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

  return (
    <Col span={8}>
      {contextHolder}
      <div onClick={() => navigate(`../wines/${wine.id}`)} className="wine-card">
        {user ? (
          <div className="add-to-favourites">
            {isFavourite ? (
              <img
                src={HeartFilled}
                alt="Обрані"
                className="favourites-icon"
                onClick={changeFavouriteState}
              />
            ) : (
              <img
                src={Heart}
                alt="Обрані"
                className="favourites-icon"
                onClick={changeFavouriteState}
              />
            )}
          </div>
        ) : null}
        <div className="wine-img-container">
          <img src={wine.image_url} alt="Вино" className="wine-img" />
          <div className="overlay" />
        </div>
        <div className="wine-name">{wine.name}</div>
      </div>
    </Col>
  );
}
