interface DataError {
  details: string
  reason: string
}
const getErrorMessage = (
  dataError: DataError,
  defaultValue: string | number
) => {
  if (dataError && dataError.details) {
    return dataError.details
  } else if (dataError && dataError.reason) {
    return dataError.reason
  }
  return defaultValue
}

interface IResponse<T = unknown> {
  loading?: boolean
  isError: boolean
  errorMessage?: string
  result?: T
  response?: unknown
}

export async function processResponse<T>(
  res: Response,
  ready_body = true
): Promise<IResponse<T>> {
  if (res.status < 400)
    return {
      isError: false,
      loading: false,
      result: ready_body ? await res.json() : res.status,
      response: res,
    }
  else
    return {
      isError: true,
      loading: false,
      errorMessage: getErrorMessage(await res.json(), res.status).toString(),
      response: res,
    }
}
