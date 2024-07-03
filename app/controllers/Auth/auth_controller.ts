import User from '#models/user'
import { login_validator } from '#validators/login_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await login_validator.validate(data)
    try {
      const user = await User.verifyCredentials(payload.email, payload.password)
      const token = await User.accessTokens.create(user)
      return response.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Authenticated',
        data: [
          {
            token: token.value!.release(),
          },
        ],
      })
    } catch (error) {
      return response.status(401).json({
        status: false,
        statusCode: 401,
        message: 'Authentication failed. Invalid credentials.',
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.status(200).json({
      status: true,
      statusCode: 200,
      message: 'Logout Successfully.',
    })
  }

  async me({ auth, response }: HttpContext) {
    await auth.check()
    return response.status(200).json({
      status: false,
      statusCode: 200,
      message: 'Display All Data.',
      data: [
        {
          user: auth.user,
        },
      ],
    })
  }
}
