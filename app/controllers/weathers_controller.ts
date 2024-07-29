import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class WeathersController {
  async today({ response }: HttpContext) {
    const options = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: { q: 'Jakarta' },
      headers: {
        'X-RapidAPI-Key': env.get('RAPID_API_KEY'),
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
      },
    }

    const weatherResponse = await axios.request(options)
    const weatherData = weatherResponse.data

    // Mengambil hanya kondisi cuaca dan suhu
    const currentCondition = weatherData.current.condition.text
    const currentTempC = weatherData.current.temp_c

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Today Weather',
      data: {
        condition: currentCondition,
        temperature: currentTempC,
      },
    })
  }
}
