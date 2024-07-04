// Import Events module from Events.js file
import { Events } from '../Events.js';

// Define KardsView class for rendering card-related views
export class KardsView {
  constructor() {}

  // Render method asynchronously creates the card view
  async render() {
    // Create a container element for the entire view
    const kardsViewElm = document.createElement('div');
    kardsViewElm.id = 'kards-view';

    // Create a message display element
    const infoMessageElm = document.createElement('div');
    infoMessageElm.id = 'info-message';
    kardsViewElm.appendChild(infoMessageElm);

    // Create a title element
    const titleElm = document.createElement('h2');
    titleElm.innerText = 'Card List:';

    // Create a container for search input and button
    const searchContainerElm = document.createElement('div');
    const searchInputElm = document.createElement('input');
    searchInputElm.id = 'search-input';
    searchInputElm.type = 'text';
    searchInputElm.placeholder = 'Enter Card Number:';

    const searchButtonElm = document.createElement('button');
    searchButtonElm.id = 'search-button';
    searchButtonElm.innerText = 'Search';

    // Event listener for search button click
    searchButtonElm.addEventListener('click', async () => {
      const cardNumber = searchInputElm.value.trim();
      if (cardNumber) {
        await this.#searchCard(cardNumber); // Call private method to search for card
      } else {
        this.#showInfoMessage('Please enter a Card Number'); // Show info message if no card number entered
      }
    });

    // Append search input and button to search container
    searchContainerElm.appendChild(searchInputElm);
    searchContainerElm.appendChild(searchButtonElm);

    // Create container for displaying cards
    const kardContainerElm = document.createElement('div');
    kardContainerElm.id = 'kard-container';

    // Append title, search container, and card container to main view container
    kardsViewElm.appendChild(titleElm);
    kardsViewElm.appendChild(searchContainerElm);
    kardsViewElm.appendChild(kardContainerElm);

    // Create instance of KardList to render list of cards
    const kardList = new KardList();
    kardContainerElm.appendChild(await kardList.render());

    // Append card container to main view container again (redundant)
    kardsViewElm.appendChild(kardContainerElm);

    // Return the constructed main view container
    return kardsViewElm;
  }

  // Private method to search for a card based on card number
  async #searchCard(cardNumber) {
    try {
      const response = await fetch(`http://localhost:3260/read?cardNumber=${cardNumber}`);
      const data = await response.json();
      
      if (response.ok) {
        this.#showInfoMessage(data.message); // Show success message
      } else {
        this.#showInfoMessage(data.error); // Show error message
        console.error('Failed to fetch card:', data.error); // Log error to console
      }
    } catch (error) {
      console.error('Error fetching card:', error); // Log error to console
    }
  }

  // Private method to show information message on the view
  #showInfoMessage(message) {
    const infoMessageElm = document.getElementById('info-message');
    infoMessageElm.innerText = message;
    infoMessageElm.style.opacity = 1;
    setTimeout(() => {
      infoMessageElm.style.opacity = 0;
    }, 5000); // Fade out info message after 5 seconds
  }
}

// Define KardList class for rendering a list of cards
class KardList {
  constructor() {}

  // Render method asynchronously creates the card list view
  async render() {
    const kardListElm = document.createElement('div');
    kardListElm.id = 'kard-list';

    // Create instances of CardInput and CardList
    const cardInput = new CardInput();
    const cardList = new CardList();

    // Render input and list elements, and append them to the card list container
    const cardInputElm = cardInput.render();
    const cardListElm = await cardList.render();
    kardListElm.appendChild(cardInputElm);
    kardListElm.appendChild(cardListElm);

    // Return the constructed card list container
    return kardListElm;
  }
}

// Define CardInput class for handling input related to card operations
class CardInput {
  #events = null; // Private property for Events module

  constructor() {
    this.#events = Events.events(); // Initialize events for publishing and subscribing
  }

  // Render method creates input box and button for adding cards
  render() {
    const cardInputElm = document.createElement('div');
    cardInputElm.id = 'text-input';

    // Render input box and button elements
    const inputElm = this.#renderInputBox();
    const buttonElm = this.#renderInputButton(inputElm);
    cardInputElm.appendChild(inputElm);
    cardInputElm.appendChild(buttonElm);

    // Return the constructed card input element
    return cardInputElm;
  }

  // Private method to render input box for entering card number
  #renderInputBox() {
    const inputElm = document.createElement('input');
    inputElm.id = 'card-input';
    inputElm.type = 'text';
    inputElm.placeholder = 'Enter Card Number:';

    // Event listener for pressing Enter in input box
    inputElm.addEventListener('keyup', async event => {
      if (event.key !== 'Enter') {
        return;
      }

      await this.#addCard(inputElm.value); // Call private method to add card
      inputElm.value = ''; // Clear input box after adding card
    });

    // Return the constructed input element
    return inputElm;
  }

  // Private method to render button for adding cards
  #renderInputButton(inputElm) {
    const buttonElm = document.createElement('button');
    buttonElm.id = 'add-card-button';
    buttonElm.innerText = 'Add Card';

    // Event listener for clicking Add Card button
    buttonElm.addEventListener('click', async () => {
      await this.#addCard(inputElm.value); // Call private method to add card
      inputElm.value = ''; // Clear input box after adding card
    });

    // Return the constructed button element
    return buttonElm;
  }

  // Private method to asynchronously add a card with given card number
  async #addCard(cardNumber) {
    try {
      const id = Math.random().toString(36); // Generate unique ID for the card
      const response = await fetch(`http://localhost:3260/create?cardNumber=${cardNumber}&id=${id}`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        this.#showInfoMessage(data.message); // Show success message
        this.#events.publish('card-input', new Card(cardNumber, id)); // Publish card input event
      } else {
        this.#showInfoMessage(data.error); // Show error message
        console.error('Failed to create card:', response.statusText); // Log error to console
      }
    } catch (error) {
      console.error('Error creating card:', error); // Log error to console
    }
  }

  // Private method to show information message on the view
  #showInfoMessage(message) {
    const infoMessageElm = document.getElementById('info-message');
    infoMessageElm.innerText = message;
    infoMessageElm.style.opacity = 1;
    setTimeout(() => {
      infoMessageElm.style.opacity = 0;
    }, 5000); // Fade out info message after 5 seconds
  }
}

