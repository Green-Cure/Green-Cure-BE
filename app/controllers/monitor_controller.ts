import Monitor from '#models/monitor'
import MonitorTask from '#models/monitor_task'
import { createMonitorValidator } from '#validators/monitor'
import { monitorTaskValidator } from '#validators/monitor_task'
import type { HttpContext } from '@adonisjs/core/http'

export default class MonitorController {
  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id
    const myMonitor = await Monitor.query()
      .where('user_id', userId)
      .preload('monitor_task', (taskQuery) => {
        taskQuery.limit(4)
      })
    return response.status(200).json({
      statusCode: 200,
      message: 'Display My Monitor',
      data: myMonitor,
    })
  }
  async show({ params, response }: HttpContext) {
    const id = params.id
    const monitors = await Monitor.query().where('id', id).preload('monitor_task')

    return response.status(200).json({
      statusCode: 200,
      message: 'Display Monitor Task Data',
      data: monitors,
    })
  }

  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createMonitorValidator)
    Monitor.create({
      name: data.name,
      information: data.information,
      userId: auth.user!.id,
      resultScannerId: data.resultScannerId || null,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Monitor Created',
    })
  }

  async storeMonitorTask({ request, response }: HttpContext) {
    const data = await request.validateUsing(monitorTaskValidator)
    MonitorTask.create({
      task: data.task,
      description: data.description,
      monitorId: data.monitorId,
    })
    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Task Created',
    })
  }

  async updateMonitorTask({ request, params, response }: HttpContext) {
    const data = await request.validateUsing(monitorTaskValidator)
    const monitorTask = await MonitorTask.findOrFail(params.id)

    if (data.task) {
      monitorTask.task = data.task
    }

    if (data.description) {
      monitorTask.description = data.description
    }

    await monitorTask.save()

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Task Updated',
    })
  }
  async deleteMonitorTask({ params, response }: HttpContext) {
    const monitorTask = await MonitorTask.findOrFail(params.id)
    await monitorTask.delete()

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Task Deleted',
    })
  }
  async doneTask({ params, response }: HttpContext) {
    const monitorTask = await MonitorTask.findOrFail(params.id)
    monitorTask.status = 'done'
    await monitorTask.save()

    return response.status(200).json({
      statusCode: 200,
      code: 'OK',
      message: 'Task Done',
    })
  }
}
