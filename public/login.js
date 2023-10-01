const form = document.querySelector('form');
const successMessage = document.querySelector('.success-signup');
const noAccount = document.querySelector('.no-account');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successMessage.textContent = '';

    const username = form.username.value;
    const password = form.password.value;

    try {
        const res = await fetch("/loginUser", {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        });

        const data = await res.json();
        if (data.message) {
            if (data.message === 'Username/Password Mis-Match') {
                noAccount.style.display = 'flex';
            };
            successMessage.textContent = data.message;
            successMessage.style.color = 'red';
        };
        if (data.status === 'Success') {
            successMessage.textContent = `WELCOME ${data.username}`;
            successMessage.style.color = 'green';
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        };

    } catch (error) {
        successMessage.textContent = 'ERROR 504: Please Reload The Page'
    };
});