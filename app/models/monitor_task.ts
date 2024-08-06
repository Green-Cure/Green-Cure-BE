import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Monitor from './monitor.js'

export default class MonitorTask extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare monitorId: number

  @column()
  declare task: string

  @column()
  declare description: string

  @column()
  declare status: 'waiting' | 'done'

  @belongsTo(() => Monitor)
  declare monitor: BelongsTo<typeof Monitor>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
