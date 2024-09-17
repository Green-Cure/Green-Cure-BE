import ForumPost from '#models/forum_post'
import Plant from '#models/plant'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ response }: HttpContext) {
    const forums = await ForumPost.query().count('*')
    const users = await User.query().count('*')
    const plant = await Plant.query().count('*')

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Data',
      data: [
        {
          forum_count: forums,
          users_count: users,
          plants_count: plant,
        },
      ],
    })
  }
}
