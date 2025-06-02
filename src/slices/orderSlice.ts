import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

interface OrderListState {
  // заказы пользователя
  userOrders: TOrder[];
  userOrdersIsLoading: boolean;
  userOrdersError: unknown | null;
  // оформить заказ
  orderBurger: TOrder | null;
  orderBurgerIsLoading: boolean;
  orderBurgerError: unknown | null;
  // просмотр заказа пользователя
  ordersByNumberApi: TOrder | null;
  ordersByNumberApiIsLoading: boolean;
  ordersByNumberApiError: unknown | null;
}

export const initialState: OrderListState = {
  // заказы пользователя
  userOrders: [],
  userOrdersIsLoading: false,
  userOrdersError: null,
  // оформить заказ
  orderBurger: null,
  orderBurgerIsLoading: false,
  orderBurgerError: null,
  // просмотр заказа пользователя
  ordersByNumberApi: null,
  ordersByNumberApiIsLoading: false,
  ordersByNumberApiError: null
};

export const fetchUserOrdersApi = createAsyncThunk(
  'order/getOrders',
  async () => getOrdersApi()
);

export const fetchOrderBurgerApi = createAsyncThunk(
  'order/orderBurgerApi',
  async (data: string[]) => orderBurgerApi(data)
);

export const fetchGetOrderByNumberApi = createAsyncThunk(
  'order/getOrderByNumberApi',
  async (orderId: number) => getOrderByNumberApi(orderId)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderBurgerData: (state) => {
      state.orderBurger = null;
    }
  },
  extraReducers: (builder) => {
    // заказы пользователя
    builder.addCase(fetchUserOrdersApi.pending, (state: OrderListState) => {
      state.userOrdersIsLoading = true;
    });
    builder.addCase(
      fetchUserOrdersApi.fulfilled,
      (state: OrderListState, action) => {
        state.userOrders = action.payload;
        state.userOrdersIsLoading = false;
      }
    );
    builder.addCase(
      fetchUserOrdersApi.rejected,
      (state: OrderListState, action) => {
        state.userOrdersIsLoading = false;
        state.userOrdersError = action.payload;
      }
    );
    // оформить заказ
    builder.addCase(fetchOrderBurgerApi.pending, (state: OrderListState) => {
      state.orderBurgerIsLoading = true;
    });
    builder.addCase(
      fetchOrderBurgerApi.fulfilled,
      (state: OrderListState, action) => {
        state.orderBurger = action.payload.order;
        state.orderBurgerIsLoading = false;
      }
    );
    builder.addCase(
      fetchOrderBurgerApi.rejected,
      (state: OrderListState, action) => {
        state.orderBurgerIsLoading = false;
        state.orderBurgerError = action.payload;
      }
    );
    // просмотр заказа пользователя
    builder.addCase(
      fetchGetOrderByNumberApi.pending,
      (state: OrderListState) => {
        state.ordersByNumberApiIsLoading = true;
      }
    );
    builder.addCase(
      fetchGetOrderByNumberApi.fulfilled,
      (state: OrderListState, action) => {
        state.ordersByNumberApi = action.payload.orders[0];
        state.ordersByNumberApiIsLoading = false;
      }
    );
    builder.addCase(
      fetchGetOrderByNumberApi.rejected,
      (state: OrderListState, action) => {
        state.ordersByNumberApiIsLoading = false;
        state.ordersByNumberApiError = action.payload;
      }
    );
  },
  selectors: {
    selectUserOrders: (sliceState) => sliceState.userOrders,
    orderBurger: (sliceState) => sliceState.orderBurger,
    selectOrderBurgerIsLoading: (sliceState) => sliceState.orderBurgerIsLoading,
    selectOrdersByNumberApi: (sliceState) => sliceState.ordersByNumberApi
  }
});

export const {
  selectUserOrders,
  orderBurger,
  selectOrderBurgerIsLoading,
  selectOrdersByNumberApi
} = orderSlice.selectors;
export const { clearOrderBurgerData } = orderSlice.actions;

export default orderSlice.reducer;
