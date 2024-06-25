import { KardsView } from './AppElements/KardsView.js';
import { Events } from './Events.js';
import { Navbar } from './AppElements/NavBar.js';
import { Landing } from './AppElements/LandingView.js'
import { Help } from './AppElements/HelpView.js'
import { SignIn } from './AppElements/SigninView.js';

export class App {
  #kardsViewElm = null;
  #mainViewElm = null;
  #events = null;
  #homeView = null;
  #helpView = null;
  #signinView = null;

  constructor() {
    this.#events = Events.events();
  }

  async render(root) {
    const rootElm = document.getElementById(root);
    rootElm.innerHTML = '';

    const navbarElm = document.createElement('div');
    navbarElm.id = 'navbar';
    const navbar = new Navbar();
    navbarElm.appendChild(await navbar.render());

    this.#mainViewElm = document.createElement('div');
    this.#mainViewElm.id = 'main-view';

    rootElm.appendChild(navbarElm);
    rootElm.appendChild(this.#mainViewElm);

    const kardsView = new KardsView();
    this.#kardsViewElm = await kardsView.render();

    const homeView = new Landing();
    this.#homeView = await homeView.render();

    const helpView = new Help();
    this.#helpView = await helpView.render();

    const signinView = new SignIn();
    this.#signinView = await signinView.render();

    this.#navigateTo('home');

    this.#events.subscribe('navigateTo', view => this.#navigateTo(view));
  }

  #navigateTo(view) {
    this.#mainViewElm.innerHTML = '';
    if (view === 'home') {
      this.#mainViewElm.appendChild(this.#homeView);
      window.location.hash = view;
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
      this.#mainViewElm.appendChild(this.#homeView);
      window.location.hash = 'home';
    }
  }
}
