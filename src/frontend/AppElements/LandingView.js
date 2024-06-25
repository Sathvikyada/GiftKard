export class Landing {

  constructor () {}

  async render() {
    const homeElm = document.createElement('div');
    homeElm.id = 'home';

    homeElm.innerHTML = `
      <div class="content">
        <div class="description">
          <h2>Welcome to Gift Card Manager</h2>
          <p>In the age of digital shopping, there is an increase in returns. An increase in returns means more gift cards which are often lost in drawers or handbags. This is effectively lost money which can be saved with simple reminders from the proposed web application.</p>
        </div>
        <div class="image">
          <img src="https://wallpapers.com/images/hd/colorful-gift-cards-stacked-pxqocmr0b9mmxszz-2.png" alt="Gift Cards">
        </div>
      </div>
    `;

    return homeElm;
  }
}