const form = document.querySelector('form');
const messageAtTop = document.querySelector('.success-message');


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageAtTop.textContent = '';

    const email = form.email.value;

    try {
        const res = await fetch("/passwordchange", {
            method: 'POST',
            body: JSON.stringify({email}),
            headers: {'Content-Type': 'application/json'}
        });

        const data = await res.json();
        if (data.status === 'Failed') {
            messageAtTop.textContent = data.message;
            messageAtTop.style.color = 'red';
            messageAtTop.style.fontWeight = 'bold';
        } else if (data.status === 'Success') {
            messageAtTop.textContent = data.message;
            messageAtTop.style.color = 'green';
            messageAtTop.style.fontWeight = '500';
        };
    } catch (error) {
        successMessage.textContent = 'ERROR 504: Please Reload The Page';
    }
});