import { Row } from 'antd';
import { FilterValues } from '../../../pages/catalog/Catalog';
import MultiFilter from './MultiFilter';
import SortFilter from './SortFilter';

import './Filters.scss';

interface FiltersProps {
  filterValues: FilterValues | undefined;
}

export default function Filters({ filterValues }: FiltersProps) {
  return (
    <Row align="middle" className="wine-filters">
      <SortFilter />
      <MultiFilter 
        filterProp="country" 
        data={filterValues?.countries.map(x => x.name) || []} 
        filterName="Країна" 
        placeholder="Оберіть країну"  
      />
      <MultiFilter 
        filterProp="brand" 
        data={filterValues?.brands.map(x => x.name) || []} 
        filterName="Бренд" 
        placeholder="Оберіть бренд"  
      />
      <MultiFilter 
        filterProp="sweetness" 
        data={filterValues?.sweetness || []} 
        filterName="Солодкість" 
        placeholder="Оберіть солодкість"  
      />
    </Row>
  );
}
