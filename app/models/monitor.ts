import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ResultScanner from './result_scanner.js'
import MonitorTask from './monitor_task.js'
import User from './user.js'

export default class Monitor extends BaseModel {
  @hasMany(() => MonitorTask)
  declare monitor_task: HasMany<typeof MonitorTask>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  @column()
  declare resultScannerId: number | null

  @belongsTo(() => ResultScanner)
  declare resultScanner: BelongsTo<typeof ResultScanner>

  @column()
  declare name: string

  @column()
  declare information: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @column.dateTime()
  declare deletedAt: DateTime | null
}
