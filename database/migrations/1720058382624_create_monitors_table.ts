import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monitors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('result_scanner_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('result_scanners')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.enu('type', ['free', 'premium']).notNullable()
      table.text('information').notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
