const form = document.querySelector('form');
const signalMessage = document.querySelector('.message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    signalMessage.textContent = '';
    const token = window.location.pathname.split('/').pop()
    const url = `/resetPassword/${token}`;

    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    try {
        const res = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({password, confirmPassword}),
            headers: {'Content-Type': 'application/json'}
        });

        const data = await res.json();
        console.log(data);
        if (data.status === 'Success') {
            signalMessage.textContent = data.message;
            signalMessage.style.color = 'green';
            setTimeout(() => {
                window.location.href = "/login";
            }, 1250);
        } 
        else if (data.status === 'Failed') {
            signalMessage.style.color = 'red';
            signalMessage.textContent = data.message;
            setTimeout(() => {
                window.location.href = "/forgotPassword";
            }, 2000);
        } else if (data.status === 'Failed' && data.error.name === 'ValidationError') {
            signalMessage.textContent = 'Password Mis-Match',
            signalMessage.style.color = 'red';
            signalMessage.style.fontSize = '15px';
        }
    } catch (error) {
        signalMessage.textContent = 'An Error Occured. Please Try Again',
        signalMessage.style.color = 'red';
    };
});