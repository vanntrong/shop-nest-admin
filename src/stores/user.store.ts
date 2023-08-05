import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { apiLogin, apiLogout } from '@/api/user.api';
import { LoginParams, Role } from '@/interface/user/login';
import { Locale, User, UserState } from '@/interface/user/user';
import { createAsyncAction } from './utils';
import { getGlobalState } from '@/utils/getGlobal';
import { clearCookies, getToken, saveToken } from '@/utils/cookies';

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: getToken('access_token') ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: (localStorage.getItem('username') || '') as Role,
  accessToken: getToken('access_token') || '',
  refreshToken: getToken('refresh_token') || '',
  user: null,
  exp: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<Partial<UserState>>) {
      const { accessToken, exp, refreshToken } = action.payload;

      if (accessToken !== state.accessToken) {
        saveToken('access_token', action.payload.accessToken ?? '', exp ?? 0);
      }

      if (refreshToken !== state.refreshToken) {
        saveToken('refresh_token', action.payload.refreshToken ?? '');
      }

      Object.assign(state, action.payload);
    },
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      const { username } = action.payload;

      if (username !== state.username) {
        localStorage.setItem('username', action.payload.username || '');
      }

      Object.assign(state, action.payload);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setUserItem } = userSlice.actions;
export const { setToken } = userSlice.actions;
export const { setUser } = userSlice.actions;

export default userSlice.reducer;

// source async thunk
// export const loginAsync = (payload: LoginParams) => {
//   return async (dispatch: Dispatch) => {
//     const { result, status } = await apiLogin(payload);
//     if (status) {
//       localStorage.setItem('t', result.token);
//       localStorage.setItem('username', result.username);
//       dispatch(
//         setUserItem({
//           logged: true,
//           username: result.username
//         })
//       );
//       return true;
//     }
//     return false;
//   };
// };

// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = createAsyncAction<LoginParams, boolean>(payload => {
  return async dispatch => {
    const data: any = await apiLogin(payload);

    const token = data.tokens && data.tokens.access_token ? data.tokens.access_token : '';
    const refreshToken = data.tokens && data.tokens.refresh_token ? data.tokens.refresh_token : '';

    dispatch(setToken({ accessToken: token, refreshToken: refreshToken, exp: data.tokens.exp }));
    if (token) {
      localStorage.setItem('username', data.data.name);
      localStorage.setItem('t', token);
      dispatch(setUserItem({ logged: true, username: data.data.name }));
    } else {
      localStorage.setItem('username', '');
      dispatch(setUserItem({ logged: false, username: '' }));
    }

    return data;
  };
});

export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    await apiLogout();

    clearCookies();
    dispatch(
      setUserItem({
        logged: false,
      }),
    );

    return true;
  };
};
