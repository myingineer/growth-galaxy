const jwt = require('jsonwebtoken');
const util = require('util');
const User = require('../Models/userModel');

exports.checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.locals.user = null;
        return res.status(404).redirect("/login");
    };

    try {
        const tokenToValidate = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY);
        const user = await User.find({_id: tokenToValidate._id, email: tokenToValidate.email}).select('+role');

        if (!user) {
            res.locals.user = null;
            res.clearCookie('jwt');
            return res.status(404).redirect("/login");
        };

        res.locals.user = user;
        console.log(user);
        next();
    } catch (error) {
        res.locals.user = null;
        res.clearCookie('jwt');
        res.status(404).redirect("/login");
        next();
    };
};