import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  value: [];
}
const initialState: UserState = {
  value: [],
};

export const previousMessagesSlice = createSlice({
  name: "previousMessages",
  initialState,
  reducers: {
    setPreviousMessages: (state, action: PayloadAction<[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setPreviousMessages } = previousMessagesSlice.actions;
export default previousMessagesSlice.reducer;
