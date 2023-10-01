const User = require('../Models/userModel');
const handleSignUpError = require('../Utils/signUpErrorHandler');
const jwt = require('jsonwebtoken');
const util = require('util');

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


exports.dashboardPage = (req, res) => {
    res.status(200).render('dashboard');
};