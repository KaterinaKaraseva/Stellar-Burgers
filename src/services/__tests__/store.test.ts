import { expect, test, describe } from '@jest/globals';
import { rootReducer } from '../store';
import { initialState as burgerConstructorInitialState } from '../../slices/burgerConstructorSlice';
import { initialState as feedSliceInitialState } from '../../slices/feedSlice';
import { initialState as ingredientsSliceInitialState } from '../../slices/ingredientsSlice';
import { initialState as orderSliceInitialState } from '../../slices/orderSlice';
import { initialState as userSliceInitialState } from '../../slices/userSlice';

describe('store', () => {
  test('rootReducer', () => {
    const newState = rootReducer(undefined, { type: '' });

    expect(newState).toEqual({
      burgerConstructor: burgerConstructorInitialState,
      feed: feedSliceInitialState,
      ingredients: ingredientsSliceInitialState,
      order: orderSliceInitialState,
      user: userSliceInitialState
    });
  });
});
