import type { HttpContext } from '@adonisjs/core/http'

import ForumPost from '#models/forum_post'
import { createForumPostsValidator, updateForumPostsValidator } from '#validators/forum_posts'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import ForumReplies from '#models/forum_replies'
import ReportedPost from '#models/reported_post'
import { reportValidation } from '#validators/report'
import ReportedPostReplies from '#models/reported_post_replies'

export default class ForumsController {
  async index({ response }: HttpContext) {
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

    const forums = await ForumPost.query()
      .where('user_id', userId)
      .preload('author')
      .preload('replies')

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display My Forums',
      data: forums.map((forum) => ({
        ...forum.serialize(),
        author: forum.author.serialize(),
        replies_count: forum.replies.length,
      })),
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
    let imageName: string | null = null
    if (data.image) {
      imageName = `${cuid()}.${data.image.extname}`
      data.image.move(app.makePath('uploads'), {
        name: imageName,
      })
    }
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
    let imageName: string | null = null
    const data = await request.validateUsing(createForumPostsValidator)
    if (data.image) {
      imageName = `${cuid()}.${data.image.extname}`
      data.image.move(app.makePath('uploads'), {
        name: imageName,
      })
    }
    ForumReplies.create({
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
  async destroyForumReplies({ params, response }: HttpContext) {
    const id = params.id
    const forumPost = await ForumReplies.findBy('id', id)
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
  async reportForum({ request, params, auth, response }: HttpContext) {
    const id = params.id
    const data = await request.validateUsing(reportValidation)
    ReportedPost.create({
      userId: auth.user!.id,
      forumPostId: id,
      reason: data.reason,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Report Successfully',
    })
  }
  async reportRepliesForum({ request, params, auth, response }: HttpContext) {
    const id = params.id
    const data = await request.validateUsing(reportValidation)
    ReportedPostReplies.create({
      userId: auth.user!.id,
      forumRepliesId: id,
      reason: data.reason,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Report Successfully',
    })
  }
  async allReport({ response }: HttpContext) {
    const reportedPosts = await ReportedPost.query().preload('user').preload('forum')

    const reportedReplies = await ReportedPostReplies.query().preload('user').preload('replies')

    const reports = [
      ...reportedPosts.map((post) => ({
        id: post.id,
        reportedBy: post.user,
        forum: post.forum,
        reason: post.reason,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        type: 'Forum',
      })),
      ...reportedReplies.map((replies) => ({
        id: replies.id,
        reportedBy: replies.user,
        replies: replies.replies,
        reason: replies.reason,
        createdAt: replies.createdAt,
        updatedAt: replies.updatedAt,
        type: 'Balasan Forum',
      })),
    ]

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Report',
      data: reports,
    })
  }

  async deleteReportReplies({ params, response }: HttpContext) {
    const id = params.id
    const reportReplies = await ReportedPostReplies.findBy('id', id)
    if (!reportReplies) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Report Reply not found',
      })
    }

    await reportReplies.delete()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Report Reply deleted!',
    })
  }
  async deleteReportForum({ params, response }: HttpContext) {
    const id = params.id
    const reportForum = await ReportedPost.findBy('id', id)
    if (!reportForum) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Report Forum not found',
      })
    }

    await reportForum.delete()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Report Forum deleted!',
    })
  }
}
