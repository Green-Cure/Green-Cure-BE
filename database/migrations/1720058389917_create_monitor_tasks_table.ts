import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monitor_tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('monitor_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('monitors')
        .onDelete('CASCADE')
      table.string('task').notNullable()
      table.string('description').notNullable()
      table.enu('status', ['waiting', 'done']).notNullable().defaultTo('waiting')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
