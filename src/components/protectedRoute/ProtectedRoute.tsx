import { Navigate } from 'react-router';
import React from 'react';
import { Preloader } from '@ui';
import {
  selectIsAuthenticated,
  selectUserIsLoading
} from '../../slices/userSlice';
import { useSelector } from '../../services/store';
import { useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isOnlyAnonymous?: boolean;
};

export const ProtectedRoute = ({
  isOnlyAnonymous,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const userIsLoading = useSelector(selectUserIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (userIsLoading) {
    return <Preloader />;
  }

  if (!isOnlyAnonymous && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (isOnlyAnonymous && isAuthenticated) {
    const fromPage = location.state?.from || { pathname: '/' };

    return <Navigate replace to={fromPage} />;
  }

  return children;
};
