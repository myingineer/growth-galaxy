const handleSignUpError = (error) => {
    let errors = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    if (error.code === 11000) {
        if (Object.keys(error.keyPattern)[0] === 'username') {
            errors.username = `A User with ${error.keyValue.username} already exists`;
        } else {
            errors.email = `A User with Email ${error.keyValue.email} already exists`;
        };
    };

    if (error.message.includes("User validation failed")) {
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        });
    };

    if (error.message === 'Please Enter a Valid Email Address') {
        errors.email = `Email Provided is not Valid. Please Provide a Valid Email`
    };

    if (error.message === 'Please Enter an Email') {
        errors.email = `Email Field cannot be empty`
    };

    if (error.message === 'Email already exists') {
        errors.email = `Email Already Exists. Please Provide another Email or Login`
    };

    if (error.message === 'Username cannot be less than 4 characters') {
        errors.username = `Username must be more than 4`
    };

    if (error.message === 'Please Enter a Username') {
        errors.username = `Username Field cannot be empty`
    };

    if (error.message === 'Username Already Exists') {
        errors.username = `Username Already Exists. Please Provide another Username or Login`
    };

    if (error.message === 'Please Enter A Password') {
        errors.password = `Password cannot be empty`
    };

    if (error.message === 'Password cannot be less than 8 characters') {
        errors.password = `Password should be more than 8`
    };

    if (error.message === 'Please Confirm Your Password') {
        errors.confirmPassword = `Please Confirm Your Password`
    };

    if (error.message === 'Password and Confirm Password Mis-Match') {
        errors.confirmPassword = `Passwords do not Match. Confrim Your Password and Try-Again`
    };


    return errors;
};

module.exports = handleSignUpError;