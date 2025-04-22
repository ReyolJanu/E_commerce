const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReviews, getAdminProducts } = require('../controllers/productController');
const {isAuthendicateUser, authorizeRoles} = require('../middleware/authendicate');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const upload = multer({storage: multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join(__dirname,'..', 'uploads/product'))
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})})

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/review').put(isAuthendicateUser, createReview);


//  Admin 
router.route('/admin/product/new').post(isAuthendicateUser, authorizeRoles('admin'),upload.array('images'), newProduct);
router.route('/admin/products').get(isAuthendicateUser, authorizeRoles('admin'), getAdminProducts);
router.route('/admin/product/:id').delete(isAuthendicateUser, authorizeRoles('admin'), deleteProduct);
router.route('/admin/product/:id').put(isAuthendicateUser, authorizeRoles('admin'), upload.array('images'), updateProduct);
router.route('/admin/reviews').get(isAuthendicateUser, authorizeRoles('admin'), getReviews);
router.route('/admin/review').delete(isAuthendicateUser,authorizeRoles('admin'), deleteReviews);
module.exports = router;
