import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { createReview, getProduct } from '../../actions/ProductActions';
import Loader from '../layouts/Loader';
import addCartItem from '..//..//actions/cartActions'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify';
import { clearReviewSubmitted, clearError, clearProduct } from '../../slices/productSlice'
import ProductReview from './ProductReview';
import { Carousel } from 'react-bootstrap';

export default function ProductDetail() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const { loading, product = {}, isReviewSubmitted, error } = useSelector((state) => state.productState);
    const { user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const { id } = useParams()
    const [quantity, serQuantity] = useState(1);

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if (product.stock == 0 || count.valueAsNumber >= product.stock) {
            return;
        }
        const qty = count.valueAsNumber + 1;
        serQuantity(qty);
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber == 1) {
            return;
        }
        const qty = count.valueAsNumber - 1;
        serQuantity(qty);
    }
    useEffect(() => {
        dispatch(getProduct(id));

        return () => {
            dispatch(clearProduct());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (isReviewSubmitted) {
            handleClose();
            toast('Review Submitted Successfully', {
                type: 'success',
                onOpen: () => dispatch(clearReviewSubmitted())
            });
        }

        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => dispatch(clearError())
            });
        }
    }, [isReviewSubmitted, error, dispatch]);


    const reviewHandler = () => {
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('productId', id);
        dispatch(createReview(formData))
    }


    return (
        <Fragment>

            {loading ? <Loader /> :
                <Fragment>
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image" key={product._id}>
                            <Carousel pause="hover">
                                {product.images && product.images.length > 0 && product.images.map(image =>
                                    <Carousel.Item key={image._id}>
                                        <img className="d-block w-100" src={image.image} alt={product.name} height="500" width="500" />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                        </div>


                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <p id="product_id">{product._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${product.rating / 5 * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">{product.numOfReviews} Reviews</span>

                            <hr />

                            <p id="product_price">${product.price}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                            </div>
                            <button
                                onClick={() =>{
                                     dispatch(addCartItem(product._id, quantity));
                                     toast('Card Items AddedSuccessfully', {
                                        type: 'success'
                                    });
                                    }}
                                disabled={product.stock == 0 ? true : false}
                                type="button" id="cart_btn"
                                className="btn btn-primary d-inline ml-4">Add to Cart</button>

                            <hr />

                            <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>{product.stock > 0 ? 'In Stock' : 'Out Of Stock'}</span></p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{product.description}</p>
                            <hr />
                            <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

                            {user ?
                                <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                    Submit Your Review
                                </button> :
                                <div className='alert alert-danger mt-5'>Login to Post Review</div>
                            }

                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Submit Review</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>

                                            <ul className="stars" >
                                                {
                                                    [1, 2, 3, 4, 5].map((star => (
                                                        <li
                                                            key={star}
                                                            value={star}
                                                            onClick={() => setRating(star)}
                                                            className={`star ${star <= rating ? 'orange' : ''}`}
                                                            onMouseOver={(e) => e.target.classList.add('yellow')}
                                                            onMouseOut={(e) => e.target.classList.remove('yellow')}
                                                        ><i className="fa fa-star"></i></li>
                                                    )))
                                                }

                                            </ul>

                                            <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3">

                                            </textarea>
                                            <button disabled={loading} onClick={reviewHandler} aria-label="Close" className='btn my-3 float-right review-btn px-4 text-white'>Submit</button>
                                        </Modal.Body>
                                    </Modal>

                                </div>

                            </div>
                        </div>
                    </div>
                    {product.reviews && product.reviews.length > 0 ?
                        <ProductReview reviews={product.reviews} /> : null}
                </Fragment>}
        </Fragment>
    )
};

