import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plant_diseases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('plant_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('plants')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
