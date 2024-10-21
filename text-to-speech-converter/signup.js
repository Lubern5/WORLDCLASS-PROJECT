const apiUrl = 'https://xz6u7sbqqd.execute-api.us-east-2.amazonaws.com/dev/TTS'; // Your API URL

document.getElementById('signupButton').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loadingMessage = document.getElementById('loadingMessage');
    const signupButton = document.getElementById('signupButton');
    const errorMessage = document.getElementById('authErrorMessage');
    const successMessage = document.getElementById('authSuccessMessage');

    // Simple client-side validation
    if (!username || !password || password.length < 6) {
        errorMessage.textContent = 'Please provide a valid username and a password with at least 6 characters.';
        successMessage.textContent = '';
        return;
    }

    try {
        loadingMessage.style.display = 'block'; // Show loading message
        signupButton.disabled = true; // Disable the button
        errorMessage.textContent = ''; // Clear previous error message
        successMessage.textContent = ''; // Clear previous success message

        const response = await fetch(`${apiUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        loadingMessage.style.display = 'none'; // Hide loading message
        signupButton.disabled = false; // Re-enable the button

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }

        successMessage.textContent = 'Account created successfully! Redirecting to login...';
        errorMessage.textContent = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        // Redirect to index.html after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        loadingMessage.style.display = 'none'; // Hide loading message
        signupButton.disabled = false; // Re-enable the button
        errorMessage.textContent = error.message; // Show the error message
        successMessage.textContent = '';
    }
});
