const express = require('express');
const { newOrder, getSingleOrder, getAllOrders, myorders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthendicateUser, authorizeRoles } = require('../middleware/authendicate');
const router = express.Router();

router.route('/order/new').post(isAuthendicateUser, newOrder);
router.route('/order/:id').get(isAuthendicateUser, getSingleOrder);
router.route('/myorders').get(isAuthendicateUser, myorders);

// Admin Routes
router.route('/admin/orders').get(isAuthendicateUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/orders/:id').put(isAuthendicateUser, authorizeRoles('admin'), updateOrder);
router.route('/admin/orders/:id').delete(isAuthendicateUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;