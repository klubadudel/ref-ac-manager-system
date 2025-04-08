document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    // Simulate a successful login
    if (username === 'admin' && password === 'password123') {
        // If login is successful, redirect to the store manager dashboard
        window.location.href = '../dashb_branch_manager/dashb_branch.html';
    } else {
        // If login fails, display an error message
        message.textContent = 'Invalid username or password';
        message.className = 'message error';
    }
}); 