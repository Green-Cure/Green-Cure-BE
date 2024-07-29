import type { HttpContext } from '@adonisjs/core/http'

import ForumPost from '#models/forum_post'
import { createForumPostsValidator, updateForumPostsValidator } from '#validators/forum_posts'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import ForumReply from '#models/forum_reply'

export default class ForumsController {
  async index({ response }: HttpContext) {
    // Memuat relasi pengguna dari setiap postingan forum
    const forums = await ForumPost.query().preload('author').preload('replies')

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Data',
      data: forums.map((forum) => ({
        ...forum.serialize(),
        author: forum.author.serialize(),
        replies_count: forum.replies.length,
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
    const forumPost = await ForumPost.query()
      .where('id', params.id)
      .preload('replies', (repliesQuery) => {
        repliesQuery.preload('author')
      })
      .preload('author')
      .firstOrFail()

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display Forum Post Data',
      data: {
        ...forumPost.serialize(),
        author: forumPost.author.serialize(),
        replies: forumPost.replies.map((reply) => ({
          ...reply.serialize(),
          author: reply.author.serialize(),
        })),
      },
    })
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
  async replies({ request, params, auth, response }: HttpContext) {
    const id = params.id
    const data = await request.validateUsing(createForumPostsValidator)
    const imageName = `${cuid()}.${data.image.extname}`
    data.image.move(app.makePath('uploads'), {
      name: imageName,
    })
    ForumReply.create({
      userId: auth.user!.id,
      forumPostId: id,
      content: data.content,
      image: imageName,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Reply Successfully',
    })
  }
  async destroyForumReply({ params, response }: HttpContext) {
    const id = params.id
    const forumPost = await ForumReply.findBy('id', id)
    if (!forumPost) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Forum Reply not found',
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
      message: 'Forum Reply deleted!',
    })
  }
}
