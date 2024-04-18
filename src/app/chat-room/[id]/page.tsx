'use client';

import { AppContext } from '@/app/context/AppContext';
import { socket } from '@/app/ws';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const Pageroom = () => {
  const context = useContext(AppContext);
  const { id: targetUserId } = useParams();
  const router = useRouter();

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get('message') as string;

    socket.emit('message', message);
    context.updateIncomingMessages(message);
  };

  useEffect(() => {
    console.log('re-render');
    const getUser = async () => {
      await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: context.token }),
      });
    };
    if (context.token) getUser();
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-gray-900 dark:bg-black">
      {/* Header */}
      <header className="py-4 px-8 bg-gray-800 dark:bg-gray-900 w-full flex items-center justify-between">
        <button onClick={() => router.push('/')} className="text-white">
          {/* You can replace the text with an icon if you prefer */}
          Back
        </button>
        <h1 className="text-xl font-bold text-white">{targetUserId}</h1>
        {/* Placeholder for logo */}
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      </header>
      {/* Chat window */}
      <div className="flex-1 flex flex-col justify-between px-4 py-6">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {context.incomingMessages.map(({ message }: any, index: number) => {
            return (
              <div key={index} className="flex items-end justify-end">
                <div className="bg-gray-600 text-white rounded-lg p-2 max-w-xs">
                  <p>{message}</p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Input field */}
        <form onSubmit={sendMessage} className="flex items-center mt-4">
          <input
            type="text"
            name="message"
            id="message"
            placeholder="Enter Message"
            className="flex-1 bg-gray-800 dark:bg-gray-900 text-white border-b-2 border-gray-700 dark:border-gray-800 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            autoComplete="off"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Send
          </button>
        </form>
      </div>
      {/* Footer */}
      <footer className="py-4 px-8 bg-gray-800 dark:bg-gray-900 w-full text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">My Chat App - © 2024. All rights reserved.</p>
        <p className="text-xs">
          Built with <span className="text-blue-500">React</span> and{' '}
          <span className="text-yellow-500">Tailwind CSS</span>.
        </p>
      </footer>
    </main>
  );
};

export default Pageroom;
