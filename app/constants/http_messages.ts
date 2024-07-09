const HttpMessages: Record<number, string> = {
  200: 'The request has been successfully processed.',
  201: 'Data has been successfully inserted.',
  202: 'The request has been successfully received and is being processed.',
  204: 'Data has been successfully deleted.',
  400: 'The request body does not contain valid data.',
  401: 'Unknown API key. Please check your API key and try again.',
  403: 'You do not have access to this resource.',
  404: 'The endpoint you are looking for seems to be not found.',
  406: 'The request you made is currently not supported.',
  422: 'Data cannot be processed as it is invalid.',
  429: 'Your API key request has exceeded usage limits.',
  500: 'An unexpected error occurred on the server side.',
}

export default HttpMessages
