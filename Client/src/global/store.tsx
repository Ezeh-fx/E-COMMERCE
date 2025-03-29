import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./useReducer";


export const store = configureStore ({
    reducer : {
        change : userReducer
    }
})


export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./useReducer";
// import {
//     persistReducer,
//     persistStore,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//     key: "root",
//     version: 1,
//     storage,
// };

// const persistedReducer = persistReducer(persistConfig, userReducer);

// export const store = configureStore({
//     reducer: {
//         user: persistedReducer, // ✅ Fix: Persisted reducer should be inside an object
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }),
// });

// export const persistor = persistStore(store);