import { Select } from 'antd';
import React, { useMemo, useState } from 'react';
import { CatalogFilter, useCatalogFilter } from '../../../contexts/catalogFilterContext';

type MultiFilterCatalogFilterProp = Pick<CatalogFilter, 'brand' | 'country' | 'sweetness'>

interface MultiFilterProps {
  filterName: string;
  filterProp: keyof MultiFilterCatalogFilterProp;
  data: string[];
  placeholder: string;
}

function MultiFilter({ filterName, filterProp, data, placeholder }: MultiFilterProps) {
  const { filter, setFilter } = useCatalogFilter();
  const [selectValues, setSelectValues] = useState<string[]>(filter[filterProp] || []);

  const options = useMemo(() => {
    return data.map(x => ({ value: x, label: x }));
  }, [data]);

  const handleChange = (values: string[]) => {
    setSelectValues(values);
    setFilter({
      ...filter,
      [filterProp]: values
    });
  };

  return (
    <div className="wine-filter">
      <div className="wine-filter-name">{filterName}:</div>
      <Select
        value={selectValues}
        mode="multiple"
        allowClear
        placeholder={placeholder}
        style={{ minWidth: '210px' }}
        onChange={handleChange}
        options={options}
        maxTagCount="responsive"
      />
    </div>
  );
}

const MultiFilterMemo = React.memo(MultiFilter);

export default MultiFilterMemo;
