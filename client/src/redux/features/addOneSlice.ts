import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NumberState {
  value: number;
}
const initialState: NumberState = {
  value: 0,
};

export const addOneSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<number>) => {
      state.value = state.value + action.payload;
    },
  },
});

export const { addOne } = addOneSlice.actions;
export default addOneSlice.reducer;
