export type ApiErrorCode =
  | "CONFIGURATION_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "CANCELLED"
  | "HTTP_ERROR"
  | "PARSE_ERROR";

type ApiErrorOptions = {
  code:
    ApiErrorCode;

  status?:
    number;

  url?:
    string;

  details?:
    unknown;

  cause?:
    unknown;
};

export class ApiError extends Error {
  readonly code:
    ApiErrorCode;

  readonly status?:
    number;

  readonly url?:
    string;

  readonly details?:
    unknown;

  override readonly cause?:
    unknown;

  constructor(
    message: string,
    options: ApiErrorOptions,
  ) {
    super(message);

    this.name =
      "ApiError";

    this.code =
      options.code;

    this.status =
      options.status;

    this.url =
      options.url;

    this.details =
      options.details;

    this.cause =
      options.cause;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}

export function isApiError(
  error: unknown,
): error is ApiError {
  return error instanceof ApiError;
}