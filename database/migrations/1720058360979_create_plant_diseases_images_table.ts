import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plant_diseases_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('plant_diseases_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('plant_diseases')
        .onDelete('CASCADE')
      table.string('image').notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
