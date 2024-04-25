'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useContext } from 'react';
import Link from 'next/link';
import { updateTokenAction, updateUserAction } from '../actions';
import { AppContext } from '../context/AppContext';

const LoginView = () => {
  const router = useRouter();
  const { appState, appDispatch } = useContext(AppContext);
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          console.log({ data });

          appDispatch(
            updateUserAction({
              ...data.response.user,
              loggedIn: true,
            })
          );
          appDispatch(updateTokenAction(data.response.token));
          localStorage.setItem('token', data.response.token);
          router.push('/');
        });
      }
    });
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 dark:bg-black">
      {/* Header */}
      <header className="py-4 px-8 bg-gray-800 dark:bg-gray-900 w-full flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">My Chat App</h1>
        {/* Placeholder for logo */}
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      </header>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-900"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-900"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-700 text-gray-300 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              Login
            </button>
          </form>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
            Don't have an account?{' '}
            <Link legacyBehavior href="/register">
              <a className="text-blue-500 hover:underline">Register here</a>
            </Link>
          </p>
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
    </div>
  );
};

export default LoginView;
