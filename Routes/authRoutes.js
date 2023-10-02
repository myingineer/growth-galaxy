const express = require('express');
const userController = require('../Controllers/authController');
const checkUser = require('../Utils/checkUser');

const router = express.Router();

router.get('*', checkUser);

router.route('/').get(userController.home);
router.route('/signup').get(userController.signupPage);
router.route('/login').get(userController.loginPage);
router.route('/dashboard').get(userController.protect, userController.dashboardPage);
router.route('/signUpUser').post(userController.signup);
router.route('/loginUser').post(userController.login);
router.route('/logout').get(userController.logout);
router.route('/forgotPassword').get(userController.forgotPasswordPage);
router.route('/passwordchange').post(userController.forgotPassword);
router.route('/resetPassword/:token').get(userController.resetPasswordPage);
// router.route('/resetPassword/:token').patch(userController.resetPassword);



module.exports = router;