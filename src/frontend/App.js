// Import necessary modules and components
import { KardsView } from './AppElements/KardsView.js';
import { Events } from './Events.js';
import { Navbar } from './AppElements/NavBar.js';
import { Landing } from './AppElements/LandingView.js'
import { Help } from './AppElements/HelpView.js'
import { SignIn } from './AppElements/SigninView.js';

// Define App class for rendering application views and managing navigation
export class App {
  #kardsViewElm = null; // Private property to store KardsView element
  #mainViewElm = null; // Private property to store main view element
  #events = null; // Private property to store Events instance
  #homeView = null; // Private property to store Landing view element
  #helpView = null; // Private property to store Help view element
  #signinView = null; // Private property to store SignIn view element

  constructor() {
    this.#events = Events.events(); // Initialize Events instance
  }

  // Asynchronously render method initializes and renders the application
  async render(root) {
    const rootElm = document.getElementById(root); // Get root element by id
    rootElm.innerHTML = ''; // Clear content of root element

    // Create navigation bar element and add it to root element
    const navbarElm = document.createElement('div');
    navbarElm.id = 'navbar';
    const navbar = new Navbar(); // Create new instance of Navbar
    navbarElm.appendChild(await navbar.render()); // Render navbar and append to navbar element

    // Create main view element
    this.#mainViewElm = document.createElement('div');
    this.#mainViewElm.id = 'main-view';

    // Append navbar and main view elements to root element
    rootElm.appendChild(navbarElm);
    rootElm.appendChild(this.#mainViewElm);

    // Initialize and render different views
    const kardsView = new KardsView();
    this.#kardsViewElm = await kardsView.render();

    const homeView = new Landing();
    this.#homeView = await homeView.render();

    const helpView = new Help();
    this.#helpView = await helpView.render();

    const signinView = new SignIn();
    this.#signinView = await signinView.render();

    // Navigate to 'home' view initially
    this.#navigateTo('home');

    // Subscribe to 'navigateTo' event to handle navigation
    this.#events.subscribe('navigateTo', view => this.#navigateTo(view));
  }

  // Private method to navigate to different views
  #navigateTo(view) {
    this.#mainViewElm.innerHTML = ''; // Clear main view element

    // Append corresponding view to main view element based on view parameter
    if (view === 'home') {
      this.#mainViewElm.appendChild(this.#homeView);
      window.location.hash = view; // Set window hash to navigate using URL fragment identifier
    } else if (view === 'kards') {
      this.#mainViewElm.appendChild(this.#kardsViewElm);
      window.location.hash = view;
    } else if (view === 'help') {
      this.#mainViewElm.appendChild(this.#helpView);
      window.location.hash = view;
    } else if (view === 'signin') {
      this.#mainViewElm.appendChild(this.#signinView);
      window.location.hash = view;
    } else {
      this.#mainViewElm.appendChild(this.#homeView); // Default to home view if view parameter is invalid
      window.location.hash = 'home'; // Set window hash to 'home' if view parameter is invalid
    }
  }
}
