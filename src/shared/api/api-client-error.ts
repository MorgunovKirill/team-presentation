export class ApiClientError extends Error {
  title: string

  constructor(error: unknown) {
    super(error instanceof Error ? error.message : 'Unknown error')
    this.title = 'Ошибка запроса'
    this.name = 'ApiClientError'
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}
