// Import PouchDB
import PouchDB from "pouchdb";
const db = new PouchDB("kards");

// Function to add a new card number
export async function saveCard(cardNumber, id) {
  await db.put({ _id: id, cardNumber });
}

// Function to get a card by id
export async function loadCard(cardNumber) {
  const result = await db.allDocs({ include_docs: true });
  const matchingCards = result.rows.filter(row => row.doc.cardNumber === cardNumber);
  
  if (matchingCards.length > 0) {
    return matchingCards[0].doc;
  } else {
    return null;
  }
}

// Function to update a card
export async function modifyCard(id, newCardNumber) {
  const card = await db.get(id);
  card.cardNumber = newCardNumber;
  await db.put(card);
}

// Function to delete a card
export async function removeCard(id) {
  const card = await db.get(id);
  await db.remove(card);
}

// Function to get all cards
export async function loadAllCards() {
  const result = await db.allDocs({ include_docs: true });
  return result.rows.map((row) => row.doc);
}
