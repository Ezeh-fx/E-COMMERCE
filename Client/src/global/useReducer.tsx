import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
}

const initialState: { loggin: UserState } = {
  loggin: { token: null },
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ token: string }>) => {
      return {
        ...state,
        loggin: { token: action.payload.token },
      };
    },
    logOut: () => {
      return {
        loggin: { token: null },
      };
    },
  },
});

export const { setUser, logOut } = userReducer.actions;
export default userReducer.reducer;