import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../utils/burger-api';
import { TUser } from '../utils/types';
import { TLoginData, TRegisterData } from '../utils/burger-api';
import { setCookie, deleteCookie } from '../utils/cookie';

export type UserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuth: boolean;
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuth: false
};

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      const accessToken = res.accessToken.startsWith('Bearer ')
        ? res.accessToken.substring(7)
        : res.accessToken;
      setCookie('accessToken', accessToken);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка входа');
    }
  }
);

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      localStorage.setItem('refreshToken', res.refreshToken);
      const accessToken = res.accessToken.startsWith('Bearer ')
        ? res.accessToken.substring(7)
        : res.accessToken;
      setCookie('accessToken', accessToken);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка регистрации');
    }
  }
);

export const getUser = createAsyncThunk<TUser, void>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка получения профиля');
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка обновления профиля');
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка выхода');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuth = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuth = false;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuth = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuth = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default userSlice.reducer;
