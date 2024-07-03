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

    inputElm.addEventListener('keyup', async event => {
      if (event.key !== 'Enter') {
        return;
      }

      await this.#addCard(inputElm.value);
      inputElm.value = '';
    });

    return inputElm;
  }

  #renderInputButton(inputElm) {
    const buttonElm = document.createElement('button');
    buttonElm.id = 'add-card-button';
    buttonElm.innerText = 'Add Card';

    buttonElm.addEventListener('click', async () => {
      await this.#addCard(inputElm.value);
      inputElm.value = '';
    });

    return buttonElm;
  }

  async #addCard(cardNumber) {
    try {
      const id = Math.random().toString(36);
      const response = await fetch(`http://localhost:3260/create?cardNumber=${cardNumber}&id=${id}`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        alert(JSON.stringify(data.message));
        this.#events.publish('card-input', new Card(cardNumber, id));
      } else {
        alert(JSON.stringify(data.error));
        console.error('Failed to create card:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
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
    });

    return cardListElm;
  }

  async #getCards() {
    try {
      const response = await fetch('http://localhost:3260/all');
      const data = await response.json();
      if (response.ok) {
        return data.map(card => new Card(card.cardNumber, card.id));
      } else {
        alert(JSON.stringify(data.message));
        console.error('Failed to load cards:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      return [];
    }
  }

  async #deleteCard(id, cardNumber) {
    try {
      const response = await fetch(`http://localhost:3260/delete?id=${id}&cardNumber=${cardNumber}` , { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        alert(JSON.stringify(data.message));
        this.#cards = this.#cards.filter(card => card.id !== id);
      } else {
        alert(JSON.stringify(data.error));
        console.error('Failed to delete card:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }

  async #updateCard(id, newCardNumber, oldCardNumber) {
    try {
      const response = await fetch(`http://localhost:3260/update?id=${id}&newCardNumber=${newCardNumber}&oldCardNumber=${oldCardNumber}`, { method: 'PUT' });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        this.#cards = this.#cards.map(card => (card.id === id ? new Card(newCardNumber, id) : card));
      } else {
        alert(data.error);
        console.error('Failed to update card:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  }

  #makeCardItem(card) {
    const li = document.createElement('li');
    li.innerText = card.name;
    li.id = card.id;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('deleteButton');

    deleteButton.addEventListener('click', async () => {
      this.#events.publish('delete-card', card);
      this.#list.removeChild(li);
      await this.#deleteCard(card.id, card.name);
    });

    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';
    updateButton.classList.add('updateButton');

    updateButton.addEventListener('click', async () => {
      const newCardNumber = prompt('Enter new card number:', card.name);
      if (newCardNumber) {
        await this.#updateCard(card.id, newCardNumber, card.name);
        li.innerText = newCardNumber;
        li.appendChild(deleteButton);
        li.appendChild(updateButton);
      }
    });

    li.appendChild(deleteButton);
    li.appendChild(updateButton);
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
