# LLM-Driven Restaurant Finder API

## Overview

The LLM-Driven Restaurant Finder API allows users to search for restaurants based on a text query. The API leverages a large language model (LLM) to understand the query then generate structured output and use the generated output to search for restaurants using the FourSquare API.

## API Endpoint

- **Route**: `/api/execute`
- **HTTP Method**: GET

## Query Parameters

- `code`: String - The password to access the API
- `message`: String - The text content to be processed

### Required Fields

- `code`: String
- `message`: String (1-5000 characters)

## Output Format

```json
{
  "status": 200,
  "message": "Your request has been processed successfully",
  "restaurants": [
    // Restaurant objects...
  ]
}
```

## Example Request and Response

**Request:**

```bash
curl -G \
     http://localhost:3000/api/execute?code=pioneerdevai&message=Find%20me%20a%20cheap%20italian%20restaurant%20in%20downtown%20Los%20Angeles%20thats%20open%20now%20and%20has%20at%20least%20a%204-star%20rating \
     -H "Content-Type: application/json"
```

**Response:**

```json
{
  "status": 200,
  "message": "Your request has been processed successfully",
  "restaurants": [
    {
      "name": "Amante Restaurant",
      "address": "123 E 9th St, Los Angeles, CA 90015",
      "cuisine": ["Italian"],
      "rating": 8.1,
      "priceLevel": 2,
      "hours": "Mon–Fri: 10:00 AM–3:00 AM; Sat–Sun: 11:00 AM–3:00 AM"
    }
    // More restaurant objects...
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid query parameters

  ```json
  {
    "status": 400,
    "error": "Bad Request",
    "message": {
      /* validation error details */
    }
  }
  ```

- `401 Unauthorized`: Invalid code

  ```json
  {
    "status": 401,
    "error": "Unauthorized",
    "message": "Unauthorized access"
  }
  ```

- `500 Internal Server Error`: Server-side processing errors
  ```json
  {
    "status": 500,
    "error": "Internal Server Error",
    "message": "Internal Server Error"
  }
  ```

## Requirements

- Hugging Face API key
- FourSquare API key
- Node.js environment
- Dependencies:
  - Vercel AI SDK (`ai` package)
  - @ai-sdk/huggingface: AI SDK provider for Hugging Face models

## Technical Implementation

The API is built using the following technologies:

- **Vercel AI SDK**: Provides the core AI functionality
- **@ai-sdk/huggingface**: AI SDK provider for Hugging Face models
- **Zod**: A TypeScript-first schema validation library for input validation
- **TypeScript**: For type safety and improved developer experience
- **dotenv**: For securely loading environment variables
- **Express**: For building the API server

## Troubleshooting

1. If you encounter "Error generating structure: {message}" errors:

   - If the message is Unauthorized, verify the Hugging Face API key is correctly set in the environment variables and you have permission to access the Hugging Face API.
   - If the message is other than Unauthorized, check the [Hugging Face API documentation](https://huggingface.co/docs/api-inference/index) and [AI SDK for Hugging Face Provider](https://ai-sdk.dev/providers/ai-sdk-providers/huggingface#hugging-face-provider) for the specific error message and resolve the issue.

2. If you encounter "Error getting restaurant: {message}" errors:

   - If the message is Unauthorized, verify the FourSquare API key is correctly set in the environment variables and you have permission to access the FourSquare API.
   - If the message is other than Unauthorized, check the [FourSquare API documentation](https://places-api.foursquare.com/places/search) for the specific error message and resolve the issue.

3. If experiencing type errors, verify that all types and TypeScript dependencies are correctly installed:
   ```bash
   npm install tsx typescript @types/node @types/express
   ```

## Running the API Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add your Hugging Face API key, FourSquare API key, code, and other required environment variables.

3. Start the server:

   ```bash
   npm run dev
   ```

4. The API should now be running on `http://localhost:3000`.

## Running the API in Production

1. Set up environment variables:
   Add your Hugging Face API key, FourSquare API key, code, and other required environment variables.

2. Build the API for production:
   ```bash
   npm run build
   ```
3. Start the server:

   ```bash
   npm run start
   ```

4. The API should now be running on `http://localhost:3000`.
