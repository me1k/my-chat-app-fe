import { createContext } from 'react';

type TokenContext = {
  authToken: string;
  updateToken: (token: string) => void;
};

export const TokenContext = createContext<TokenContext>({
  authToken: '',
  updateToken: (token: string) => {},
});
