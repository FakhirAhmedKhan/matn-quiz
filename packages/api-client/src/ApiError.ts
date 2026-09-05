export type ApiErrorOptions = {
  status?: number;
  code?: string;
  details?: unknown;
  retryable?: boolean;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly retryable: boolean;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);

    this.name = "ApiError";

    this.status = options.status;

    this.code = options.code;

    this.details = options.details;

    this.retryable = options.retryable ?? false;

    if (options.cause !== undefined) {
      Object.defineProperty(this, "cause", {
        value: options.cause,

        configurable: true,

        enumerable: false,

        writable: false,
      });
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}
