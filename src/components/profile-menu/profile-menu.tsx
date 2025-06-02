import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { fetchLogoutApi } from '../../slices/userSlice';
import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(fetchLogoutApi());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
