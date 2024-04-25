'use client';

import { useReducer } from 'react';
import { Action, ActionType, AppState } from './types';

const initialState: AppState = {
  user: {
    friends: [],
    id: '',
    loggedIn: false,
    name: '',
  },
  token: null,
  incomingMessages: [],
};

const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_USER:
      return {
        ...state,
        user: action.user,
      };
    case ActionType.UPDATE_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case ActionType.UPDATE_INCOMING_MESSAGES:
      console.log({ action });
      return {
        ...state,
        incomingMessages: [...state.incomingMessages, {message: action.message}],
      };

    default:
      return state;
  }
};

export const useAppReducer = () => {
  const [appState, appDispatch] = useReducer(reducer, initialState);

  return { appState, appDispatch };
};
