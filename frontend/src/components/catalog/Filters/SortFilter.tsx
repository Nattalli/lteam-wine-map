import { Select } from 'antd';
import { useState } from 'react';
import { useCatalogFilter } from '../../../contexts/catalogFilterContext';

const options = [
  { value: '', label: 'За замовчуванням' },
  { value: 'name', label: 'Назва (від А до Я)' },
  { value: '-name', label: 'Назва (від Я до А)' },
  { value: 'percent_of_alcohol', label: 'Відсоток алкоголю ↑' },
  { value: '-percent_of_alcohol', label: 'Відсоток алкоголю ↓' }
];

export default function SortFilter() {
  const { filter, setFilter } = useCatalogFilter();
  const [selectValue, setSelectValue] = useState('');

  const handleChange = (value: string) => {
    setSelectValue(value);
    setFilter({
      ...filter,
      ordering: value
    });
  };

  return (
    <div className="wine-filter">
      <div className="wine-filter-name">Сортування:</div>
      <Select
        value={selectValue}
        style={{ width: '170px' }}
        placeholder="Оберіть країну"
        onChange={handleChange}
        options={options}
        maxTagCount="responsive"
      />
    </div>
  );
}
