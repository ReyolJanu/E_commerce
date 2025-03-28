const ErrorHandler = require("../utils/errorHandler");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthendicateUser = async (req, res, next) =>{
   const{token} =  req.cookies;

   if(!token){
    return next(new ErrorHandler('Login first to handle this resourse', 400));
   }

   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   req.user = await User.findById(decoded.id);
   next();
}


// Logout -- {{base_url}}/api/v1/logout
exports.authorizeRoles = (...roles) => {
   return (req, res, next) => {
      if(!roles.includes(req.user.role)){
         return next(new ErrorHandler(`Role ${req.user.role} is not Allowed!`, 401));
      }
      next();

   }
}