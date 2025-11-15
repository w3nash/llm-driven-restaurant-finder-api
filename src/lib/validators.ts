import z from 'zod';

/**
 * Schema for validating the object returned by generateObject
 */
export const structureSchema = z.object({
  action: z.string(),
  parameters: z.object({
    query: z.string(),
    near: z.string(),
    min_price: z.string(),
    max_price: z.string(),
    open_now: z.boolean(),
  }),
});