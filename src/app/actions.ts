import {
  UpdateUserAction,
  ActionType,
  User,
  UpdateTokenAction,
  UpdateIncomingMessagesAction,
} from './types';

const updateUserAction = (user: User): UpdateUserAction => ({
  type: ActionType.UPDATE_USER,
  user,
});

const updateTokenAction = (accessToken: string): UpdateTokenAction => ({
  type: ActionType.UPDATE_TOKEN,
  accessToken,
});

const updateIncomingMessagesAction = (
  message: any
): UpdateIncomingMessagesAction => ({
  type: ActionType.UPDATE_INCOMING_MESSAGES,
  message,
});

export { updateUserAction, updateTokenAction, updateIncomingMessagesAction };
