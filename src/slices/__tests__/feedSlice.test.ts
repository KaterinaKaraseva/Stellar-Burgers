import { expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchFeed } from '../feedSlice';
import mockOrdersResponse from '../../../cypress/fixtures/orders.json';

describe('feedSlice', () => {
  test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
    const store = configureStore({ reducer: { feed: reducer } });

    expect(store.getState().feed.orders).toEqual([]);
    expect(store.getState().feed.isLoading).toBe(true);
    expect(store.getState().feed.error).toBeNull();

    store.dispatch({ type: fetchFeed.pending.type });

    expect(store.getState().feed.orders).toEqual([]);
    expect(store.getState().feed.isLoading).toBe(true);
    expect(store.getState().feed.error).toBeNull();
  });

  test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
    const store = configureStore({ reducer: { feed: reducer } });

    expect(store.getState().feed.orders).toEqual([]);
    expect(store.getState().feed.isLoading).toBe(true);
    expect(store.getState().feed.error).toBeNull();

    store.dispatch({
      type: fetchFeed.fulfilled.type,
      payload: mockOrdersResponse
    });

    expect(store.getState().feed.orders).toEqual(mockOrdersResponse.orders);
    expect(store.getState().feed.total).toEqual(mockOrdersResponse.total);
    expect(store.getState().feed.totalToday).toEqual(
      mockOrdersResponse.totalToday
    );
    expect(store.getState().feed.isLoading).toBe(false);
    expect(store.getState().feed.error).toBeNull();
  });

  test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
    const errorPayload = { message: 'error' };
    const store = configureStore({ reducer: { feed: reducer } });

    expect(store.getState().feed.orders).toEqual([]);
    expect(store.getState().feed.isLoading).toBe(true);
    expect(store.getState().feed.error).toBeNull();

    store.dispatch({
      type: fetchFeed.rejected.type,
      payload: errorPayload
    });

    expect(store.getState().feed.orders).toEqual([]);
    expect(store.getState().feed.isLoading).toBe(false);
    expect(store.getState().feed.error).toEqual(errorPayload);
  });
});
