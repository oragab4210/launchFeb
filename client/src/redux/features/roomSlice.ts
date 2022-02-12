import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NumberState {
  value: string;
}
const initialState: NumberState = {
  value: "",
};

export const currentRoomSlice = createSlice({
  name: "currentroom",
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setRoom } = currentRoomSlice.actions;
export default currentRoomSlice.reducer;
