import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updatePhotoURL: (state, action) => {
      state.user.photoURL = action.payload.photoURL;
    },
  },
});

export const { login, logout, updatePhotoURL } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
