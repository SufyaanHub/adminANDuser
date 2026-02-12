import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
      state.isAuthenticated = !!value.payload;
      if (value.payload) {
        localStorage.setItem("token", value.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    setUser(state, value) {
      state.user = value.payload;
      if (value.payload) {
        localStorage.setItem("user", JSON.stringify(value.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setSignupData, setLoading, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;