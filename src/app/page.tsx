'use client';

import { FormEvent, Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext, Friend } from './context/AppContext';
import { useContext } from 'react';
import { SocketContext } from './context/SocketContext';

export default function Home() {
  const router = useRouter();
  const context = useContext(AppContext);
  const socketContext = useContext(SocketContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('user') as string;
    console.log({ token: context.token });
    await fetch('/api/findUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.token}`,
      },
      body: JSON.stringify({ name, token: context.token }),
    });
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: context.token }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          if (data.ok) {
            router.push('/login');
            context.updateUser({ name: '', loggedIn: false, id: '' });
            localStorage.removeItem('token');
          }
        });
      }
    });
  };

  const addFriend = async (friend: Friend) => {
    await fetch('/api/addFriend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: friend.name,
        userId: context.user.id,
        friendId: friend.userId,
      }),
    });
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
      context.updateToken(authToken);
    }
  }, []);

  if (!context.token) {
    return (
      <main className="flex flex-col min-h-screen bg-gray-900 dark:bg-black">
        {/* Header */}
        <header className="py-4 px-8 bg-gray-800 dark:bg-gray-900 w-full flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            My Chat App - {context.user.name}
          </h1>
          {/* Placeholder for logo */}
          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        </header>

        {/* Main content */}
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          {/* You are not logged in */}
          <h1 className="text-xl font-bold text-white mb-4 text-center">
            You are not logged in
          </h1>
          {/* Login button */}
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={() => router.push('/login')}>
            Login
          </button>
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
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-900 dark:bg-black">
      {/* Header */}
      <header className="py-4 px-8 bg-gray-800 dark:bg-gray-900 w-full flex items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-bold text-white">{context.user.name}</h1>
          <div className="relative">
            <div
              className="w-10 h-10 bg-gray-600 rounded-full cursor-pointer hover:bg-gray-700"
              onClick={toggleDropdown}></div>
            {showDropdown && (
              <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow p-8">
        <form onSubmit={(e) => searchUser(e)} className="mt-8">
          <h1 className="dark:text-white">Search user</h1>
          <input
            className="border-2 border-blue-500 dark:border-gray-700 rounded-md text-black dark:text-white p-2 mt-2"
            type="text"
            id="user"
            name="user"
            placeholder="Search User"
          />
          <button className="rounded-md bg-blue-500 text-white dark:bg-gray-800 dark:text-gray-200 px-4 py-2 mt-2">
            Search User
          </button>
        </form>

        {/* User list */}
        <div className="mt-8">
          <h1 className="text-white text-2xl mb-4 dark:text-white">
            My Contacts
          </h1>

          {context.user.friends?.map((friend) => {
            return (
              <div
                key={friend.userId}
                className="flex items-center justify-between cursor-pointer border-b border-gray-200 py-4 px-6 dark:border-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-800"
                onClick={() => {
                  router.push(`/chat-room/${friend.friendId!}`);
                }}>
                <div className="flex items-center space-x-4">
                  {/* User avatar */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  {/* User name */}
                  <div className="text-lg font-semibold dark:text-white">
                    {friend.name}
                  </div>
                </div>
                {/* Badge for new message */}
                {socketContext.newNotification &&
                  socketContext.newNotification.from.senderId ===
                    friend.friendId &&
                  !socketContext.isMessageRead && (
                    <div className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs dark:bg-gray-700 dark:text-gray-200">
                      New
                    </div>
                  )}
              </div>
            );
          })}
        </div>
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
}
