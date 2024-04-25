// Define the type for the user object
export type User = {
  friends: any[];
  id: string;
  name: string;
  loggedIn: boolean;
};

// Define the state type
export type AppState = {
  user: User;
  token: string | null;
  incomingMessages: { message: any }[]; // Define the type for incoming messages
};

export type AppDispatch = (action: Action) => void;

// Define action types
export enum ActionType {
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_TOKEN = 'UPDATE_TOKEN',
  UPDATE_INCOMING_MESSAGES = 'UPDATE_INCOMING_MESSAGES',
}

// Define action interfaces
export type UpdateUserAction = {
  type: ActionType.UPDATE_USER;
  user: User;
};

export type UpdateTokenAction = {
  type: ActionType.UPDATE_TOKEN;
  token: string;
};

export type UpdateIncomingMessagesAction = {
  type: ActionType.UPDATE_INCOMING_MESSAGES;
  message: any;
};

// Union type for all actions
export type Action =
  | UpdateUserAction
  | UpdateTokenAction
  | UpdateIncomingMessagesAction;
