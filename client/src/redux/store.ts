import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import { addOneReducer } from "./reducers/addOneReducer";
import addOneReducer from "./features/addOneSlice";
import currentRoomReducer from "./features/roomSlice";
import eUserAddressesReducer from "./features/eUserAddresses";
import currentUserReducer from "./features/currentUserSlice";
import previousMessagesReducer from "./features/previousMessagesSlice";
import onlineUsersReducer from "./features/onlineUsersSlice";
import socketSliceReducer from "./features/socketSlice";
export const store = configureStore({
  reducer: {
    currentNumber: addOneReducer,
    currentRoom: currentRoomReducer,
    userAddresses: eUserAddressesReducer,
    currentUser: currentUserReducer,
    previousMessages: previousMessagesReducer,
    onlineUsers: onlineUsersReducer,
    socket: socketSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
