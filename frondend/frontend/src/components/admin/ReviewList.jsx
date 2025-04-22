import { Fragment, useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { deleteUser, getUsers } from "../../actions/userActions"
import { clearReviewDeleted } from "../../slices/OneproductSlice"
import { clearError} from "../../slices/productSlice"
import Loader from '../layouts/Loader';
import { MDBDataTable} from 'mdbreact';
import {toast } from 'react-toastify'
import Sidebar from "./Sidebar"
import { deleteReview, getReviews } from "../../actions/ProductActions"

export default function ReviewList() {
    const { reviews = [], loading = true, error, isReviewDeleted }  = useSelector(state => state.productState);
    const [productId, setProductId] = useState("");

    const dispatch = useDispatch();

    const setReviews = () => {
        const data = {
            columns : [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ],
            rows : []
        }

        reviews.forEach( review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                user: review.user?.name || 'Unknown', 
                comment: review.comment ,
                actions: (
                    <Fragment>
                        <Button onClick={e => deleteHandler(e, review._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })

        return data;
    }

    const deleteHandler = (e, id) => {
        if (!productId) {
            toast.warn("Please enter a Product ID before deleting a review.");
            return;
        }
        e.target.disabled = true;
        dispatch(deleteReview(productId, id));
    }
    
    
    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(getReviews(productId));

    }

    useEffect(() => {
        if(error) {
            toast(error, {
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        if(isReviewDeleted) {
            toast('User Deleted Succesfully!',{
                type: 'success',
                onOpen: () => dispatch(clearReviewDeleted())
            })
            return;
        }
    },[dispatch, error, isReviewDeleted])


    return (
        <div className="row">
        <div className="col-12 col-md-2">
                <Sidebar/>
        </div>
        <div className="col-12 col-md-10">
            <h1 className="my-4">Review Lists</h1>
            <div className="row justify-content_center">
                <div className="col-5">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Product ID</label>
                            <input 
                                type="text"
                                onChange={e =>{setProductId(e.target.value)}}
                                value={productId}
                                className="form-control"></input>
                        </div>
                            <button type="submit" disabled={loading} className="btn btn-primary btn-block py-2">Search</button>
                    </form>
                </div>
            </div>
            <Fragment>
                {loading ? <Loader/> : 
                    <MDBDataTable
                        data={setReviews()}
                        bordered
                        striped
                        hover
                        className="px-3"
                    />
                }
            </Fragment>
        </div>
    </div>
    )
}