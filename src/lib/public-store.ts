import { create } from 'zustand';
import { CatalogData } from '@/actions/admin-catalogs';

interface PublicStore {
  catalogs: CatalogData[] | null;
  setCatalogs: (catalogs: CatalogData[]) => void;
}

export const usePublicStore = create<PublicStore>((set) => ({
  catalogs: null,
  setCatalogs: (catalogs) => set({ catalogs }),
}));
