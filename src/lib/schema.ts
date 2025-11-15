import z from 'zod';

/**
 * Schema for validating the object returned by generateObject
 */
export const structureSchema = z.object({
  action: z.string(),
  parameters: z.object({
    query: z.string(),
    near: z.string(),
    min_price: z.union([z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4')]),
    max_price: z.union([z.literal('1'), z.literal('2'), z.literal('3'), z.literal('4')]),
    rating: z.float32().min(0).max(10),
    open_now: z.boolean(),
  }),
});

/**
 * Schema for validating the request query parameters
 */
export const requestSchema = z.object({
  code: z.string().min(1, "Code is required").max(100, "Code must be at most 100 characters"),
  message: z.string().min(1, "Message is required").max(5000, "Message must be at most 5000 characters"),
});

/**
 * Type for the object returned by generateObject
 */
export type structureSchemaType = z.infer<typeof structureSchema>;