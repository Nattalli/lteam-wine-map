import { Row } from 'antd';
import { Link, useOutletContext } from 'react-router-dom';
import { UserContext } from '../../App';
import { useCatalogFilter } from '../../contexts/catalogFilterContext';

import HeartIcon from '../../assets/img/heart_26.svg';
import SearchIcon from '../../assets/img/search.svg';

import './SearchBar.scoped.scss';

interface SearchBarProps {
  favouritesCount: number;
}

export default function SearchBar({ favouritesCount }: SearchBarProps) {
  const { filter, setFilter } = useCatalogFilter();
  const { user }: UserContext = useOutletContext();

  const onSearchChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      search: target.value,
    });
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <div className="search-icon">
          <img src={SearchIcon} alt="Пошук" />
        </div>
        <input
          onChange={onSearchChange}
          className="search-input"
          type="text"
          placeholder="Пошук..."
        />
      </div>
      {user ? (
        <Row align="middle" title="Обрані">
          <Link to="../favourites" className="favourites-icon-container">
            <span className="favourites-count">{favouritesCount}</span>
            <img src={HeartIcon} alt="Обрані" className="favourites-icon" />
          </Link>
        </Row>
      ) : null}
    </div>
  );
}
