export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiPrimitive = string | number | boolean | null | undefined;

export type ApiQueryValue = ApiPrimitive | ApiPrimitive[];

export type ApiQuery = Record<string, ApiQueryValue>;

export type ApiHeaders = Record<string, string>;

export type ApiAbortSignal = {
  readonly aborted: boolean;
};

export type ApiTransportRequest = {
  method: ApiMethod;
  url: string;
  headers: ApiHeaders;
  body?: unknown;
  timeoutMs: number;
  signal?: ApiAbortSignal;
};

export type ApiTransportResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
  headers?: ApiHeaders;
};

export type ApiTransport = <T>(
  request: ApiTransportRequest,
) => Promise<ApiTransportResponse<T>>;

export type ApiTokenProvider = () =>
  | string
  | null
  | undefined
  | Promise<string | null | undefined>;

export type ApiUnauthorizedHandler = (context: {
  method: ApiMethod;
  url: string;
  status: 401;
}) => boolean | Promise<boolean>;

export type ApiSleep = (milliseconds: number) => Promise<void>;

export type ApiClientOptions = {
  baseUrl: string;
  transport: ApiTransport;

  defaultTimeoutMs?: number;
  defaultRetryCount?: number;
  retryDelayMs?: number;

  getAccessToken?: ApiTokenProvider;
  onUnauthorized?: ApiUnauthorizedHandler;

  sleep?: ApiSleep;
};

export type ApiRequestOptions = {
  headers?: ApiHeaders;
  query?: ApiQuery;
  body?: unknown;

  timeoutMs?: number;
  retryCount?: number;

  retryUnsafeMethods?: boolean;
  skipAuth?: boolean;

  signal?: ApiAbortSignal;
};

export type ApiClient = {
  request<T>(
    method: ApiMethod,
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T>;

  get<T>(path: string, options?: ApiRequestOptions): Promise<T>;

  post<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ): Promise<T>;

  put<T>(path: string, body?: unknown, options?: ApiRequestOptions): Promise<T>;

  patch<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions,
  ): Promise<T>;

  delete<T>(path: string, options?: ApiRequestOptions): Promise<T>;
};
