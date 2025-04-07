const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

// get Product -  {{base_url}}/api/v1/products
exports.getProducts = async (req, res, next) => {
    const resPerPage =3;
    const apiFeactures =  new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    const products = await apiFeactures.query;
    const totalProductsCount = await Product.countDocuments({}); // counting totao records in DB
    // await new Promise(resolve => setTimeout(resolve, 1000)) // 1 seconds loading time
    res.status(200).json({
        success: true,
        count : totalProductsCount,
        resPerPage,
        products
     });
};


// Create Product - {{base_url}}/api/v1/admin/products/new
exports.newProduct = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));         // Pass the error to the error handling middleware
    }
};



// Get Single Product - {{base_url}}/api/v1/product/id
exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product Not Found!', 404));  // Return a 404 error if the product is not found
    }
    // If product is found, return it
    res.status(201).json({
        success: true,
        product
    });
};



//Update Product  - {{base_url}}/api/v1/product/id
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
          success: false,
          message: "Product not found!"
      });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,  // update pannuna piraku palaya product aa return pannama update aakuna puthu product aa return pannanum endathuku use pannuram
    runValidators: true   //puthusa kudukira user inputs ellame required field aa validate pannutha endu check pannura code
  })
  res.status(200).json({
    success : true,
    product
  })
}


// Delete Product - {{base_url}}/api/v1/product/id
exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!"
      });
    }
  
    await Product.deleteOne({ _id: req.params.id });
  
    res.status(200).json({
      success: true,
      message: "Product deleted successfully!"
    });
  };
  

  // Create Review -- {{base_url}}/api/v1/review
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = {
      user: req.user.id,
      rating: rating,
      comment: comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const isReviewed = product.reviews.find((review) => {
      return review.user.toString() === req.user.id.toString();
    });

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate the average rating
    product.ratings =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Review added/updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get Reviews --  {{base_url}}/api/v1/reviews?{productId}
exports.getReviews = async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  res.status(200).json({
    success : true,
    reviews : product.reviews
  })
}

// Get Reviews --  {{base_url}}/api/v1/review?id=67ed50073648bed3b2deabdd&productId=67e767df82b93338ca5e9e74
exports.deleteReviews = async (req, res, next) => {
  try {
    const { productId, id } = req.query;  // Extract productId and review id from query

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Filter out the review that matches the id provided in the query
    const reviews = product.reviews.filter(review => review._id.toString() !== id.toString());

    // Recalculate number of reviews
    const numberOfReviews = reviews.length;

    // Calculate the new average rating if reviews are left, otherwise set it to 0
    let ratings = 0;
    if (numberOfReviews > 0) {
      ratings = reviews.reduce((acc, review) => acc + review.rating, 0) / numberOfReviews;
    }

    // Update the product document
    await Product.findByIdAndUpdate(productId, {
      reviews,
      numOfReviews: numberOfReviews,  // Update numberOfReviews field correctly
      rating: ratings  // Update the rating field
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
