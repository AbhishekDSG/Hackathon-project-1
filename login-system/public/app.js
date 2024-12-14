console.log("App Initialized");

const app = document.getElementById("app");

// Function to show the login page
function showLoginPage() {
  console.log("Rendering Login Page");
  app.innerHTML = `
    <h1>Login</h1>
    <form id="login-form">
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <a href="#" onclick="showRegisterPage()">Create an account</a>
    <a href="#" onclick="showForgotPasswordPage()">Forgot password?</a>
  `;
}

// Function to show the register page
function showRegisterPage() {
  console.log("Rendering Register Page");
  app.innerHTML = `
    <h1>Register</h1>
    <form id="register-form">
      <input type="text" id="name" placeholder="Name" required />
      <input type="email" id="register-email" placeholder="Email" required />
      <input type="password" id="register-password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <a href="#" onclick="showLoginPage()">Back to Login</a>
  `;
}

// Function to show the forgot password page
function showForgotPasswordPage() {
  console.log("Rendering Forgot Password Page");
  app.innerHTML = `
    <h1>Forgot Password</h1>
    <form id="forgot-password-form">
      <input type="email" id="forgot-email" placeholder="Email" required />
      <button type="submit">Send Reset Link</button>
    </form>
    <a href="#" onclick="showLoginPage()">Back to Login</a>
  `;
}

// Initially display the login page
showLoginPage();
