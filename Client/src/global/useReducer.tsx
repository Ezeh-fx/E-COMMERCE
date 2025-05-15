import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  token: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  profileImages: string;
  id: string;
}

interface UserState {
  user: UserType | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, updateUser, logOut } = userSlice.actions;
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