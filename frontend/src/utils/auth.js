import { reactive } from 'vue';

const TOKEN_KEY = 'vsp_token';
const USER_KEY = 'vsp_user';

const storedUser = localStorage.getItem(USER_KEY);

export const session = reactive({
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: storedUser ? JSON.parse(storedUser) : null,
});

export const setSession = (token, user) => {
  session.token = token;
  session.user = user;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  session.token = '';
  session.user = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
