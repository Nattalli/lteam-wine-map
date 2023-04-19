import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export interface CatalogFilter {
  search?: string;
  country?: string[];
  brand?: string[];
  ordering?: string;
  wine_type?: string[];
  sweetness?: string[];
}

interface CatalogFilterContextType {
  filter: CatalogFilter;
  setFilter: (filter: CatalogFilter) => void;
}

const CatalogFilterContext = createContext<CatalogFilterContextType | null>(null);

const catalogFilterLocalStorageKey = 'catalog_filter';

export const CatalogFilterProvider = ({ children }: React.PropsWithChildren) => {
  const [filter, setFilter] = useLocalStorage<Record<string, any>>({}, catalogFilterLocalStorageKey);

  return (
    <CatalogFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </CatalogFilterContext.Provider>
  );
}

export const useCatalogFilter = () => {
  const context = useContext(CatalogFilterContext);

  if (!context) {
    throw new Error('useFilter must be within CatalogFilterProvider');
  }

  return context;
}
