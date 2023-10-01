const form = document.querySelector('form');
const usernameError = document.querySelector('.username.error');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');
const confirmPasswordError = document.querySelector('.confirmPassword.error');
const successMessage = document.querySelector('.success-signup');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    successMessage.textContent = '';

    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    try {
        const res = await fetch("/signUpUser", {
            method: 'POST',
            body: JSON.stringify({username, email, password, confirmPassword}),
            headers: {'Content-Type': 'application/json'}
        });

        const data = await res.json();
        if (data.errors) {
            usernameError.textContent = data.errors.username;
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
            confirmPasswordError.textContent = data.errors.confirmPassword;
        } else {
            successMessage.textContent = 'Sign Up Successful';
            setTimeout(() => {
                window.location.href = "/login";  
            }, 1500);
        };

    } catch (error) {
        console.log(error);
    };
});