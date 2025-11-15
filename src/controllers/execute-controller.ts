import { generateObject } from 'ai';
import { type Request, type Response } from 'express';
import { structureSchema } from '../lib/validators.ts';
import { tryCatch } from '../lib/try-catch.ts';
import { huggingface } from '@ai-sdk/huggingface';

// Create a model instance for the Hugging Face model
const model = huggingface(process.env['MODEL_ID'] || 'Qwen/Qwen3-235B-A22B-Instruct-2507:cerebras');

/**
 * Controller function for handling execute requests
 */
export const executeController = async (req: Request, res: Response) => {
  const { code, message } = req.query;

  // Check if the code query parameter is present and matches the expected code
  if (!code || code !== process.env['CODE']) {
    // Log unauthorized access attempt with the provided code
    console.error('Unauthorized access attempt with code:', code);

    // Send unauthorized response to the client
    res.status(401).send({
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized access',
    });
    return;
  }

  // Check if the message query parameter is present
  if (!message) {
    // Log missing message parameter
    console.error('Missing message parameter');

    // Send bad request response to the client
    res.status(400).send({
      status: 400,
      error: 'Bad Request',
      message: 'Message is required',
    });
    return;
  }

  // Generate structure from the message
  const { error, data } = await tryCatch(
    generateObject({
      model: model,
      schema: structureSchema,
      prompt: `Generate a structure for the following message: ${message}`,
    }),
  );

  // Check if there was an error in generating the structure
  if (error) {
    // Log error message
    console.error('Error generating structure:', error.message);

    // Send internal server error response to the client
    res.status(500).send({
      status: 500,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    });
    return;
  }

  // Send success response to the client
  res.status(200).send({
    status: 200,
    message: 'Structure generated successfully',
    structure: data.object,
  });
}