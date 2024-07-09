import Article from '#models/article'
import { createArticleValidator, updateArticleValidator } from '#validators/article'
import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class ArticlesController {
  async index({ response }: HttpContext) {
    const articles = await Article.all()
    return response.status(200).json({
      statusCode: 200,
      message: 'Display All Data',
      data: articles,
    })
  }

  async show({ params, response }: HttpContext) {
    try {
      const article = await Article.findBy('slug', params.slug)
      return response.status(200).json({
        statusCode: 200,
        message: 'Display Article Data',
        data: article,
      })
    } catch (error) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Article Not Found',
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createArticleValidator)
    const imageName = `${cuid()}.${data.image.extname}`
    data.image.move(app.makePath('uploads'), {
      name: imageName,
    })
    Article.create({
      title: data.title,
      slug: data.slug,
      userId: data.author,
      content: data.content,
      image: imageName,
    })
    return response.status(200).json({
      statusCode: 200,
      message: 'Article Created!',
    })
  }

  async update({ request, response, params }: HttpContext) {
    const data = await request.validateUsing(updateArticleValidator)
    const slug = params.slug
    const article = await Article.findBy('slug', slug)
    if (!article) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Article not found',
      })
    }
    article.title = data.title
    article.content = data.content
    if (data.image) {
      const imageName = `${cuid()}.${data.image.extname}`
      data.image.move(app.makePath('uploads'), {
        name: imageName,
      })
      if (article.image) {
        const oldImagePath = app.makePath(`uploads/${article.image}`)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      article.image = imageName
    }

    await article.save()
    return response.status(200).json({
      statusCode: 200,
      message: 'Article updated!',
    })
  }
  async destroy({ params, response }: HttpContext) {
    const slug = params.slug
    const article = await Article.findBy('slug', slug)
    if (!article) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Article not found',
      })
    }
    if (article.image) {
      const oldImagePath = app.makePath(`uploads/${article.image}`)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }
    await article.delete()
    return response.status(200).json({
      statusCode: 200,
      message: 'Article deleted!',
    })
  }
}
