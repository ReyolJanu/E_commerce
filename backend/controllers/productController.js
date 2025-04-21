const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

// get Product -  {{base_url}}/api/v1/products
exports.getProducts = async (req, res, next) => {
    const resPerPage =8;
    let buildQuery = () => {
      return new APIFeatures(Product.find(), req.query).search().filter();
    }
    const filteredProductsCount = await buildQuery().query.countDocuments({});
    const totalProductsCount = await Product.countDocuments({}); // counting totao records in DB
    let productsCount =totalProductsCount;

    if(filteredProductsCount !== totalProductsCount ){
      productsCount  = filteredProductsCount;
    }

    const products = await buildQuery().paginate(resPerPage).query;
    
    // await new Promise(resolve => setTimeout(resolve, 350)) // 1 seconds loading time
    res.status(200).json({
        success: true,
        count : productsCount,
        resPerPage,
        products
     });
};


// Create Product - {{base_url}}/api/v1/admin/products/new
exports.newProduct = async (req, res, next) => {
  let images = []
  if(req.files.length > 0){
    req.files.forEach(file => {
      let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
      images.push({image: url})
    })
  }
  req.body.images = images;
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
    const product = await Product.findById(req.params.id).populate('reviews.user','name email');

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

    // Ensure rating is a number
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = product.reviews.find(
      (rev) => rev.user && rev.user.toString() === req.user.id.toString()
    );
    

    if (existingReview) {
      // Update existing review
      existingReview.comment = comment;
      existingReview.rating = Number(rating);
    } else {
      // Add new review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    product.ratings = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: existingReview ? "Review updated successfully" : "Review added successfully",
    });
  } catch (error) {
    console.error("Review error:", error); // Helpful for debugging
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

//Get Admin products   --  {{base_url}}/api/v1/admin/products
exports.getAdminProducts = async(req, res, next) => {
  const products = await Product.find();
  res.status(200).send(
    {
      success:true,
      products
    }
  )
}
