// Import necessary modules
import express from "express";
import logger from "morgan";
import * as db from "./db.js"; // Import database functions from db.js

const headerFields = { "Content-Type": "application/json" };

// Function to create a new card in the database
async function createCard(response, cardNumber, id) {
  if (cardNumber === undefined) {
    response.status(400).json({ error: "Card Number Required" });
  } else {
    try {
      await db.saveCard(cardNumber, id); // Save the card to the database
      response.status(200).json({ message: `Card (${cardNumber}) Created` });
    } catch (err) {
      response.status(500).json({
        error: "Internal Server Error",
        message: "Unable to create card",
        details: err.message,
      });
    }
  }
}

// Function to read a card from the database by cardNumber
async function readCard(response, cardNumber) {
  try {
    const card = await db.loadCard(cardNumber); // Load the card from the database
    if (card === null) {
      response.status(200).json({ message: `Card (${cardNumber}) Not Found` });
    } else {
      response.status(200).json({ message: `Card (${cardNumber}) Found` });
    }
  } catch (err) {
    response.status(404).json({ error: `Card ${id} Not Found` });
  }
}

// Function to update a card in the database by id
async function updateCard(response, id, newCardNumber, oldCardNumber) {
  try {
    await db.modifyCard(id, newCardNumber); // Modify the card in the database
    response.status(200).json({ message: `Card (${oldCardNumber}) Updated to (${newCardNumber})` });
  } catch (err) {
    response.status(404).json({ error: `Card (${oldCardNumber}) Not Found` });
  }
}

// Function to delete a card from the database by id
async function deleteCard(response, id, cardNumber) {
  try {
    await db.removeCard(id); // Remove the card from the database
    response.status(200).json({ message: `Card (${cardNumber}) Deleted` });
  } catch (err) {
    response.status(404).json({ error: `Card (${cardNumber}) Not Found` });
  }
}

// Function to retrieve all cards from the database
async function dumpCards(response) {
  try {
    const cards = await db.loadAllCards(); // Load all cards from the database
    response.status(200).json(cards);
  } catch (err) {
    response.status(500).json({
      error: "Internal Server Error",
      message: "Unable to load cards",
      details: err.message,
    });
  }
}

// Create an Express application
const app = express();
const port = 3260; // Define the port

// Middleware setup
app.use(logger("dev")); // Logging middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(express.static("src/frontend")); // Serve static files from "src/frontend" directory

// Handler for Method Not Allowed (405) responses
const MethodNotAllowedHandler = (request, response) => {
  response.status(405).type("application/json").send({ error: "Method Not Allowed" });
};

// Route handlers
app
  .route("/create")
  .post((request, response) => {
    const options = request.query;
    createCard(response, options.cardNumber, options.id); // Handle POST requests to create a card
  })
  .all(MethodNotAllowedHandler); // Handle all other HTTP methods with MethodNotAllowedHandler

app
  .route("/read")
  .get((request, response) => {
    const options = request.query;
    readCard(response, options.cardNumber); // Handle GET requests to read a card
  })
  .all(MethodNotAllowedHandler); // Handle all other HTTP methods with MethodNotAllowedHandler

app
  .route("/update")
  .put((request, response) => {
    const options = request.query;
    updateCard(response, options.id, options.newCardNumber, options.oldCardNumber); // Handle PUT requests to update a card
  })
  .all(MethodNotAllowedHandler); // Handle all other HTTP methods with MethodNotAllowedHandler

app
  .route("/delete")
  .delete((request, response) => {
    const options = request.query;
    deleteCard(response, options.id, options.cardNumber); // Handle DELETE requests to delete a card
  })
  .all(MethodNotAllowedHandler); // Handle all other HTTP methods with MethodNotAllowedHandler

app
  .route("/all")
  .get((request, response) => {
    dumpCards(response); // Handle GET requests to retrieve all cards
  })
  .all(MethodNotAllowedHandler); // Handle all other HTTP methods with MethodNotAllowedHandler

// Catch-all route for unmatched paths
app.route("*").all((request, response) => {
  response.status(404).json({ error: `Not found: ${request.path}` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
