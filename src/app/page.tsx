'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from './context/AppContext';
import { useContext } from 'react';
import { SocketContext } from './context/SocketContext';
import { updateUserAction } from './actions';
import { AuthContext } from './context/AuthContext';

function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export default function Home() {
  const router = useRouter();
  const socketContext = useContext(SocketContext);
  const { appState, appDispatch } = useContext(AppContext);
  const { accessToken } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('user') as string;

    await fetch('/api/findUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appState.accessToken}`,
      },
      body: JSON.stringify({ name, accessToken: appState.accessToken }),
    });
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken: appState.accessToken }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          if (data.ok) {
            router.push('/login');
            appDispatch(
              updateUserAction({
                name: '',
                loggedIn: false,
                id: '',
                friends: [],
              })
            );
            localStorage.removeItem('accessToken');
          }
        });
      }
    });
  };

  const addFriend = async () => {
    await fetch('/api/addFriend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'samira',
        userId: appState.user.id,
        friendId: 'clvb4z74v00017jbgjpzyv6x5',
      }),
    });
  };

  useEffect(() => {
    const getFriends = async () => {
      const res = await fetch('/api/getFriends', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { friends } = await res.json().then((data) => data);
      appDispatch(updateUserAction({ ...appState.user, friends }));
    };
    getFriends();
  }, [accessToken]);

  // useEffect(() => {
  //   if (!accessToken) return;
  //   if (!parseJwt(accessToken || '')) {
  //     router.push('/login');
  //   }
  // }, [accessToken]);

  if (!accessToken) {
    return (
      <main className="flex flex-col min-h-screen bg-gray-900 dark:bg-black">
        {/* Header */}
        <header className="py-4 px-8 bg-gray-800 dark:bg-gray-900 w-full flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            My Chat App - {appState?.user.name}
          </h1>
          {/* Placeholder for logo */}
          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        </header>

        {/* Main content */}
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          {/* Loading animation */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          </div>

          {/* Loading message */}
          <h1 className="text-xl font-bold text-white mb-4 text-center">
            Loading...
          </h1>
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
          <h1 className="text-xl font-bold text-white">
            {appState?.user.name}
          </h1>
          {/* Dropdown */}
          <div className="relative">
            <div
              className="w-10 h-10 bg-gray-600 rounded-full cursor-pointer hover:bg-gray-700 flex items-center justify-center"
              onClick={() => setShowDropdown((prev) => !prev)}>
              {/* Menu icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            {/* Dropdown menu */}
            <div
              className={`absolute top-full right-0 bg-gray-700 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg mt-2 w-48 transition-opacity duration-300 ${
                showDropdown ? 'opacity-100' : 'opacity-0 invisible'
              }`}>
              <ul className="py-2">
                <li
                  onClick={addFriend}
                  className="px-4 py-2 text-gray-100 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-300">
                  Add
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-100 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-300">
                  Logout
                </li>
              </ul>
            </div>
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

          {appState?.user.friends?.map((friend: any) => {
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
