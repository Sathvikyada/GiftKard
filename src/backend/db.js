// Import PouchDB
import PouchDB from "pouchdb";
const db = new PouchDB("kards");

// Function to add a new card number
export async function saveCard(cardNumber) {
  await db.put({ _id: new Date().toISOString(), cardNumber });
}

// Function to get a card by id
export async function loadCard(id) {
  return await db.get(id);
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
