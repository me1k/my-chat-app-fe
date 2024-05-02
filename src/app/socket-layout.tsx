'use client';

import { useContext, useEffect, useState } from 'react';
import { SocketContext } from './context/SocketContext';
import { socket } from './ws';
import { useAppReducer } from './reducer';
import { updateIncomingMessagesAction } from './actions';
import { AppContext } from './context/AppContext';

export default function SocketLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { appState, appDispatch } = useContext(AppContext);
  const [newNotification, setNewNotification] = useState();
  const [isMessageRead, setIsMessageRead] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appState.user?.id?.length > 0) {
      setLoading(false);
    }
  }, [appState.user?.id?.length]);

  useEffect(() => {
    if (!loading) {
      socket.connect();

      socket.on('connect', () => {
        console.log('Socket connected');
        socket.emit('login', appState.user.id);
      });

      socket.on('new_msg', (data: any) => {
        setNewNotification(data);
        setIsMessageRead(false);
        appDispatch(
          updateIncomingMessagesAction({
            message: data.message,
            from: data.from,
          })
        );
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        socket.disconnect();
      });
    }

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [loading]);

  return (
    <SocketContext.Provider
      value={{ newNotification, isMessageRead, setIsMessageRead }}>
      {children}
    </SocketContext.Provider>
  );
}
