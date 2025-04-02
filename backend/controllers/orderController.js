const Order = require('../models/orderModel');
const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');


//  Create New Order  -- {{base_url}}/api/v1/order/new
exports.newOrder = async (req, res, next) => {
    const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    });

    res.status(200).json({
        success: true,
        order
    })
}


// Get Single Order -- {{base_url}}/api/v1/order/:id
exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email'); // populate endathu almost foreign key mathiri
    if (!order) {
        return next(new ErrorHandler('Order Not Found!', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
}

// Get-LogedinUser-Orders  -- {{base_url}}/api/v1/myorders
exports.myorders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
    res.status(200).json({
        success: true,
        orders
    })
}

//Admin: Get-All-Orders -- {{base_url}}/api/v1/orders
exports.getAllOrders = async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount = totalAmount + order.totalPrice;
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}

// Admin: Update-Order -- 
exports.updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus == 'Delivered') {
        return next(new ErrorHandler('this Order has been already delivered!', 400));
    }
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity);
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({
        success: true
    })
}
async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({ validateBeforeSave: false })
}

// Admin: Delete-Order -- 
exports.deleteOrder = async (req, res, next) => {
    const deleteOrder = await Order.findById(req.params.id);
    if (!deleteOrder) {
        return next(new ErrorHandler('Order not Found!', 404));
    }
    await deleteOrder.deleteOne();
    res.status(200).json({
        success: true
    })
}