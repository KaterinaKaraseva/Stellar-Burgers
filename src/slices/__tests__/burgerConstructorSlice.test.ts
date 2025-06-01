import { expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  initialState,
  addBurgerConstructorIngredient,
  removeBurgerConstructorIngredient,
  moveToIngredient
} from '../burgerConstructorSlice';
import mockIngredientsResponse from '../../../cypress/fixtures/ingredients.json';

const mockBunIngredient = mockIngredientsResponse.data[0];
const mockMainIngredient = mockIngredientsResponse.data[1];
const MUTATION_ID = 'mock-uuid';

jest.mock('uuid', () => ({
  v4: () => MUTATION_ID
}));

describe('burgerConstructorSlice', () => {
  test('обработку экшена добавления ингредиента с учетом поля "bun"', () => {
    const { ingredients, bun } = reducer(
      initialState,
      addBurgerConstructorIngredient(mockBunIngredient)
    );

    expect(mockBunIngredient.type).toBe('bun');
    expect(bun).toEqual({ ...mockBunIngredient, id: MUTATION_ID });
    expect(ingredients).toHaveLength(0);
  });

  test('обработку экшена добавления ингредиента с учетом поля "main"', () => {
    const { ingredients, bun } = reducer(
      initialState,
      addBurgerConstructorIngredient(mockMainIngredient)
    );

    expect(mockMainIngredient.type).toBe('main');
    expect(bun).toBeNull();
    expect(ingredients).toEqual([{ ...mockMainIngredient, id: MUTATION_ID }]);
  });

  test('обработку экшена удаления ингредиента', () => {
    const { ingredients, bun } = reducer(
      { ingredients: [{ ...mockMainIngredient, id: MUTATION_ID }], bun: null },
      removeBurgerConstructorIngredient(MUTATION_ID)
    );

    expect(bun).toBeNull();
    expect(ingredients).toHaveLength(0);
  });

  test('добавление ингредиента в пустой конструктор', () => {
    const store =  configureStore({
      reducer: {
        ingredients: reducer
      }
    });

    expect(store.getState().ingredients.ingredients).toHaveLength(0);
    expect(store.getState().ingredients.bun).toBeNull();


    store.dispatch(addBurgerConstructorIngredient(mockMainIngredient));

    expect(store.getState().ingredients.ingredients).toHaveLength(1);
    expect(store.getState().ingredients.bun).toBeNull();
  });

  test('удаление ингредиента из пустого конструктора', () => {
    const store =  configureStore({
      reducer: {
        ingredients: reducer
      }
    });

    expect(store.getState().ingredients.ingredients).toHaveLength(0);
    expect(store.getState().ingredients.bun).toBeNull();


    store.dispatch(removeBurgerConstructorIngredient(0));

    expect(store.getState().ingredients.ingredients).toHaveLength(0);
    expect(store.getState().ingredients.bun).toBeNull();
  });

  test('перемещение ингредиента с неверными индексами', () => {
    const mockIngredients = mockIngredientsResponse.data.map((item, index) => ({
      ...item,
      id: String(index)
    }));

    const { ingredients, bun } = reducer(
      { ingredients: mockIngredients, bun: null },
      moveToIngredient({ fromIndex: mockIngredients.length + 10, toIndex: 1 })
    );

    expect(bun).toBeNull();
    expect(ingredients).toEqual(mockIngredients);

    ingredients.forEach((ingredient, index) => {
      expect(ingredient.id).toBe(mockIngredients[index].id);
    })
  });

  test('обработку экшена изменения порядка ингредиентов в начинке [вниз]', () => {
    const mockIngredients = mockIngredientsResponse.data.map((item, index) => ({
      ...item,
      id: String(index)
    }));

    const { ingredients, bun } = reducer(
      { ingredients: mockIngredients, bun: null },
      moveToIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(bun).toBeNull();
    expect(ingredients[0].id).toBe('1');
  });

  test('обработку экшена изменения порядка ингредиентов в начинке [вверх]', () => {
    const mockIngredients = mockIngredientsResponse.data.map((item, index) => ({
      ...item,
      id: String(index)
    }));

    const { ingredients, bun } = reducer(
      { ingredients: mockIngredients, bun: null },
      moveToIngredient({ fromIndex: 2, toIndex: 0 })
    );

    expect(bun).toBeNull();
    expect(ingredients[0].id).toBe('2');
  });
});
