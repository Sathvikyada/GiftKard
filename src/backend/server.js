import express from "express";
import logger from "morgan";
import * as db from "./db.js";

const headerFields = { "Content-Type": "application/json" };

async function createCard(response, cardNumber, id) {
  if (cardNumber === undefined) {
    response.status(400).json({ error: "Card Number Required" });
  } else {
    try {
      await db.saveCard(cardNumber, id);
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

async function readCard(response, id) {
  try {
    const card = await db.loadCard(id);
    response.status(200).json({ id: card._id, cardNumber: card.cardNumber });
  } catch (err) {
    response.status(404).json({ error: `Card ${id} Not Found` });
  }
}

async function updateCard(response, id, newCardNumber, oldCardNumber) {
  try {
    await db.modifyCard(id, newCardNumber);
    response.status(200).json({ message: `Card (${oldCardNumber}) Updated to (${newCardNumber})` });
  } catch (err) {
    response.status(404).json({ error: `Card (${oldCardNumber}) Not Found` });
  }
}

async function deleteCard(response, id, cardNumber) {
  try {
    await db.removeCard(id);
    response.status(200).json({ message: `Card (${cardNumber}) Deleted` });
  } catch (err) {
    response.status(404).json({ error: `Card (${cardNumber}) Not Found` });
  }
}

async function dumpCards(response) {
  try {
    const cards = await db.loadAllCards();
    response.status(200).json(cards);
  } catch (err) {
    response.status(500).json({
      error: "Internal Server Error",
      message: "Unable to load cards",
      details: err.message,
    });
  }
}

const app = express();
const port = 3260;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/frontend"));

const MethodNotAllowedHandler = (request, response) => {
  response.status(405).type("application/json").send({ error: "Method Not Allowed" });
};

// Route handlers
app
  .route("/create")
  .post((request, response) => {
    const options = request.query;
    createCard(response, options.cardNumber, options.id);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/read")
  .get((request, response) => {
    const options = request.query;
    readCard(response, options.id);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/update")
  .put((request, response) => {
    const options = request.query;
    updateCard(response, options.id, options.newCardNumber, options.oldCardNumber);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/delete")
  .delete((request, response) => {
    const options = request.query;
    deleteCard(response, options.id, options.cardNumber);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/all")
  .get((request, response) => {
    dumpCards(response);
  })
  .all(MethodNotAllowedHandler);

// Catch-all route for unmatched paths
app.route("*").all((request, response) => {
  response.status(404).json({ error: `Not found: ${request.path}` });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});