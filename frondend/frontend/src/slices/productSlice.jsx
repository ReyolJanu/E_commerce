import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false
    },
    reducers: {
        productsRequest(state, action) {
            return {
                loading: true
            }
        },
        productsSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products,
                productsCount: action.payload.count,
                resPerPage: action.payload.resPerPage
            }
        },
        productsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        adminProductsRequest(state, action) {
            return {
                loading: true
            }
        },
        adminProductsSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products
            }
        },
        adminProductsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        createReviewRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        createReviewSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isReviewSubmitted: true
            }
        },
        createReviewFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearReviewSubmitted(state) {
            state.isReviewSubmitted = false;
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },
        clearProduct(state, action) {
            return {
                ...state,
                product: {},
                loading: false,
                error: null
            }
        }

    }
});

const { actions, reducer } = productsSlice;
export const { productsFail,
    productsSuccess,
    productsRequest,
    createReviewFail,
    createReviewRequest,
    createReviewSuccess,
    clearError,
    clearReviewSubmitted,
    clearProduct,
    adminProductsFail,
    adminProductsRequest,
    adminProductsSuccess } = actions;
export default reducer;