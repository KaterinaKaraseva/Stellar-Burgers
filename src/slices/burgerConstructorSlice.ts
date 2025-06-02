import { ActionCreator, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { fetchOrderBurgerApi } from './orderSlice';
import { v4 as uuidv4 } from 'uuid';

interface BurgerConstructorState {
  bun: null | TConstructorIngredient;
  ingredients: TConstructorIngredient[];
}

export const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: (creators) => ({
    addBurgerConstructorIngredient: creators.preparedReducer(
      (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      }),

      (state: BurgerConstructorState, action: PayloadAction<any>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients = [...state.ingredients, action.payload];
        }
      }
    ),
    removeBurgerConstructorIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveToIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      function array_move(arr: any[], old_index: number, new_index: number) {
        if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
            arr.push(undefined);
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
      }

      if (
        state.ingredients.length &&
        state.ingredients[action.payload.fromIndex] &&
        state.ingredients[action.payload.toIndex]
      ) {
        state.ingredients = array_move(
          state.ingredients,
          action.payload.fromIndex,
          action.payload.toIndex
        );
      }
    }
  }),
  extraReducers: (builder) => {
    builder.addCase(
      fetchOrderBurgerApi.fulfilled,
      (state: BurgerConstructorState, action) => {
        state.bun = null;
        state.ingredients = [];
      }
    );
  },
  selectors: {
    selectBurgerConstructor: (sliceState) =>
      ({ ...sliceState }) as BurgerConstructorState
  }
});

export const { selectBurgerConstructor } = burgerConstructorSlice.selectors;
export const {
  addBurgerConstructorIngredient,
  removeBurgerConstructorIngredient,
  moveToIngredient
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
