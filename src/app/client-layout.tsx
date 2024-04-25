'use client';

import { AppContext } from './context/AppContext';
import { useEffect } from 'react';
import { useAppReducer } from './reducer';
import { updateTokenAction, updateUserAction } from './actions';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { appState, appDispatch } = useAppReducer();

  const getUser = async (authToken: string) => {
    const res = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({ token: authToken }),
    });

    res.json().then((data: any) => {
      appDispatch(updateUserAction({ ...data.user.user, loggedIn: true }));
    });
  };

  useEffect(() => {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      appDispatch(updateTokenAction(authToken));
    }

    if (authToken) {
      getUser(authToken);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        appState,
        appDispatch
      }}>
      {children}
    </AppContext.Provider>
  );
}
