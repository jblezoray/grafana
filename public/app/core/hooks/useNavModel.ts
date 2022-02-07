import { useSelector } from 'react-redux';

import { StoreState } from 'app/types/store';
import { NavModel } from '@grafana/data';

import { getNavModel } from '../selectors/navModel';

export const useNavModel = (id: string): NavModel => {
  const navIndex = useSelector((state: StoreState) => state.navIndex);
  return getNavModel(navIndex, id);
};
