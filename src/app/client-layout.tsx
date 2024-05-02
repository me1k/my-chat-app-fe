'use client';

import { AppContext } from './context/AppContext';
import { useContext, useEffect } from 'react';
import { useAppReducer } from './reducer';
import { updateTokenAction, updateUserAction } from './actions';
import { AuthContext } from './context/AuthContext';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { appState, appDispatch } = useAppReducer();
  const { accessToken } = useContext(AuthContext);
  const getUser = async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${accessToken}`);
    const res = await fetch('/api/user', { method: 'GET', headers: headers });

    const { user } = await res.json().then((data) => data);
    console.log({ user });
    appDispatch(updateUserAction(user));
  };

  useEffect(() => {
    if (accessToken) {
      getUser();
    }
  }, [accessToken]);

  return (
    <AppContext.Provider
      value={{
        appState,
        appDispatch,
      }}>
      {children}
    </AppContext.Provider>
  );
}
