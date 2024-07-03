# My Web Application

## API Documentation

**Endpoint: Create Card**
1. Endpoint
/create

2. HTTP Method
POST

3. Description
Creates a new card with the provided card number and ID.

4. Parameters
Query Parameters
cardNumber (string, required): The card number to be created.
id (string, required): The ID associated with the card.

5. Request Body
Not applicable.

6. Response Body
Success (200)
{
  "message": "Card (cardNumber) Created"
}

Error (400)
{
  "error": "Card Number Required"
}

Error (500)
{
  "error": "Internal Server Error",
  "message": "Unable to create card",
  "details": "Error details"
}

7. Examples
Request: POST /create?cardNumber=123456&id=1

Response:
{
  "message": "Card (123456) Created"
}

**Endpoint: Read Card**
1. Endpoint
/read

2. HTTP Method
GET

3. Description
Reads the card information based on the provided card number.

4. Parameters
Query Parameters
cardNumber (string, required): The card number to be read.

5. Request Body
Not applicable.

6. Response Body
Success (200)
{
  "message": "Card (cardNumber) Found"
}

Error (404)
{
  "error": "Card cardNumber Not Found"
}

7. Examples
Request: GET /read?cardNumber=123456

Response:
{
  "message": "Card (123456) Found"
}


**Endpoint: Update Card**
1. Endpoint
/update

2. HTTP Method
PUT

3. Description
Updates the card number for a given card ID.

4. Parameters
Query Parameters
id (string, required): The ID of the card to be updated.
newCardNumber (string, required): The new card number to replace the old one.
oldCardNumber (string, required): The old card number to be updated.

5. Request Body
Not applicable.

6. Response Body
Success (200)
{
  "message": "Card (oldCardNumber) Updated to (newCardNumber)"
}

Error (404)
{
  "error": "Card (oldCardNumber) Not Found"
}

7. Examples
Request: PUT /update?id=1&newCardNumber=654321&oldCardNumber=123456

Response:
{
  "message": "Card (123456) Updated to (654321)"
}

**Endpoint: Delete Card**
1. Endpoint
/delete

2. HTTP Method
DELETE

3. Description
Deletes the card with the provided card number and ID.

4. Parameters
Query Parameters
id (string, required): The ID of the card to be deleted.
cardNumber (string, required): The card number to be deleted.

5. Request Body
Not applicable.

6. Response Body
Success (200)
{
  "message": "Card (cardNumber) Deleted"
}

Error (404)
{
  "error": "Card (cardNumber) Not Found"
}

7. Examples
Request: DELETE /delete?id=1&cardNumber=123456

Response:
{
  "message": "Card (123456) Deleted"
}

**Endpoint: Dump All Cards**
1. Endpoint
/all

2. HTTP Method
GET

3. Description
Retrieves all cards in the database.

4. Parameters
Not applicable.

5. Request Body
Not applicable.

6. Response Body
Success (200)
[
  {
    "id": "1",
    "cardNumber": "123456"
  },
  {
    "id": "2",
    "cardNumber": "654321"
  }
]

Error (500)
{
  "error": "Internal Server Error",
  "message": "Unable to load cards",
  "details": "Error details"
}

7. Examples
Request: GET /all

Response:
[
  {
    "id": "1",
    "cardNumber": "123456"
  },
  {
    "id": "2",
    "cardNumber": "654321"
  }
]

## Project Setup
To get started with the project, follow these steps:
**Clone the Repository:**
   ```sh
   git clone [<repository-url>](https://github.com/Sathvikyada/GiftKard.git)
   cd my-web-application