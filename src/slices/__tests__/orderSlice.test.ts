import { expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  fetchUserOrdersApi,
  fetchOrderBurgerApi,
  fetchGetOrderByNumberApi
} from '../orderSlice';
import mockOrdersResponse from '../../../cypress/fixtures/orders.json';
import mockOrderResponse from '../../../cypress/fixtures/order.json';

describe('orderSlice', () => {
  describe('заказы пользователя', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.userOrders).toEqual([]);
      expect(store.getState().order.userOrdersIsLoading).toBe(false);
      expect(store.getState().order.userOrdersError).toBeNull();

      store.dispatch({ type: fetchUserOrdersApi.pending.type });

      expect(store.getState().order.userOrders).toEqual([]);
      expect(store.getState().order.userOrdersIsLoading).toBe(true);
      expect(store.getState().order.userOrdersError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.userOrders).toEqual([]);
      expect(store.getState().order.userOrdersIsLoading).toBe(false);
      expect(store.getState().order.userOrdersError).toBeNull();

      store.dispatch({
        type: fetchUserOrdersApi.fulfilled.type,
        payload: mockOrdersResponse
      });

      expect(store.getState().order.userOrders).toEqual(mockOrdersResponse);
      expect(store.getState().order.userOrdersIsLoading).toEqual(false);
      expect(store.getState().order.userOrdersError).toBeNull();
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.userOrders).toEqual([]);
      expect(store.getState().order.userOrdersIsLoading).toBe(false);
      expect(store.getState().order.userOrdersError).toBeNull();

      store.dispatch({
        type: fetchUserOrdersApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().order.userOrders).toEqual([]);
      expect(store.getState().order.userOrdersIsLoading).toBe(false);
      expect(store.getState().order.userOrdersError).toEqual(errorPayload);
    });
  });

  describe('оформить заказ', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.orderBurger).toEqual(null);
      expect(store.getState().order.orderBurgerIsLoading).toBe(false);
      expect(store.getState().order.orderBurgerError).toBeNull();

      store.dispatch({ type: fetchOrderBurgerApi.pending.type });

      expect(store.getState().order.orderBurger).toEqual(null);
      expect(store.getState().order.orderBurgerIsLoading).toBe(true);
      expect(store.getState().order.orderBurgerError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.orderBurger).toEqual(null);
      expect(store.getState().order.orderBurgerIsLoading).toBe(false);
      expect(store.getState().order.orderBurgerError).toBeNull();

      store.dispatch({
        type: fetchOrderBurgerApi.fulfilled.type,
        payload: mockOrderResponse
      });

      expect(store.getState().order.orderBurger).toEqual(
        mockOrderResponse.order
      );
      expect(store.getState().order.orderBurgerIsLoading).toEqual(false);
      expect(store.getState().order.orderBurgerError).toBeNull();
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.orderBurger).toEqual(null);
      expect(store.getState().order.orderBurgerIsLoading).toBe(false);
      expect(store.getState().order.orderBurgerError).toBeNull();

      store.dispatch({
        type: fetchOrderBurgerApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().order.orderBurger).toEqual(null);
      expect(store.getState().order.orderBurgerIsLoading).toBe(false);
      expect(store.getState().order.orderBurgerError).toEqual(errorPayload);
    });
  });

  describe('просмотр заказа пользователя', () => {
    test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.ordersByNumberApi).toEqual(null);
      expect(store.getState().order.ordersByNumberApiIsLoading).toBe(false);
      expect(store.getState().order.ordersByNumberApiError).toBeNull();

      store.dispatch({ type: fetchGetOrderByNumberApi.pending.type });

      expect(store.getState().order.ordersByNumberApi).toEqual(null);
      expect(store.getState().order.ordersByNumberApiIsLoading).toBe(true);
      expect(store.getState().order.ordersByNumberApiError).toBeNull();
    });

    test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.ordersByNumberApi).toEqual(null);
      expect(store.getState().order.ordersByNumberApiIsLoading).toBe(false);
      expect(store.getState().order.ordersByNumberApiError).toBeNull();

      store.dispatch({
        type: fetchGetOrderByNumberApi.fulfilled.type,
        payload: mockOrdersResponse
      });

      expect(store.getState().order.ordersByNumberApi).toEqual(
        mockOrdersResponse.orders[0]
      );
      expect(store.getState().order.ordersByNumberApiIsLoading).toEqual(false);
      expect(store.getState().order.ordersByNumberApiError).toBeNull();
    });

    test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
      const errorPayload = { message: 'error' };
      const store = configureStore({ reducer: { order: reducer } });

      expect(store.getState().order.ordersByNumberApi).toEqual(null);
      expect(store.getState().order.ordersByNumberApiIsLoading).toBe(false);
      expect(store.getState().order.ordersByNumberApiError).toBeNull();

      store.dispatch({
        type: fetchGetOrderByNumberApi.rejected.type,
        payload: errorPayload
      });

      expect(store.getState().order.ordersByNumberApi).toEqual(null);
      expect(store.getState().order.ordersByNumberApiIsLoading).toBe(false);
      expect(store.getState().order.ordersByNumberApiError).toEqual(
        errorPayload
      );
    });
  });
});
