import { Events } from '../Events.js';

export class KardsView {
  constructor() {}

  async render() {
    const kardsViewElm = document.createElement('div');
    kardsViewElm.id = 'kards-view';

    const titleElm = document.createElement('h2');
    titleElm.innerText = 'Card List:';

    const kardContainerElm = document.createElement('div');
    kardContainerElm.id = 'kard-container';

    kardsViewElm.appendChild(titleElm);
    kardsViewElm.appendChild(kardContainerElm);

    const kardList = new KardList();
    kardContainerElm.appendChild(await kardList.render());

    kardsViewElm.appendChild(kardContainerElm);

    return kardsViewElm;
  }
}

class KardList {
  constructor() {}

  async render() {
    const kardListElm = document.createElement('div');
    kardListElm.id = 'kard-list';

    const cardInput = new CardInput();
    const cardList = new CardList();
    const cardInputElm = cardInput.render();
    const cardListElm = await cardList.render();

    kardListElm.appendChild(cardInputElm);
    kardListElm.appendChild(cardListElm);

    return kardListElm;
  }
}

class CardInput {
  #events = null;

  constructor() {
    this.#events = Events.events();
  }

  render() {
    const cardInputElm = document.createElement('div');
    cardInputElm.id = 'text-input';

    const inputElm = this.#renderInputBox();
    const buttonElm = this.#renderInputButton(inputElm);
    cardInputElm.appendChild(inputElm);
    cardInputElm.appendChild(buttonElm);

    return cardInputElm;
  }

  #renderInputBox() {
    const inputElm = document.createElement('input');
    inputElm.id = 'card-input';
    inputElm.type = 'text';
    inputElm.placeholder = 'Enter Card Number:';

    inputElm.addEventListener('keyup', event => {
      if (event.key !== 'Enter') {
        return;
      }

      this.#events.publish('card-input', new Card(inputElm.value));
      inputElm.value = '';
    });

    return inputElm;
  }

  #renderInputButton(inputElm) {
    const buttonElm = document.createElement('button');
    buttonElm.id = 'add-card-button';
    buttonElm.innerText = 'Add Card';

    buttonElm.addEventListener('click', () => {
      this.#events.publish('card-input', new Card(inputElm.value));
      inputElm.value = '';
    });

    return buttonElm;
  }
}

class CardList {
  #events = null;
  #cards = null;
  #list = null;

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    if (this.#cards === null) {
      this.#cards = await this.#getCards();
    }

    const cardListElm = document.createElement('div');
    cardListElm.id = 'card-list';

    this.#list = document.createElement('ul');
    const listItems = this.#cards.map(card => this.#makeCardItem(card));

    listItems.forEach(li => this.#list.appendChild(li));
    
    cardListElm.appendChild(this.#list);

    this.#events.subscribe('card-input', card => {
      this.#cards.push(card);
      const li = this.#makeCardItem(card);
      this.#list.appendChild(li);
      this.#saveCards();
    });

    return cardListElm;
  }

  async #getCards() {
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards).map(card => new Card(card.name, card.id)) : [];
  }

  #saveCards() {
    localStorage.setItem('cards', JSON.stringify(this.#cards));
  }

  #deleteCard(id) {
    this.#cards = this.#cards.filter(card => card.id !== id);
    this.#saveCards();
  }

  #makeCardItem(card) {
    const li = document.createElement('li');
    li.innerText = card.name;
    li.id = card.id;

    const button = document.createElement('button');
    button.innerText = 'Delete';
    button.classList.add('deleteButton');

    button.addEventListener('click', () => {
      this.#events.publish('delete-card', card);
      this.#list.removeChild(li);
      this.#deleteCard(card.id);
    });

    li.appendChild(button);
    return li;
  }
}

class Card {
  constructor(name, id) {
    if (id === undefined) {
      this.id = Math.random().toString(36);
    } else {
      this.id = id;
    }
    this.name = name;
  }
}