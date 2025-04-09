const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer({storage: multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join(__dirname,'..', 'uploads/user'))
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})})


const { registerUser,
        loginUser,
        logoutUser,
        forgotPassword,
        resetPassword,
        getUserProfile, 
        changePassword,
        updatePassword,
        getAllUsers,
        getUser,
        updateUser,
        deleteUser} = require('../controllers/authController');
const { isAuthendicateUser, authorizeRoles } = require('../middleware/authendicate');

const router = express.Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthendicateUser, getUserProfile);
router.route('/password/change').put(isAuthendicateUser, changePassword);
router.route('/update').put(isAuthendicateUser, updatePassword);

// Admin Routes
router.route('/admin/users').get(isAuthendicateUser, authorizeRoles('admin'), getAllUsers );
router.route('/admin/users/:id').get(isAuthendicateUser, authorizeRoles('admin'), getUser );
router.route('/admin/users/:id').put(isAuthendicateUser, authorizeRoles('admin'), updateUser );
router.route('/admin/users/:id').delete(isAuthendicateUser, authorizeRoles('admin'), deleteUser );

module.exports = router;