import { createContext } from 'react';

export type Friend = {
  name: string;
  userId: string;
  friendId?: string;
};

export type User = {
  id: string;
  name: string;
  loggedIn: boolean;
  friends?: Friend[];
};

export const AppContext = createContext<{
  updateUser: (user: User) => void;
  user: User;
  token: string;
  updateToken: (token: string) => void;
  updateIncomingMessages: (message: any) => void;
  incomingMessages: any;
}>({
  token: '',
  updateToken: (token: string) => {},
  updateUser: (user: User) => {},
  user: {
    id: '',
    name: '',
    loggedIn: false,
    friends: undefined,
  },
  updateIncomingMessages: (message: any) => {},
  incomingMessages: [],
});
