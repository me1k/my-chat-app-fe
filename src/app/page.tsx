'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext, Friend } from './context/AppContext';
import { useContext } from 'react';
import { socket } from './ws';

export default function Home() {
  const router = useRouter();
  const context = useContext(AppContext);
  const [newNotification, setNewNotification] = useState<any>();

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

  const joinRoom = (friendId: any) => {
    socket.emit('joinRoom', { targetUserId: friendId });
    router.push(`/chat-room/${friendId}`);
  };

  const addFriend = async (friend: Friend) => {
    console.log({ friend });
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

  const getFriends = async () => {
    const res = await fetch('/api/getFriends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.token}`,
      },
      body: JSON.stringify({ userId: context.user.id }),
    });
    const { response } = await res.json().then((data) => data);

    context.updateUser({ ...context.user, friends: response });
  };

  useEffect(() => {
    // Set up event listener for 'new_msg' only once
    socket.on('new_msg', (data: any) => {
      context.updateIncomingMessages(data.message);
      console.log(data);
      setNewNotification(data);
    });

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off('new_msg');
    };
  }, []);

  // useEffect(() => {
  //   const authToken = localStorage.getItem('token');
  //   if (authToken) {
  //     context.updateToken(authToken);
  //   }
  // }, []);

  useEffect(() => {
    if (context.user.id.length > 0) {
      socket.connect();
      socket.on('connect', () => {
        console.log('connected', {
          socket: socket.id,
          userId: context.user.id,
        });
        socket.emit('login', context.user.id);

        socket.on('disconnect', () => {
          console.log('disconnected');
          router.push('/');
          socket.disconnect();
        });
      });
    }
  }, [context.user.id.length]);

  if (!context.token) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <button onClick={() => router.push('/login')}>Login</button>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-900 dark:bg-black">
      {/* Header */}
      <header className="py-4 px-8 bg-gray-800 dark:bg-gray-900 w-full flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{context.user.name}</h1>
        {/* Placeholder for logo */}
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      </header>

      {/* Main content */}
      <div className="flex-grow p-8">
        {/* Dropdown */}
        {context.user.friends?.map((friend) => {
          return (
            <div
              className="cursor-pointer flex justify-between border-2 border-blue-500 rounded-md color-blue-500 text-black-500 p-2 mt-2"
              key={friend.userId}
              onClick={() => joinRoom(friend.friendId!)}>
              <h1>{friend.name}</h1>
            </div>
          );
        })}

        {/* Other content */}
        <div className="flex justify-between mt-4">
          <button
            className="rounded-md bg-blue-500 px-4 py-2"
            onClick={handleLogout}>
            Logout
          </button>
          <button
            className="rounded-md bg-blue-500 px-4 py-2"
            onClick={() =>
              addFriend({
                name: 'meik',
                userId: 'd9f93df8-d496-4ab9-8b05-aae26029ce97',
              })
            }>
            Add Friend
          </button>
          <button
            className="rounded-md bg-blue-500 px-4 py-2"
            onClick={getFriends}>
            Get Friends
          </button>
        </div>

        <form onSubmit={(e) => searchUser(e)} className="mt-8">
          <h1>Search user</h1>
          <input
            className="border-2 border-blue-500 rounded-md color-blue-500 text-black-500 p-2 mt-2"
            style={{ color: 'black' }}
            type="text"
            id="user"
            name="user"
            placeholder="Search User"
          />
          <button className="rounded-md bg-blue-500 px-4 py-2 mt-2">
            Search User
          </button>
        </form>
        {newNotification && (
          <h1
            className="text-white text-2xl cursor-pointer"
            onClick={() => joinRoom(newNotification.room)}>
            You received a new message from{' '}
            <div className="text-blue-500 font-bold cursor-pointer">
              {newNotification.room}
            </div>
          </h1>
        )}
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
