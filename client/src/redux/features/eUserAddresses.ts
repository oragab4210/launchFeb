import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NumberState {
  value: string[];
}
const initialState: NumberState = {
  value: [],
};

export const eUserAddressesSlice = createSlice({
  name: "currentUserAddresses",
  initialState,
  reducers: {
    setUserAddresses: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setUserAddresses } = eUserAddressesSlice.actions;
export default eUserAddressesSlice.reducer;
