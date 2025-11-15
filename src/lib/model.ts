import { huggingface } from "@ai-sdk/huggingface";

// The Hugging Face model ID
const MODEL_ID = process.env['MODEL_ID'] || 'Qwen/Qwen3-235B-A22B-Instruct-2507';

// Create and export the model instance for the Hugging Face model
export const model = huggingface(MODEL_ID);
