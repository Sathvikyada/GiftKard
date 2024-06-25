export class Help {

  constructor () {}

  async render() {
    const helpElm = document.createElement('div');
    helpElm.id = 'help';

    helpElm.innerHTML = `
      <h2>Help View -- Coming Soon</h2>
    `;

    return helpElm;
  }
}