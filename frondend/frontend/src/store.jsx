import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";

const reduser = combineReducers({

})


const store = configureStore({
    reducer,
    middleware:[thunk]
})
export default store;