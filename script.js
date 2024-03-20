// script.js

// Function to show the success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
    }
}

// Function to hide the success message
function hideSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

// Function to handle registration form submission
function registerFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create FormData object from form

    fetch('/register', {
        method: 'POST',
        body: formData // Set form data as the request body
    })
    .then(response => {
        if (response.ok) {
            showSuccessMessage(); // Show success message on successful registration
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to handle login form submission
function loginFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Create FormData object from form

    fetch('/login', {
        method: 'POST',
        body: formData // Set form data as the request body
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/home'; // Redirect to home page on successful login
        } else {
            console.error('Login failed');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Add event listeners to the registration and login forms
document.getElementById('registerForm').addEventListener('submit', registerFormSubmit);
document.getElementById('loginForm').addEventListener('submit', loginFormSubmit);
