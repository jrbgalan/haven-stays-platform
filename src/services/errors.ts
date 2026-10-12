/**
 * Centralized error handling and retry utilities for data access.
 */
export class DataServiceError extends Error {
  public readonly code: string;
  public readonly originalError?: unknown;

  constructor(message: string, code = "SERVICE_ERROR", originalError?: unknown) {
    super(message);
    this.name = "DataServiceError";
    this.code = code;
    this.originalError = originalError;
  }
}

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const retries = options.retries ?? 2;
  const delayMs = options.delayMs ?? 300;
  const backoff = options.backoffFactor ?? 1.5;

  let currentDelay = delayMs;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoff;
    }
  }

  throw lastError instanceof DataServiceError
    ? lastError
    : new DataServiceError(
        (lastError as Error)?.message || "Data operation failed after retries",
        "RETRY_EXHAUSTED",
        lastError
      );
}

export function handleServiceError(error: unknown, context: string): never {
  console.error(`[DataService Error] ${context}:`, error);
  if (error instanceof DataServiceError) {
    throw error;
  }
  throw new DataServiceError(
    (error as Error)?.message || `An error occurred during ${context}`,
    "UNHANDLED_ERROR",
    error
  );
}

