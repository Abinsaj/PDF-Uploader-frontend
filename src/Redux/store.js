import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";
import userSlice from './userSlice.js'


const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"]
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);


const store = configureStore({
    reducer: {
        user: persistedUserReducer,
    }
});

export const persistor = persistStore(store);


export const useAppDispatch = () => useDispatch();

export default store;
