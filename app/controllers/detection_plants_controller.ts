import ResultScanner from '#models/result_scanner'
import { createScannerValidator } from '#validators/scanner'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

export default class DetectionPlantsController {
  async scanner({ request, auth, response }: HttpContext) {
    const plantDiseases = JSON.parse([
      {
        diseases: 'Hawar Daun',
        description:
          'Penyakit ini disebabkan oleh jamur yang menyerang daun tanaman, menyebabkan daun menguning dan layu.',
        symptoms: [
          'Bercak cokelat pada daun',
          'Daun menguning dan kering',
          'Tanaman terlihat lemah',
        ],
        solutions: [
          'Gunakan fungisida yang sesuai',
          'Hindari kelembapan berlebih',
          'Pangkas daun yang terinfeksi',
        ],
      },
    ])
    const data = await request.validateUsing(createScannerValidator)
    const imageName = `${cuid()}.${data.image.extname}`

    data.image.move(app.makePath('uploads'), {
      name: imageName,
    })

    // Simpan data ke dalam database
    const resultScanner = await ResultScanner.create({
      userId: auth.user!.id,
      image: imageName,
      plant_diseases: JSON.stringify(plantDiseases),
    })

    // Kembalikan respons beserta data yang baru saja dibuat
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Image uploaded and data saved successfully!',
      data: resultScanner, // Tampilkan data yang baru dibuat
    })
  }
  async myScan({ auth, response }: HttpContext) {
    const userId = auth.user!.id

    const myResultScanner = await ResultScanner.query().where('user_id', userId)

    return response.status(200).json({
      statusCode: 200,
      message: 'Display My History Scan',
      data: myResultScanner,
    })
  }
  async show({ params, response }: HttpContext) {
    try {
      const resultScanner = await ResultScanner.findBy('id', params.id)
      return response.status(200).json({
        statusCode: 200,
        message: 'Display Result Scanner Data',
        data: resultScanner,
      })
    } catch (error) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Result Scanner Not Found',
      })
    }
  }
}
