'use client';

import { useContext, useEffect, useState } from 'react';
import ClientLayout from './client-layout';
import { SocketContext } from './context/SocketContext';
import { socket } from './ws';
import { AppContext } from './context/AppContext';

export default function SocketLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const context = useContext(AppContext);
  const [newNotification, setNewNotification] = useState();
  const [isMessageRead, setIsMessageRead] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (context.user.id.length > 0) {
      setLoading(false);
    }
  }, [context.user.id.length]);

  useEffect(() => {
    if (!loading) {
      socket.connect();

      socket.on('connect', () => {
        console.log('Socket connected');
        socket.emit('login', context.user.id);
      });

      socket.on('new_msg', (data: any) => {
        console.log({ data });
        setNewNotification(data);
        setIsMessageRead(false);
        context.updateIncomingMessages({
          message: data.message,
          from: data.from,
        });
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
  }, [loading, context.user.id.length]);

  return (
    <SocketContext.Provider
      value={{ newNotification, isMessageRead, setIsMessageRead }}>
      {children}
    </SocketContext.Provider>
  );
}
