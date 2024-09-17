import User from '#models/user'
import RolePolicy from '#policies/role_policy'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ bouncer, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('admin')) {
      return response.status(401).json({
        statusCode: 401,
        code: 'UNAUTHORIZED',
      })
    }
    const user = await User.all()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Data',
      data: user,
    })
  }
  async destroy({ bouncer, params, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('admin')) {
      return response.status(401).json({
        statusCode: 401,
        code: 'UNAUTHORIZED',
      })
    }
    const id = params.id
    const user = await User.findBy('id', id)
    if (!user) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Users not found',
      })
    }
    await user.delete()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'User deleted!',
    })
  }
}
