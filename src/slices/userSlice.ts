import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

interface UserListState {
  isAuthenticated: boolean;
  // user
  user: TUser;
  userIsLoading: boolean;
  userError: unknown | null;
  // login
  logout: null;
  logoutIsLoading: boolean;
  logoutError: unknown | null;
  // update
  update: null;
  updateIsLoading: boolean;
  updateError: unknown | null;
  // registration
  registration: null;
  registrationIsLoading: boolean;
  registrationError: unknown | null;
  // login
  login: null;
  loginIsLoading: boolean;
  loginError: unknown | null;
}

export const initialState: UserListState = {
  isAuthenticated: false,
  user: {
    email: '',
    name: ''
  },
  userIsLoading: false,
  userError: null,
  // login
  logout: null,
  logoutIsLoading: false,
  logoutError: null,
  // update
  update: null,
  updateIsLoading: false,
  updateError: null,
  // registration
  registration: null,
  registrationIsLoading: false,
  registrationError: null,
  // registration
  login: null,
  loginIsLoading: false,
  loginError: null
};

export const fetchGetUserApi = createAsyncThunk('user/getUserApi', async () =>
  getUserApi()
);

export const fetchLoginUserApi = createAsyncThunk(
  'user/loginUserApi',
  async (data: TLoginData) => loginUserApi(data)
);

export const fetchUpdateUserApi = createAsyncThunk(
  'user/updateUserApi',
  async (data: TLoginData) => updateUserApi(data)
);

export const fetchRegisterUserApi = createAsyncThunk(
  'user/registerUserApi',
  async (data: TRegisterData) => registerUserApi(data)
);

export const fetchLogoutApi = createAsyncThunk('user/logoutApi', async () =>
  logoutApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // user
    builder.addCase(fetchGetUserApi.pending, (state: UserListState) => {
      state.userIsLoading = true;
    });
    builder.addCase(
      fetchGetUserApi.fulfilled,
      (state: UserListState, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userIsLoading = false;
      }
    );
    builder.addCase(
      fetchGetUserApi.rejected,
      (state: UserListState, action) => {
        state.isAuthenticated = false;
        state.userIsLoading = false;
        state.userError = action.payload;
      }
    );
    // logout
    builder.addCase(fetchLogoutApi.pending, (state: UserListState) => {
      state.logoutIsLoading = true;
    });
    builder.addCase(fetchLogoutApi.fulfilled, (state: UserListState) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      state.isAuthenticated = false;
      state.user = initialState.user;
      window.location.replace('/');
    });
    builder.addCase(fetchLogoutApi.rejected, (state: UserListState, action) => {
      state.logoutIsLoading = false;
      state.logoutError = action.payload;
    });
    // update
    builder.addCase(fetchUpdateUserApi.pending, (state: UserListState) => {
      state.updateIsLoading = true;
    });
    builder.addCase(
      fetchUpdateUserApi.fulfilled,
      (state: UserListState, action: PayloadAction<TUserResponse>) => {
        state.isAuthenticated = true;
        state.updateIsLoading = false;
        state.user = action.payload.user;
        window.location.replace('/profile');
      }
    );
    builder.addCase(
      fetchUpdateUserApi.rejected,
      (state: UserListState, action) => {
        state.isAuthenticated = false;
        state.updateIsLoading = false;
        state.updateError = action.payload;
      }
    );
    // registration
    builder.addCase(fetchRegisterUserApi.pending, (state: UserListState) => {
      state.registrationIsLoading = true;
    });
    builder.addCase(
      fetchRegisterUserApi.fulfilled,
      (state: UserListState, action: PayloadAction<TUserResponse>) => {
        state.isAuthenticated = true;
        state.registrationIsLoading = false;
        state.user = action.payload.user;
        window.location.replace('/');
      }
    );
    builder.addCase(
      fetchRegisterUserApi.rejected,
      (state: UserListState, action) => {
        state.registrationIsLoading = false;
        state.registrationError = action.payload;
      }
    );
    // login
    builder.addCase(fetchLoginUserApi.pending, (state: UserListState) => {
      state.loginIsLoading = true;
    });
    builder.addCase(
      fetchLoginUserApi.fulfilled,
      (state: UserListState, action) => {
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);

        state.user = action.payload.user;
        state.loginIsLoading = false;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(
      fetchLoginUserApi.rejected,
      (state: UserListState, action) => {
        state.loginIsLoading = false;
        state.loginError = action.payload;
      }
    );
  },
  selectors: {
    selectIsAuthenticated: (sliceState) => sliceState.isAuthenticated,
    selectUserData: (sliceState) => sliceState.user,
    selectUserIsLoading: (sliceState) => sliceState.userIsLoading
  }
});

export const { selectUserData, selectUserIsLoading, selectIsAuthenticated } =
  userSlice.selectors;

export default userSlice.reducer;
