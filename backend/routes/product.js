const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReviews } = require('../controllers/productController');
const {isAuthendicateUser, authorizeRoles} = require('../middleware/authendicate')
const router = express.Router();

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/product/:id').put(isAuthendicateUser, updateProduct);
router.route('/product/:id').delete(isAuthendicateUser, deleteProduct);
router.route('/review').put(isAuthendicateUser, createReview);
router.route('/reviews').get(isAuthendicateUser, getReviews);
router.route('/review').delete(isAuthendicateUser, deleteReviews);

//  Admin 
router.route('/admin/products/new').post(isAuthendicateUser, authorizeRoles('admin'), newProduct);

module.exports = router;
