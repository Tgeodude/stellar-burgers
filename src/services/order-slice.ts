import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

export type OrderState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null
};

export const sendOrder = createAsyncThunk<TOrder, string[]>(
  'order/sendOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data.order;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка оформления заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
