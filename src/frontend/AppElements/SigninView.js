// Define SignIn class for rendering sign-in form
export class SignIn {

  constructor () {}

  // Asynchronously render method creates and returns the sign-in form element
  async render() {
    // Create a div element for sign-in form
    const signinElm = document.createElement('div');
    signinElm.id = 'signin'; // Set id attribute of sign-in form

    // Set inner HTML content for sign-in form using template literals
    signinElm.innerHTML = `
      <h2>Sign In</h2>
      <form id="signin-form">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <a href="#signup">Sign Up</a></p>
    `;

    // Return the constructed sign-in form element
    return signinElm;
  }
}
