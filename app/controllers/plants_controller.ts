import Plant from '#models/plant'
import { createPlantValidator, updatePlantValidator } from '#validators/plant'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class PlantsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const plants = await Plant.query().paginate(page, limit)

    const meta = {
      total: plants.total,
      perPage: limit,
      currentPage: page,
      lastPage: plants.lastPage,
    }

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Data',
      data: plants.toJSON().data,
      meta: meta,
    })
  }
  async show({ params, response }: HttpContext) {
    try {
      const plant = await Plant.findBy('id', params.id)
      return response.status(200).json({
        statusCode: 200,
        code: 'OK',
        message: 'Display Plant Data',
        data: plant,
      })
    } catch (error) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Plant Not Found',
      })
    }
  }
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createPlantValidator)
    const imageName = `${cuid()}.${data.image.extname}`
    data.image.move(app.makePath('uploads'), {
      name: imageName,
    })
    Plant.create({
      name: data.name,
      latin: data.latin,
      description: data.description,
      image: imageName,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Plant Created',
    })
  }
  async update({ request, response, params }: HttpContext) {
    const data = await request.validateUsing(updatePlantValidator)
    const id = params.id
    const plant = await Plant.findBy('id', id)
    if (!plant) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Plant not found',
      })
    }

    plant.name = data.name
    plant.latin = data.latin
    plant.description = data.description
    if (data.image) {
      const imageName = `${cuid()}.${data.image.extname}`
      data.image.move(app.makePath('uploads'), {
        name: imageName,
      })
      if (plant.image) {
        const oldImagePath = app.makePath(`uploads/${plant.image}`)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      plant.image = imageName
    }

    await plant.save()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Plant updated',
    })
  }
  async destroy({ params, response }: HttpContext) {
    const id = params.id
    const plant = await Plant.findBy('id', id)
    if (!plant) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Plant not found',
      })
    }
    if (plant.image) {
      const oldImagePath = app.makePath(`uploads/${plant.image}`)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }
    await plant.delete()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Plant deleted!',
    })
  }
}
