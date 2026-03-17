import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signUp: {
    fullName: "",
    emailOrPhone: "",
    password: "",
    role: "USER"
  },
  login: {
    emailOrPhone: "",
    password: "",
  },
};

const formSlice = createSlice({
  initialState,
  name: "formSlice",
  reducers: {
    updateInput: (state, { payload: { formName, key, value } }) => {
      state[formName][key] = value;
    },
  },
});

export const { updateInput } = formSlice.actions;
export default formSlice.reducer;
