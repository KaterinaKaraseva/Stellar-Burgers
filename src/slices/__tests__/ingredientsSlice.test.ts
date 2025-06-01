import { expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchIngredients } from '../ingredientsSlice';
import mockIngredientsResponse from '../../../cypress/fixtures/ingredients.json';

describe('ingredientsSlice', () => {
  test('При вызове экшенаRequest булевая переменная, отвечающая за текущий запрос меняется на true.', () => {
    const store = configureStore({ reducer: { ingredients: reducer } });

    expect(store.getState().ingredients.data).toEqual([]);
    expect(store.getState().ingredients.isLoading).toBe(true);
    expect(store.getState().ingredients.error).toBeNull();

    store.dispatch({ type: fetchIngredients.pending.type });

    expect(store.getState().ingredients.data).toEqual([]);
    expect(store.getState().ingredients.isLoading).toBe(true);
    expect(store.getState().ingredients.error).toBeNull();
  });

  test('При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор', () => {
    const store = configureStore({ reducer: { ingredients: reducer } });

    expect(store.getState().ingredients.data).toEqual([]);
    expect(store.getState().ingredients.isLoading).toBe(true);
    expect(store.getState().ingredients.error).toBeNull();

    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredientsResponse.data
    });

    expect(store.getState().ingredients.data).toEqual(
      mockIngredientsResponse.data
    );
    expect(store.getState().ingredients.isLoading).toBe(false);
    expect(store.getState().ingredients.error).toBeNull();
  });

  test('При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false', () => {
    const errorPayload = { message: 'error' };
    const store = configureStore({ reducer: { ingredients: reducer } });

    expect(store.getState().ingredients.data).toEqual([]);
    expect(store.getState().ingredients.isLoading).toBe(true);
    expect(store.getState().ingredients.error).toBeNull();

    store.dispatch({
      type: fetchIngredients.rejected.type,
      payload: errorPayload
    });

    expect(store.getState().ingredients.data).toEqual([]);
    expect(store.getState().ingredients.isLoading).toBe(false);
    expect(store.getState().ingredients.error).toEqual(errorPayload);
  });
});
