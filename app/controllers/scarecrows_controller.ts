import Scarecrow from '#models/scarecrow'
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class ScarecrowsController {
  async show({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const scarecrows = await Scarecrow.query().where('user_id', userId)

    const scarecrowsWithHtmlAnswers = scarecrows.map((scarecrow) => {
      const answerHtml = scarecrow.answer
        .replace(/\n/g, '<br>') // replace newline characters with <br> tags
        .replace(/\*(.*?)\*/g, '<b>$1</b>') // replace asterisks with <b> tags

      return {
        id: scarecrow.id,
        question: scarecrow.question,
        answer: `<div>${answerHtml}</div>`,
      }
    })

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Data',
      data: scarecrowsWithHtmlAnswers,
    })
  }
  async detail({ auth, response, params }: HttpContext) {
    const userId = auth.user!.id
    const scarecrowId = params.id

    const scarecrow = await Scarecrow.query()
      .where('user_id', userId)
      .where('id', scarecrowId)
      .first()

    if (!scarecrow) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Scarecrow not found',
      })
    }

    const answerHtml = scarecrow.answer
      .replace(/\n/g, '<br>') // replace newline characters with <br> tags
      .replace(/\*(.*?)\*/g, '<b>$1</b>') // replace asterisks with <b> tags

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display Scarecrow Data',
      data: {
        id: scarecrow.id,
        question: scarecrow.question,
        answer: `<div>${answerHtml}</div>`,
      },
    })
  }
  async generate({ request, response, auth }: HttpContext) {
    const text = request.input('text')
    const apiKey = process.env.GEMINI_TOKEN
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`
    const data = {
      contents: [
        {
          parts: [
            {
              text,
            },
          ],
        },
      ],
    }

    try {
      const apiResponse = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const generatedContent = apiResponse.data.candidates[0].content.parts[0].text
      const answerHtml = generatedContent
        .replace(/\n/g, '<br>') // replace newline characters with <br> tags
        .replace(/\*(.*?)\*/g, '<b>$1</b>') // replace asterisks with <b> tags

      const scarecrow = await Scarecrow.create({
        userId: auth.user!.id,
        question: text,
        answer: generatedContent,
      })

      return response.status(200).json({
        statusCode: 200,
        code: 'OK',
        message: 'Question Subbmitted',
        data: {
          id: scarecrow.id,
          question: scarecrow.question,
          answer: `<div>${answerHtml}</div>`,
        },
      })
    } catch (error) {
      return response.status(500).json({ error: 'Failed to generate content' })
    }
  }
}
