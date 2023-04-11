import { LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Spin, notification } from 'antd';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { getRequestWithoutAuthorization } from '../../api';
import { useCatalogFilter } from '../../contexts/catalogFilterContext';
import { Wine } from '../../pages/winePage/Wine';
import WineCard from './WineCard';

import './WineList.scoped.scss';

const limit = 12;

interface WineListProps {
  favourites: Wine[];
  getFavourites: () => Promise<void>;
}

export default function WineList({ favourites, getFavourites }: WineListProps) {
  const [wines, setWines] = useState<Wine[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [api, contextHolder] = notification.useNotification();
  const { filter } = useCatalogFilter();

  useEffect(() => {
    getWines();
  }, [filter]);

  const getWines = async () => {
    setWines([]);
    const result = await fetchWines(0);

    setWines(result ? result.wines : []);
    setCount(result?.count);
  };

  const fetchWines = async (offset: number) => {
    setIsLoading(true);
    try {
      const params = {
        offset,
        limit,
        ...filter,
      };

      const { data } = await getRequestWithoutAuthorization(`/api/wine/`, {
        params,
      });

      return { wines: data.results, count: data.count };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        api.error({
          message: (err.response?.data.detail) || 'Помилка',
          placement: 'top',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    const result = await fetchWines(currentOffset + limit);
    if (result) {
      setCurrentOffset((prev) => prev + limit);
      setCount(result.count);
      setWines((prev) => [...prev, ...result.wines]);
    }
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[35, 40]} className="wine-list">
        {wines.map((wine) => (
          <WineCard key={wine.id} 
            wine={wine} 
            isFavourite={favourites.map(x => x.id).includes(wine.id)} 
            reloadFavourites={getFavourites} 
          />
        ))}
        {isLoading ? (
          <Col span={24}>
            <Row justify="center">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
            </Row>
          </Col>
        ) : null}
        {(wines.length < count) ? (
          <Col span={24}>
            <Row align="middle" justify="center">
              <Button
                type="primary"
                size="large"
                style={{ fontSize: '18px' }}
                onClick={loadMore}
              >
                Показати більше
              </Button>
            </Row>
          </Col>
        ) : null}
        {wines.length === 0 && !isLoading ? (
          <div className="no-wines">Вина не знайдені</div>
        ) : null}
      </Row>
    </>
  );
}
