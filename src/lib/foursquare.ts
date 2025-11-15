import type { structureSchemaType } from "./schema.js";

// The type for a restaurant in the Foursquare API response
type FourSquareRestaurant = {
  categories: {
    short_name: string;
  }[];
  hours: {
    display: string;
  };
  location: {
    formatted_address: string;
  };
  rating: number;
  name: string;
  price: number;
};

// The type for the response from the Foursquare API
type FourSquareResponse = {
  results: FourSquareRestaurant[];
};

/**
 * Get restaurants from Foursquare API
 * @param object - The object containing the parameters for the API request
 * @returns an array of restaurants
 */
export const getRestaurants = async (object: structureSchemaType)=> {
  // The url enpoint of Four Square API
  const url = 'https://places-api.foursquare.com/places/search';
  const apiKey = process.env['FOURSQUARE_API_KEY'] || '';

  // Destructure the parameters from the object
  const { query, near, min_price, max_price, open_now, rating } = object.parameters;

  // The fields to include in the response
  const fields = 'name,location,rating,hours,price,categories';

  // Make the API request using fetch
  const response = await fetch(
    `${url}?query=${encodeURIComponent(query)}&near=${encodeURIComponent(near)}&min_price=${min_price}&max_price=${max_price}&open_now=${open_now}&rating=${rating}&fields=${fields}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Places-Api-Version': '2025-06-17',
        'Accept': 'application/json',
      },
    },
  );

  // Check if the response is ok
  if (!response.ok) {
    // Throw an error with the status text
    throw new Error(response.statusText);
  }

  // Parse the response body as JSON
  const data = await response.json();

  // Map the results to the desired format
  const restaurants = (data as FourSquareResponse).results.map((restaurant: FourSquareRestaurant) => ({
    name: restaurant.name,
    address: restaurant.location.formatted_address,
    cuisine: restaurant.categories.map((category) => category.short_name),
    rating: restaurant.rating,
    priceLevel: restaurant.price,
    hours: restaurant.hours.display,
  }));

  return restaurants;
};
