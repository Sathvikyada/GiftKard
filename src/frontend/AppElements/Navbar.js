import { Events } from "../Events.js"

export class Navbar {
  #events = null;

  constructor () {
    this.#events = Events.events();
  }

  async render() {
    const navbarElm = document.createElement('div');
    navbarElm.id = 'navbar';

    navbarElm.innerHTML = `
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#kards">Kards</a></li>
        <li><a href="#help">Help</a></li>
        <li><a href="#signin">Sign-In</a></li>
      </ul>
    `;

    const linksArr = navbarElm.querySelectorAll('a');
    linksArr.forEach(link => {
      link.addEventListener('click', async x => {
        x.preventDefault();
        const view = x.target.getAttribute('href').replace('#', '');
        window.location.hash = view;
        await this.#events.publish('navigateTo', view);
      });
    });

    return navbarElm;
  }
}