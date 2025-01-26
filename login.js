document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Login successful!');
            window.location.href = 'C:\Users\pp\Documents\GoDot\InTheAir\input-display.html'; // Redirect to the new page
        }
        
        else {
            alert('Invalid email or password.');
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert('An unexpected error occurred.');
    }
});
