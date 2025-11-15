import express, { type Express} from 'express';
import dotenv from 'dotenv';
import executeRouter from './routes/execute-route.js';

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app: Express = express();

// Set the port number for the server to listen on
const PORT = process.env['PORT'] || 3000;

// Use the execute router for requests to /api/execute
app.use(executeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});