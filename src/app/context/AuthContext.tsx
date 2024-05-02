import { createContext } from 'react';

type TAuthContext = {
  accessToken: string;
  authDispatch: any
};

export const AuthContext = createContext<TAuthContext>({
  accessToken: '',
  authDispatch: () => {},
});
