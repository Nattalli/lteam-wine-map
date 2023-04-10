import { Col, Row, notification } from 'antd';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserContext } from '../../App';
import { getRequest, getRequestWithoutAuthorization } from '../../api';
import Categories from '../../components/catalog/Categories';
import Filters from '../../components/catalog/Filters/Filters';
import SearchBar from '../../components/catalog/SearchBar';
import WineList from '../../components/catalog/WineList';
import { CatalogFilterProvider } from '../../contexts/catalogFilterContext';
import { Wine } from '../winePage/Wine';

import './Catalog.scoped.scss';

export interface FilterValues {
  countries: { name: string }[];
  brands: { name: string}[];
  wine_types: string[];
  sweetness: string[];
}

export default function Catalog() {
  const [filterValues, setFilterValues] = useState<FilterValues>();
  const [favourites, setFavourites] = useState<Wine[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const { user }: UserContext = useOutletContext();

  useEffect(() => {
    getFiltersValues();
  }, []);

  useEffect(() => {
    if (user) {
      getFavourites();
    }
  }, [user]);

  const getFavourites = async () => {
    try {
      const { data } = await getRequest(`/api/wine/favourites/`);
      setFavourites(data ? data : []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        api.error({
          message: (err.response?.data.detail) || 'Помилка',
          placement: 'top',
        });
      }
    }
  };

  const getFiltersValues = async () => {
    try {
      const { data } = await getRequestWithoutAuthorization(`/api/wine/categories/`);
      setFilterValues(data);
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
    <CatalogFilterProvider>
      {contextHolder}
      <div className="catalog-page">
        <Categories wineTypes={filterValues?.wine_types || []} />
        <Row className="wine-list">
          <Col span={24}>
            <SearchBar favouritesCount={favourites.length} />
          </Col>
          <Col span={24}>
            <Filters filterValues={filterValues} />
          </Col>
          <Col span={24}>
            <WineList favourites={favourites} getFavourites={getFavourites} />
          </Col>
        </Row>
      </div>
    </CatalogFilterProvider>
  );
}
