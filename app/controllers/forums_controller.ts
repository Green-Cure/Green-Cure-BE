import type { HttpContext } from '@adonisjs/core/http'

import ForumPost from '#models/forum_post'
import { createForumPostsValidator, updateForumPostsValidator } from '#validators/forum_posts'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class ForumsController {
  async index({ response }: HttpContext) {
    // Memuat relasi pengguna dari setiap postingan forum
    const forums = await ForumPost.query().preload('author')

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Data',
      data: forums.map((forum) => ({
        ...forum.serialize(),
        author: forum.author.serialize(),
      })),
    })
  }

  async getMyForum({ auth, response }: HttpContext) {
    const userId = auth.user!.id

    const forums = await ForumPost.query().where('user_id', userId)

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display My Forum Posts',
      data: forums,
    })
  }

  async show({ params, response }: HttpContext) {
    try {
      const forumPost = await ForumPost.findBy('id', params.id)
      return response.status(200).json({
        statusCode: 200,
        code: 'OK',
        message: 'Display Forum Post Data',
        data: forumPost,
      })
    } catch (error) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Forum Post Not Found',
      })
    }
  }

  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createForumPostsValidator)
    const imageName = `${cuid()}.${data.image.extname}`
    data.image.move(app.makePath('uploads'), {
      name: imageName,
    })
    ForumPost.create({
      userId: auth.user!.id,
      content: data.content,
      image: imageName,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Forum Created',
    })
  }
  async update({ request, response, params }: HttpContext) {
    const data = await request.validateUsing(updateForumPostsValidator)
    const id = params.id
    const forumPost = await ForumPost.findBy('id', id)
    if (!forumPost) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Forum Post not found',
      })
    }

    forumPost.content = data.content
    if (data.image) {
      const imageName = `${cuid()}.${data.image.extname}`
      data.image.move(app.makePath('uploads'), {
        name: imageName,
      })
      if (forumPost.image) {
        const oldImagePath = app.makePath(`uploads/${forumPost.image}`)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      forumPost.image = imageName
    }

    await forumPost.save()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Forum Post updated',
    })
  }
  async destroy({ params, response }: HttpContext) {
    const id = params.id
    const forumPost = await ForumPost.findBy('id', id)
    if (!forumPost) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Forum Post not found',
      })
    }
    if (forumPost.image) {
      const oldImagePath = app.makePath(`uploads/${forumPost.image}`)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }
    await forumPost.delete()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Forum Post deleted!',
    })
  }
}
