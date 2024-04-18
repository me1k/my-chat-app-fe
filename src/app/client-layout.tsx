'use client';

import { AppContext, User } from './context/AppContext';
import { useContext, useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const context = useContext(AppContext);
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    loggedIn: false,
    friends: [
      {
        name: '',
        userId: '',
      },
    ],
  });
  const [token, setToken] = useState('');
  const [incomingMessages, setIncomingMessages] = useState<any>([]);

  const updateIncomingMessages = (message: any) => {
    setIncomingMessages((prev: any) => [...prev, { message }]);
  };

  const updateToken = (token: string) => {
    setToken(token);
  };
  const updateUser = (user: User) => {
    setUser(user);
  };

  const getUser = async (authToken: string) => {
    const res = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({ token: authToken }),
    });

    res.json().then((data) => {
      setUser({ ...data.user.user, loggedIn: true });
    });
  };

  useEffect(() => {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      console.log({authToken})
      context.updateToken(authToken);
    }

    if (authToken) getUser(authToken);
  }, []);

  return (
    <AppContext.Provider
      value={{
        token,
        updateToken,
        updateUser,
        user,
        incomingMessages,
        updateIncomingMessages,
      }}>
      {children}
    </AppContext.Provider>
  );
}