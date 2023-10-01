const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: [4, 'Username cannot be less than 4 characters'],
        required: [true, 'Please Enter a Username'],
        unique: [true, 'Username Already Exists'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Please Enter an Email'],
        unique: [true, 'Email already exists'],
        trim: true,
        validate: {
          validator: validator.isEmail,
          message: 'Please Enter a Valid Email Address'
        }
    },
    password: {
        type: String,
        required: [true, 'Please Enter A Password'],
        minlength: [8, 'Password cannot be less than 8 characters']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please Confirm Your Password'],
        validate: {
            validator: function(val) {
                return val === this.password 
            },
            message: "Password and Confirm Password Mis-Match"
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'post-creator'],
        default: 'user',
        select: false
    }
});


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    };

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.comparePasswords = async function(password, dbpassword) {
    return await bcrypt.compare(password, dbpassword);
};


const User = new mongoose.model('User', userSchema);
module.exports = User;