import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app: Express = express();

// Set the port number for the server to listen on
const PORT = process.env['PORT'] || 3000;

// Define a route handler for GET requests to /api/execute
app.get('/api/execute', (req: Request, res: Response) => {
  const { code, message } = req.query;

  // Check if the code query parameter is present and matches the expected code
  if (!code || code !== process.env['CODE']) {
    // Log unauthorized access attempt with the provided code
    console.error("Unauthorized access attempt with code:", code);

    // Send unauthorized response to the client
    res.status(401).send({
      status: 401,
      error: "Unauthorized",
      message: "Unauthorized access",
    });
    return;
  }

  // Check if the message query parameter is present
  if (!message) {
    // Log missing message parameter
    console.error("Missing message parameter");

    // Send bad request response to the client
    res.status(400).send({
      status: 400,
      error: "Bad Request",
      message: "Message is required",
    });
    return;
  }

  // Send success response to the client
  res.status(200).send({
    status: 200,
    message: "Welcome to the LLM Driven Restaurant Finder API",
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});