import { createContext, useContext, useState } from "react";

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

export const CatalogFilterProvider = ({ children }: React.PropsWithChildren) => {
  const [filter, setFilter] = useState<Record<string, any>>({});

  return (
    <CatalogFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </CatalogFilterContext.Provider>
  ) 
}

export const useCatalogFilter = () => {
  const context = useContext(CatalogFilterContext);

  if(!context) {
    throw new Error('useFilter must be within CatalogFilterProvider');
  }

  return context;
}