document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Login successful!');
            window.location.href = 'C:\Users\pp\Documents\GoDot\InTheAir\input-display.html'; // Redirect to the new page
        }
        
        else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error('Error during signup:', err);
        alert('An unexpected error occurred.');
    }
});
