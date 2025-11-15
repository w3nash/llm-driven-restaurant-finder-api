import { generateObject } from 'ai';
import { type Request, type Response } from 'express';
import { requestSchema, structureSchema } from '../lib/schema.js';
import { tryCatch } from '../lib/try-catch.js';
import { model } from '../lib/model.js';
import { getRestaurants } from '../lib/foursquare.js';
import { UNAUTHORIZED, BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS } from '../lib/codes.js';
import z from 'zod';


/**
 * Controller function for handling execute requests
 */
export const executeController = async (req: Request, res: Response) => {
  // Parse and validate the request query parameters
  const parseResult = requestSchema.safeParse(req.query);

  // Check if the request query parameters are valid
  if (!parseResult.success) {
    // Log validation errors
    console.error('Validation errors:', z.treeifyError(parseResult.error).properties);

    // Send bad request response to the client
    res.status(BAD_REQUEST).send({
      status: BAD_REQUEST,
      error: 'Bad Request',
      message: z.treeifyError(parseResult.error).properties,
    });
    return;
  }

  // Destructure the code and message query parameters from the request
  const { code, message } = req.query;

  // Matches the expected code
  if (code !== process.env['CODE']) {
    // Log unauthorized access attempt with the provided code
    console.error('Unauthorized access attempt with code:', code);

    // Send unauthorized response to the client
    res.status(UNAUTHORIZED).send({
      status: UNAUTHORIZED,
      error: 'Unauthorized',
      message: 'Unauthorized access',
    });
    return;
  }

  // Generate structure from the message
  const { error: generatorError, data: generatorData } = await tryCatch(
    generateObject({
      model: model,
      schema: structureSchema,
      prompt: `
      You are a foodie helpful assistant that can help users to find the best restaurants based on their preferences in well structured format.

      For 'query', a string to be matched against all content for this place, including but not limited to venue name, category, telephone number, taste, and tips.

      For 'near', a string naming a locality in the world (e.g., "Chicago, IL"). If the value is not geocodable, returns an error. Global search results will be omitted.

      For 'min_price', restricts results to only those places within the specified price range. Valid values range between 1 (most affordable) to 4 (most expensive), inclusive.

      For 'max_price', restricts results to only those places within the specified price range. Valid values range between 1 (most affordable) to 4 (most expensive), inclusive.

      For 'rating', this is a float value between 0 - 10, where 0 is the worst and 10 is the best. The user may use a star rating (e.g 4-star), The standard is 0 - 5 stars, so you need to do some calculation to convert the star rating to a float value. For example, 5-star will have a floating value of 8.0-10. The user may exaggerate the rating (e.g. 999 stars) to get a higher rating, but you should still limit the rating to 10.

      For 'open_now', a boolean value that restricts results to only those places that are open now.

      The user preference:
      ${message}
      `,
    }),
  );

  // Check if generatorError was an error in generating the structure
  if (generatorError) {
    // Log error message
    console.error('Error generating structure:', generatorError.message);

    // Send internal server error response to the client
    res.status(INTERNAL_SERVER_ERROR).send({
      status: INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    });
    return;
  }

  // Get restaurants from Foursquare API
  const { error: foursquareError, data: restaurants } = await tryCatch(getRestaurants(generatorData.object));

  // Check if foursquareError was an error in getting the restaurants
  if (foursquareError) {
    // Log error message
    console.error('Error getting restaurants:', foursquareError.message);

    // Send internal server error response to the client
    res.status(INTERNAL_SERVER_ERROR).send({
      status: INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    });
    return;
  }


  // Send success response to the client
  res.status(SUCCESS).send({
    status: SUCCESS,
    message: 'Your request has been processed successfully',
    restaurants
  })
}