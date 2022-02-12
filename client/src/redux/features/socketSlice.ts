import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SocketState {
  value: any;
}
const initialState: SocketState = {
  value: null,
};

export const socketSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setSocket: (state, { payload }: PayloadAction<SocketState>) => {
      // Object.assign(state, payload);
      state.value = payload;
    },
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
