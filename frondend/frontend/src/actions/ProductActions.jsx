import axios from 'axios';
import { adminProductsFail, adminProductsRequest, adminProductsSuccess, createReviewFail, createReviewRequest, createReviewSuccess, productsFail, productsRequest, productsSuccess } from '../slices/productSlice';
import { productFail, productRequest, productSuccess } from '../slices/OneproductSlice';

export const getProducts = (keyword,price,category,rating,currentPage) => async (dispatch) => {
   try {
     dispatch(productsRequest());
     let link =`/api/v1/products?page=${currentPage}`;

     if(keyword){
      link += `&keyword=${keyword}`
     }

     if (price) {
      link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
    }

    if (category) {
      link += `&category=${category}`;
    }

    if (rating) {
      link += `&rating=${rating}`;
    }
    

     const { data } = await axios.get(link);
     
     dispatch(productsSuccess(data));
   } catch (error) {
     dispatch(productsFail(error.response?.data.message || error.message));
   }
 };
 

export const getProduct = id => async(dispatch)=>{
   try {
    dispatch(productRequest())
    const {data} = await axios.get(`/api/v1/product/${id}`);
    dispatch(productSuccess(data))
   } catch (error) {
    dispatch(productFail(error.response.data.message))
   }
}

export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true, //  Add this if you're using cookies/auth
    };

    const { data } = await axios.put(`/api/v1/review`, reviewData, config);
    dispatch(createReviewSuccess(data));
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error.message || 'Something went wrong';
    dispatch(createReviewFail(errorMessage));
  }
};



export const getAdminProducts  = async (dispatch) => {
  try {
    dispatch(adminProductsRequest());
    const {data} = await axios.get('/api/v1/admin/products');
    dispatch(adminProductsSuccess(data));
  } catch (error) {
    dispatch(adminProductsFail(error.response?.data.message || error.message));
  }
};