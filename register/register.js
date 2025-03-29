document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');
    
    // Basic validation
    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match';
        message.className = 'message error';
        return;
    }

    if (password.length < 6) {
        message.textContent = 'Password must be at least 6 characters long';
        message.className = 'message error';
        return;
    }

    // This is a simple example.
    message.textContent = 'Registration successful!';
    message.className = 'message success';
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = '../login/index.html';
    }, 2000);
}); 