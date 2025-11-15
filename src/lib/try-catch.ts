/**
 * Represents a successful result containing the resolved data.
 */
export type Success<T> = {
  data: T;
  error: null;
};

/**
 * Represents a failed result containing the encountered error.
 */
export type Failure<E> = {
  data: null;
  error: E;
};

/**
 * Union type representing either a successful or failed asynchronous result.
 * Defaults error type to the native Error class.
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Wraps a Promise to always resolve with a Result object, avoiding thrown exceptions.
 * @template T - The type of the resolved value.
 * @template E - The type of the error that may occur (defaults to Error).
 * @param promise - The Promise to be wrapped.
 * @returns A Promise that resolves to a Result object containing either data or an error.
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}