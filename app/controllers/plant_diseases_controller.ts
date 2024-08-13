import PlantDisease from '#models/plant_disease'
import RolePolicy from '#policies/role_policy'
import {
  createPlantDiseasesValidator,
  updatePlantDiseasesValidator,
} from '#validators/plant_diseases'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class PlantsDiseases {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const plantsDiseases = await PlantDisease.query().paginate(page, limit)

    const meta = {
      total: plantsDiseases.total,
      perPage: limit,
      currentPage: page,
      lastPage: plantsDiseases.lastPage,
    }

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Display All Data',
      data: plantsDiseases.toJSON().data,
      meta: meta,
    })
  }
  async show({ params, response }: HttpContext) {
    try {
      const plantDiseases = await PlantDisease.findBy('id', params.id)
      return response.status(200).json({
        statusCode: 200,
        code: 'OK',
        message: 'Display Plant Data',
        data: plantDiseases,
      })
    } catch (error) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Plant Not Found',
      })
    }
  }
  async store({ bouncer, request, response }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('admin')) {
      return response.status(401).json({
        statusCode: 401,
        code: 'UNAUTHORIZED',
      })
    }
    const data = await request.validateUsing(createPlantDiseasesValidator)
    const imageName = `${cuid()}.${data.image.extname}`
    data.image.move(app.makePath('uploads'), {
      name: imageName,
    })
    PlantDisease.create({
      name: data.name,
      description: data.description,
      image: imageName,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Plant Created',
    })
  }
  async update({ bouncer, request, response, params }: HttpContext) {
    if (await bouncer.with(RolePolicy).denies('admin')) {
      return response.status(401).json({
        statusCode: 401,
        code: 'UNAUTHORIZED',
      })
    }
    const data = await request.validateUsing(updatePlantDiseasesValidator)
    const id = params.id
    const plantDiseases = await PlantDisease.findBy('id', id)
    if (!plantDiseases) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Plant not found',
      })
    }

    plantDiseases.name = data.name
    plantDiseases.description = data.description
    if (data.image) {
      const imageName = `${cuid()}.${data.image.extname}`
      data.image.move(app.makePath('uploads'), {
        name: imageName,
      })
      if (plantDiseases.image) {
        const oldImagePath = app.makePath(`uploads/${plantDiseases.image}`)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      plantDiseases.image = imageName
    }

    await plantDiseases.save()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Plant updated',
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
    const plantDiseases = await PlantDisease.findBy('id', id)
    if (!plantDiseases) {
      return response.status(404).json({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Plant not found',
      })
    }
    if (plantDiseases.image) {
      const oldImagePath = app.makePath(`uploads/${plantDiseases.image}`)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }
    await plantDiseases.delete()
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Plant deleted!',
    })
  }
}
