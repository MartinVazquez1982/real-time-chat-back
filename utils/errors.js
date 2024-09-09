import { logger } from './logger.js'

export class ClientError extends Error {
  constructor (message, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

export class ServerError extends Error {
  constructor (message, stack, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.stack = stack
    logger.info(stack)
  }
}