// Define CardList class for rendering a list of cards with operations
class CardList {
  #events = null; // Private property for Events module
  #cards = null; // Private property for storing list of cards
  #list = null; // Private property for DOM list element

  constructor() {
    this.#events = Events.events(); // Initialize events for publishing and subscribing
  }

  // Render method asynchronously creates the card list view
  async render() {
    // If cards haven't been fetched yet, get them asynchronously
    if (this.#cards === null) {
      this.#cards = await this.#getCards();
    }

    // Create container for card list
    const cardListElm = document.createElement('div');
    cardListElm.id = 'card-list';

    // Create unordered list element for displaying cards
    this.#list = document.createElement('ul');

    // Create list items for each card and append them to the list
    const listItems = this.#cards.map(card => this.#makeCardItem(card));
    listItems.forEach(li => this.#list.appendChild(li));
    
    // Append list to card list container
    cardListElm.appendChild(this.#list);

    // Subscribe to 'card-input' event to update card list when new card is added
    this.#events.subscribe('card-input', card => {
      this.#cards.push(card); // Add new card to local list
      const li = this.#makeCardItem(card); // Create list item for new card
      this.#list.appendChild(li); // Append list item to DOM list
    });

    // Return the constructed card list container
    return cardListElm;
  }

  // Private method to asynchronously fetch all cards
  async #getCards() {
    try {
      const response = await fetch('http://localhost:3260/all');
      const data = await response.json();
      if (response.ok) {
        return data.map(card => new Card(card.cardNumber, card.id)); // Map fetched data to Card objects
      } else {
        this.#showInfoMessage(data.message); // Show error message
        console.error('Failed to load cards:', response.statusText); // Log error to console
        return [];
      }
    } catch (error) {
      console.error('Error loading cards:', error); // Log error to console
      return [];
    }
  }

  // Private method to asynchronously delete a card by ID and card number
  async #deleteCard(id, cardNumber) {
    try {
      const response = await fetch(`http://localhost:3260/delete?id=${id}&cardNumber=${cardNumber}` , { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        this.#showInfoMessage(data.message); // Show success message
        this.#cards = this.#cards.filter(card => card.id !== id); // Filter out deleted card from local list
      } else {
        this.#showInfoMessage(data.error); // Show error message
        console.error('Failed to delete card:', response.statusText); // Log error to console
      }
    } catch (error) {
      console.error('Error deleting card:', error); // Log error to console
    }
  }

  // Private method to asynchronously update a card by ID and card numbers
  async #updateCard(id, newCardNumber, oldCardNumber) {
    try {
      const response = await fetch(`http://localhost:3260/update?id=${id}&newCardNumber=${newCardNumber}&oldCardNumber=${oldCardNumber}`, { method: 'PUT' });
      const data = await response.json();
      if (response.ok) {
        this.#showInfoMessage(data.message); // Show success message
        // Update local cards list with new card number
        this.#cards = this.#cards.map(card => (card.id === id ? new Card(newCardNumber, id) : card));
      } else {
        this.#showInfoMessage(data.error); // Show error message
        console.error('Failed to update card:', response.statusText); // Log error to console
      }
    } catch (error) {
      console.error('Error updating card:', error); // Log error to console
    }
  }

  // Private method to create a list item for a card
  #makeCardItem(card) {
    const li = document.createElement('li');
    li.innerText = card.name; // Display card name (number)
    li.id = card.id; // Set ID attribute of list item

    // Create delete button for the card
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('deleteButton');

    // Event listener for clicking delete button
    deleteButton.addEventListener('click', async () => {
      this.#events.publish('delete-card', card); // Publish delete-card event
      this.#list.removeChild(li); // Remove list item from DOM list
      await this.#deleteCard(card.id, card.name); // Call private method to delete card
    });

    // Create update button for the card
    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';
    updateButton.classList.add('updateButton');

    // Event listener for clicking update button
    updateButton.addEventListener('click', async () => {
      const newCardNumber = prompt('Enter new card number:', card.name); // Prompt user for new card number
      if (newCardNumber) {
        await this.#updateCard(card.id, newCardNumber, card.name); // Call private method to update card
        li.innerText = newCardNumber; // Update displayed card number in list item
        li.appendChild(deleteButton); // Re-append delete button
        li.appendChild(updateButton); // Re-append update button
      }
    });

    // Append delete and update buttons to list item
    li.appendChild(deleteButton);
    li.appendChild(updateButton);

    // Return the constructed list item
    return li;
  }

  // Private method to show information message on the view
  #showInfoMessage(message) {
    const infoMessageElm = document.getElementById('info-message');
    infoMessageElm.innerText = message;
    infoMessageElm.style.opacity = 1;
    setTimeout(() => {
      infoMessageElm.style.opacity = 0;
    }, 5000); // Fade out info message after 5 seconds
  }
}

// Define Card class for representing a card with name (card number) and ID
class Card {
  constructor(name, id) {
    if (id === undefined) {
      this.id = Math.random().toString(36); // Generate random ID if not provided
    } else {
      this.id = id; // Use provided ID
    }
    this.name = name; // Set card name (number)
  }
}
