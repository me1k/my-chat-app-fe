import { createContext } from 'react';
import { AppDispatch, AppState } from '../types';

export const AppContext = createContext<{
  appState: AppState;
  appDispatch: AppDispatch;
}>({
  appState: {
    user: {
      friends: [],
      id: '',
      loggedIn: false,
      name: '',
    },
    token: null,
    incomingMessages: [],
  },
  appDispatch: () => {},
});
