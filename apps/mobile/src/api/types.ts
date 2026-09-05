export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export type ApiQueryPrimitive =
  | string
  | number
  | boolean
  | null
  | undefined;

export type ApiQueryValue =
  | ApiQueryPrimitive
  | readonly ApiQueryPrimitive[];

export type ApiQuery =
  Record<
    string,
    ApiQueryValue
  >;

export type ApiHeaders =
  Record<
    string,
    string
  >;

export type ApiRequestOptions = {
  headers?:
    ApiHeaders;

  query?:
    ApiQuery;

  timeoutMs?:
    number;

  retries?:
    number;

  signal?:
    AbortSignal;

  auth?:
    boolean;
};

export type ApiMutationOptions<TBody> =
  ApiRequestOptions & {
    body?:
      TBody;
  };

export type ApiErrorPayload = {
  message?:
    string | string[];

  error?:
    string;

  statusCode?:
    number;

  code?:
    string;

  [key: string]:
    unknown;
};