// Import Events module to handle events
import { Events } from "../Events.js"

// Define Navbar class for rendering navigation bar with links
export class Navbar {
  #events = null; // Private property to store Events instance

  constructor () {
    this.#events = Events.events(); // Initialize Events instance
  }

  // Asynchronously render method creates and returns the navigation bar element
  async render() {
    // Create a div element for navigation bar
    const navbarElm = document.createElement('div');
    navbarElm.id = 'navbar'; // Set id attribute of navigation bar

    // Set inner HTML content for navigation bar using template literals
    navbarElm.innerHTML = `
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#kards">Kards</a></li>
        <li><a href="#help">Help</a></li>
        <li><a href="#signin">Sign-In</a></li>
      </ul>
    `;

    // Select all 'a' elements within navigation bar
    const linksArr = navbarElm.querySelectorAll('a');
    
    // Add event listener to each link for navigation handling
    linksArr.forEach(link => {
      link.addEventListener('click', async x => {
        x.preventDefault(); // Prevent default link behavior
        const view = x.target.getAttribute('href').replace('#', ''); // Get view name from href attribute
        window.location.hash = view; // Set window hash to navigate using URL fragment identifier
        await this.#events.publish('navigateTo', view); // Publish navigateTo event with view name
      });
    });

    // Return the constructed navigation bar element
    return navbarElm;
  }
}
