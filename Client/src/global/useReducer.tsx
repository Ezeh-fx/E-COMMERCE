import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload; // Directly store payload
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;



// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface UserState {
//   token: string | null;
// }

// const initialState: { loggin: UserState } = {
//   loggin: { token: null },
// };

// const userReducer = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<{ token: string }>) => {
//       return {
//         ...state,
//         loggin: { token: action.payload.token },
//       };
//     },
//     logOut: () => {
//       return {
//         loggin: { token: null },
//       };
//     },
//   },
// });

// export const { setUser, logOut } = userReducer.actions;
// export default userReducer.reducer;