import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { combineReducers } from "redux";
import productsReducer from "./slices/productSlice"
import productReducer from "./slices/OneproductSlice"
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'

const reducer = combineReducers({
   productsState: productsReducer,
   productState:productReducer,
   authState:authReducer,
   cartState:cartReducer
});

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default store;
