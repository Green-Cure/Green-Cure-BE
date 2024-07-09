import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import HttpCodes from '#constants/http_codes'
import HttpMessages from '#constants/http_messages'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    // return super.handle(error, ctx)
    const statusCode = (error as any).status || 200
    const code = HttpCodes[statusCode]
    const message = (error as any).message || HttpMessages[statusCode] || HttpMessages[200]
    const messages = (error as any).messages
    return ctx.response.status(statusCode).send({ statusCode, code, message, messages })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
