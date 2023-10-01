const express = require('express');
const userController = require('../Controllers/authController');

const router = express.Router();

router.get('/', (req, res) => {
    const user = req.session.user || null;
    res.render('head', { user });
});

router.route('/').get(userController.home);
router.route('/signup').get(userController.signupPage);
router.route('/login').get(userController.loginPage);
router.route('/dashboard').get(userController.protect, userController.dashboardPage);
router.route('/signUpUser').post(userController.signup);
router.route('/loginUser').post(userController.login);


module.exports = router;