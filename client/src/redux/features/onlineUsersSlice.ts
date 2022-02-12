import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface onlineUserState {
  value: any;
  // posts?: any;
}
const initialState: onlineUserState = {
  value: [],
};

export const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (state, { payload }: PayloadAction<onlineUserState>) => {
      // Object.assign(state, payload);
      state.value = payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
