// Import PouchDB
import PouchDB from "pouchdb";
const db = new PouchDB("kards"); // Create a new PouchDB instance named "kards"

// Function to add a new card number to the database
export async function saveCard(cardNumber, id) {
  await db.put({ _id: id, cardNumber }); // Insert a new document with _id as id and cardNumber field
}

// Function to get a card by card number
export async function loadCard(cardNumber) {
  const result = await db.allDocs({ include_docs: true }); // Retrieve all documents from the database
  const matchingCards = result.rows.filter(row => row.doc.cardNumber === cardNumber); // Filter documents by cardNumber
  
  if (matchingCards.length > 0) {
    return matchingCards[0].doc; // Return the first matching document
  } else {
    return null; // Return null if no matching document is found
  }
}

// Function to update a card's cardNumber by id
export async function modifyCard(id, newCardNumber) {
  const card = await db.get(id); // Retrieve the document by id
  card.cardNumber = newCardNumber; // Update the cardNumber field
  await db.put(card); // Save the updated document back to the database
}

// Function to delete a card by id
export async function removeCard(id) {
  const card = await db.get(id); // Retrieve the document by id
  await db.remove(card); // Remove the document from the database
}

// Function to get all cards from the database
export async function loadAllCards() {
  const result = await db.allDocs({ include_docs: true }); // Retrieve all documents from the database
  return result.rows.map((row) => row.doc); // Map the documents to an array of doc fields
}
