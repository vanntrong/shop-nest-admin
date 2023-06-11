import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { apiLogin, apiLogout } from '@/api/user.api';
import { LoginParams, Role } from '@/interface/user/login';
import { Locale, User, UserState } from '@/interface/user/user';
import { createAsyncAction } from './utils';
import { getGlobalState } from '@/utils/getGlobal';

const initialState: UserState = {
  ...getGlobalState(),
  noticeCount: 0,
  locale: (localStorage.getItem('locale')! || 'en_US') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  logged: localStorage.getItem('token') ? true : false,
  menuList: [],
  username: localStorage.getItem('username') || '',
  role: (localStorage.getItem('username') || '') as Role,
  accessToken: localStorage.getItem('token') || '',
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<Partial<UserState>>) {
      const { accessToken } = action.payload;

      if (accessToken !== state.accessToken) {
        localStorage.setItem('token', action.payload.accessToken || '');
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

    dispatch(setToken({ accessToken: token }));
    if (token) {
      localStorage.setItem('username', data.user.full_name);
      localStorage.setItem('t', token);
      dispatch(setUserItem({ logged: true, username: data.user.full_name }));
    } else {
      localStorage.setItem('username', '');
      dispatch(setUserItem({ logged: false, username: '' }));
    }

    return data;
  };
});

export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    const { status } = await apiLogout({ token: localStorage.getItem('t')! });

    if (status) {
      localStorage.clear();
      dispatch(
        setUserItem({
          logged: false,
        }),
      );

      return true;
    }

    return false;
  };
};
