const User = require('../models/userModel');
const sendToken = require('../utils/jwt');
const sentEmail = require('../utils/email');
const crypto = require('crypto');
const ErrorHandler = require('../utils/errorHandler');


// Register  -  {{base_url}}/api/v1/register
exports.registerUser = async (req, res, next) => {
    const { name, email, password} = req.body;
    let avatar;
    if(req.file){
        avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`; 
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            avatar
        });
        sendToken(user, 201, res);  // Send token on successful creation
    } catch (error) {
        // If there's a validation error, return it in the response
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Login  --  {{base_url}}/api/v1/login
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler('Please enter Email and Password', 400));
    }

    // Retrieve user from the database with the given email
    const user = await User.findOne({ email }).select('+password'); // `select('+password')` is used to explicitly select the password field which is not returned by default

    // If no user is found, return an error
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 400));
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordMatched = await user.isValidPassword(password); // Use `await` here

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 400));
    }

    // Send the token if login is successful
    sendToken(user, 201, res);
};


//  Logout -- {{base_url}}/api/v1/logout
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: 'Logedout!'
    })
}


//  Forgotpassword-Email -- {{base_url}}/api/v1/password/forgot
exports.forgotPassword = async (req, res, next) => {
   const user = await User.findOne({email: req.body.email});
   if(!user){
    return next(new ErrorHandler('User not found with this email!', 404))
   }
   const resetToken = user.getResetToken();
   user.save({validateBeforeSave: false});
   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
   const message = `Your password Reset url is as follows \n\n
                    ${resetUrl}`;

   try{
    sentEmail({
        email : user.email,
        subject : "JVLCart Password Recovery",
        message
    })

    res.status(200).json({
        success : true,
        message : `Email sent to this ${user.email}`
    })

   }catch(error){
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    user.save({validateBeforeSave: false});
    return next(new ErrorHandler(error.message), 500)
   }
}


//  Reset-Password -- {{base_url}}/api/v1/password/reset/:token
exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken =  crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire:{
            $gt : Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or expired!'));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match!'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave: false});
    sendToken(user, 201, res);
}


// Get-User-Profile  -- {{base_url}}/api/v1/myprofile
exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success : true,
        user
    })
}

// Change-Password
exports.changePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    // checking the Old password
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler('Old Password is incorrect',401));
    }
    // assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success : true
    })
}


//  Update-Profile  --  {{base_url}}/api/v1/update
exports.updatePassword = async (req, res, next) => {
    let newUserData = {
        name : req.body.name,
        email : req.body.email
    }

    let avatar;
    if(req.file){
        avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`; 
        newUserData ={...newUserData, avatar}
    }


    const user =  await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators : true
    })

    res.status(200).json({
        success : true,
        user
    })
}


//  Admin :  Get all users
exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success : true,
        users
    })
}

//  Admin :  Get Specific user details  
 exports.getUser =  async ( req, res, next) => {
    const user = await User.findById(req.params.id);  // here req.params.id using for getting value from the url like  /users/:id
    if(!user){
        return next(new ErrorHandler(`User not Found! this id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success : true,
        user
    })
 }


 //  Admin Update user
 exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }
    const user =  await User.findByIdAndUpdate(req.params.id, newUserData, {
        new : true,
        runValidators : true
    })

    res.status(200).json({
        success : true,
        user
    })
 } 

//  Admin Delete User 
 exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);  // here req.params.id using for getting value from the url like  /users/:id
    if(!user){
        return next(new ErrorHandler(`User not Found! this id ${req.params.id}`, 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success : true
    })

 }