const User = require('../Models/userModel');
const handleSignUpError = require('../Utils/signUpErrorHandler');
const jwt = require('jsonwebtoken');
const util = require('util');
const sendPasswordResetEmail = require('../Utils/sendMail');

const createToken = (id, email) => {
    return jwt.sign({id, email}, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRES_IN
    });
};

exports.home = async (req, res) => {
    res.status(200).render('login');
};

exports.signupPage = (req, res) => {
    res.status(200).render('signup');
};

exports.signup = async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({
            newUser: true
        });
    } catch (error) {
        const errors = handleSignUpError(error);
        res.status(400).json({errors});
    };
};

exports.loginPage = (req, res) => {
    res.status(200).render('login');
};

exports.login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
    


        if (!username || !password) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Please Input your login details'
            });
        };
    
        const user = await User.findOne({username});

        if (!user || !(await user.comparePasswords(password, user.password))) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Username/Password Mis-Match'
            });
        };

        const token = createToken(user._id, user.email);

        res.cookie('jwt', token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
        });

        res.status(200).json({
            status: 'Success',
            username: user.username.toLocaleUpperCase()
        });

    } catch (error) {
        res.status(400).json({
            message: "An Error Occured. Try Again Later"
        });
    };
};

exports.protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(404).redirect("/login");
        };
    
        const tokenToValidate = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY);
        
    
        const user = await User.find({id: tokenToValidate._id, email: tokenToValidate.email}).select('+role');
    
        if (!user) {
            return res.status(404).redirect("/login");
        };
    } catch (error) {
        res.clearCookie('jwt');
        return res.status(401).redirect('/login');
    };
    next();
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.locals.user = null;
    return res.status(200).redirect('/login');
};

exports.forgotPasswordPage = (req, res) => {
    res.status(200).render('forgotpassword');
};

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found. Please Sign Up'
            });
        };

        const passwordResetToken = await user.createResetPasswordToken();
        await user.save({validateBeforeSave: false});

        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${passwordResetToken}`;
        const message = `
            We received a request to reset your password.\n\n
            Please use the link to reset your password: \n\n
            ${resetUrl}\n\n
            This link would be valid for 10 minutes.\n\n
            If you did not request to reset you password, kindly ignore this Mail and Contact Support\n\n
        `
        
        try {
            await sendPasswordResetEmail({
                email: user.email,
                subject: 'Password Reset Link',
                message
            });
    
            res.status(200).json({
                status: 'Success',
                message: `Password Reset Link Sent To ${user.email}. Please check your mail. If you didn't see the mail, check your SPAM folder`
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpire = undefined;
            user.save({validateBeforeSave: false});
            res.status(500).json({
                status: 'Failed',
                message: 'An Error Occured'
            });
        };

    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: 'An Error Occured'
        });
    };
};


exports.dashboardPage = (req, res) => {
    res.status(200).render('dashboard');
};

exports.resetPasswordPage = (req, res) => {
    res.status(200).render('resetpassword');
};