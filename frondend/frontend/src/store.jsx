import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { combineReducers } from "redux";
import productsReducer from "./slices/productSlice"
import productReducer from "./slices/OneproductSlice"


const reducer = combineReducers({
   productsState: productsReducer,
   productState:productReducer
});

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default store;
