import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id?: any;
  name?: any;
  email?: any;
  friends?: any;
  conversations?: any;
  posts?: any;
}
const initialState: UserState = {};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }: PayloadAction<UserState>) => {
      Object.assign(state, payload);
    },
  },
});

export const { setCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
