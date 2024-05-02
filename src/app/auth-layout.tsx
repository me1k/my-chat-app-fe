'use client';

import { useEffect, useReducer } from 'react';
import { AuthContext } from './context/AuthContext';

const initialState = {
  accessToken: '',
};

const reducer = (state: { accessToken: string }, action: any) => {
  switch (action.type) {
    
    case 'UPDATE_TOKEN':
      console.log({ action, state });
      return {
        ...state,
        accessToken: action.accessToken,
      };
    default:
      return state;
  }
};
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [authState, authDispatch] = useReducer(reducer, initialState);

  const handleRefreshAccessToken = async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    await fetch('http://localhost:8080/refreshToken', {
      method: 'POST',
      redirect: 'follow',
      credentials: 'include',
      headers: headers,
    }).then((res: any) => {
      res.json().then((data: any) => {
        console.log({ data });
        localStorage.setItem('accessToken', data.accessToken);
        authDispatch({
          type: 'UPDATE_TOKEN',
          accessToken: data.accessToken,
        });
      });
    });
  };

  useEffect(() => {
    const refreshTokenTimeout = setTimeout(
      handleRefreshAccessToken,
      5 * 60 * 1000
    );
    return () => {
      clearTimeout(refreshTokenTimeout);
    };
  }, [authState.accessToken]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      authDispatch({
        type: 'UPDATE_TOKEN',
        accessToken,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken: authState.accessToken,
        authDispatch: authDispatch
      }}>
      {children}
    </AuthContext.Provider>
  );
}
