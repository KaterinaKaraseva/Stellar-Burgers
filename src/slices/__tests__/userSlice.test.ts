import { expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  fetchGetUserApi,
  fetchLoginUserApi,
  fetchLogoutApi,
  fetchRegisterUserApi,
  fetchUpdateUserApi,
  initialState
} from '../userSlice';
import mockUserResponse from '../../../cypress/fixtures/user.json';

describe('userSlice', () => {
  let originalWindowLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: { replace: jest.fn() }
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation
    });
  });

  describe('user', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.user).toEqual(initialState.user);
      expect(store.getState().user.userIsLoading).toBe(false);
      expect(store.getState().user.userError).toBeNull();

      store.dispatch({ type: fetchGetUserApi.pending.type });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.user).toEqual(initialState.user);
      expect(store.getState().user.userIsLoading).toBe(true);
      expect(store.getState().user.userError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.user).toEqual(initialState.user);
      expect(store.getState().user.userIsLoading).toBe(false);
      expect(store.getState().user.userError).toBeNull();

      store.dispatch({
        type: fetchGetUserApi.fulfilled.type,
        payload: mockUserResponse
      });

      expect(store.getState().user.isAuthenticated).toBe(true);
      expect(store.getState().user.user).toEqual(mockUserResponse.user);
      expect(store.getState().user.userIsLoading).toEqual(false);
      expect(store.getState().user.userError).toBeNull();
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.user).toEqual(initialState.user);
      expect(store.getState().user.userIsLoading).toBe(false);
      expect(store.getState().user.userError).toBeNull();

      store.dispatch({
        type: fetchGetUserApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.user).toEqual(initialState.user);
      expect(store.getState().user.userIsLoading).toBe(false);
      expect(store.getState().user.userError).toEqual(errorPayload);
    });
  });

  describe('logout', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.logout).toEqual(null);
      expect(store.getState().user.logoutIsLoading).toBe(false);
      expect(store.getState().user.logoutError).toBeNull();

      store.dispatch({ type: fetchLogoutApi.pending.type });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.logout).toEqual(null);
      expect(store.getState().user.logoutIsLoading).toBe(true);
      expect(store.getState().user.logoutError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.logout).toEqual(null);
      expect(store.getState().user.logoutIsLoading).toBe(false);
      expect(store.getState().user.logoutError).toBeNull();

      store.dispatch({
        type: fetchLogoutApi.fulfilled.type,
        payload: mockUserResponse
      });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.logout).toEqual(null);
      expect(store.getState().user.logoutIsLoading).toEqual(false);
      expect(store.getState().user.logoutError).toBeNull();
      expect(store.getState().user.user).toEqual(initialState.user);
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.logout).toEqual(null);
      expect(store.getState().user.logoutIsLoading).toBe(false);
      expect(store.getState().user.logoutError).toBeNull();

      store.dispatch({
        type: fetchLogoutApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.logout).toEqual(null);
      expect(store.getState().user.logoutIsLoading).toBe(false);
      expect(store.getState().user.logoutError).toEqual(errorPayload);
    });
  });

  describe('update', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.update).toEqual(null);
      expect(store.getState().user.updateIsLoading).toBe(false);
      expect(store.getState().user.updateError).toBeNull();

      store.dispatch({ type: fetchUpdateUserApi.pending.type });

      expect(store.getState().user.update).toEqual(null);
      expect(store.getState().user.updateIsLoading).toBe(true);
      expect(store.getState().user.updateError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.update).toEqual(null);
      expect(store.getState().user.updateIsLoading).toBe(false);
      expect(store.getState().user.updateError).toBeNull();

      store.dispatch({
        type: fetchUpdateUserApi.fulfilled.type,
        payload: mockUserResponse
      });

      expect(store.getState().user.isAuthenticated).toBe(true);
      expect(store.getState().user.update).toEqual(null);
      expect(store.getState().user.updateIsLoading).toEqual(false);
      expect(store.getState().user.updateError).toBeNull();
      expect(store.getState().user.user).toEqual(mockUserResponse.user);
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.update).toEqual(null);
      expect(store.getState().user.updateIsLoading).toBe(false);
      expect(store.getState().user.updateError).toBeNull();

      store.dispatch({
        type: fetchUpdateUserApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.update).toEqual(null);
      expect(store.getState().user.updateIsLoading).toBe(false);
      expect(store.getState().user.updateError).toEqual(errorPayload);
    });
  });

  describe('registration', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.registration).toEqual(null);
      expect(store.getState().user.registrationIsLoading).toBe(false);
      expect(store.getState().user.registrationError).toBeNull();

      store.dispatch({ type: fetchRegisterUserApi.pending.type });

      expect(store.getState().user.registration).toEqual(null);
      expect(store.getState().user.registrationIsLoading).toBe(true);
      expect(store.getState().user.registrationError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.registration).toEqual(null);
      expect(store.getState().user.registrationIsLoading).toBe(false);
      expect(store.getState().user.registrationError).toBeNull();

      store.dispatch({
        type: fetchRegisterUserApi.fulfilled.type,
        payload: mockUserResponse
      });

      expect(store.getState().user.isAuthenticated).toBe(true);
      expect(store.getState().user.registration).toEqual(null);
      expect(store.getState().user.registrationIsLoading).toEqual(false);
      expect(store.getState().user.registrationError).toBeNull();
      expect(store.getState().user.user).toEqual(mockUserResponse.user);
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.registration).toEqual(null);
      expect(store.getState().user.registrationIsLoading).toBe(false);
      expect(store.getState().user.registrationError).toBeNull();

      store.dispatch({
        type: fetchRegisterUserApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.registration).toEqual(null);
      expect(store.getState().user.registrationIsLoading).toBe(false);
      expect(store.getState().user.registrationError).toEqual(errorPayload);
    });
  });

  describe('login', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.login).toEqual(null);
      expect(store.getState().user.loginIsLoading).toBe(false);
      expect(store.getState().user.loginError).toBeNull();

      store.dispatch({ type: fetchLoginUserApi.pending.type });

      expect(store.getState().user.login).toEqual(null);
      expect(store.getState().user.loginIsLoading).toBe(true);
      expect(store.getState().user.loginError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.login).toEqual(null);
      expect(store.getState().user.loginIsLoading).toBe(false);
      expect(store.getState().user.loginError).toBeNull();

      store.dispatch({
        type: fetchLoginUserApi.fulfilled.type,
        payload: mockUserResponse
      });

      expect(store.getState().user.isAuthenticated).toBe(true);
      expect(store.getState().user.login).toEqual(null);
      expect(store.getState().user.loginIsLoading).toEqual(false);
      expect(store.getState().user.loginError).toBeNull();
      expect(store.getState().user.user).toEqual(mockUserResponse.user);
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { user: reducer } });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.login).toEqual(null);
      expect(store.getState().user.loginIsLoading).toBe(false);
      expect(store.getState().user.loginError).toBeNull();

      store.dispatch({
        type: fetchLoginUserApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().user.isAuthenticated).toBe(false);
      expect(store.getState().user.login).toEqual(null);
      expect(store.getState().user.loginIsLoading).toBe(false);
      expect(store.getState().user.loginError).toEqual(errorPayload);
    });
  });
});
