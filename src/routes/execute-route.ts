import express, { type Router } from 'express';
import { executeController } from '../controllers/execute-controller.ts';

// Create a router instance
const router: Router = express.Router();

// Define a route handler for GET requests to /api/execute
router.get('/api/execute', executeController);

export default router;
