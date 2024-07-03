import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Plants extends BaseSchema {
  protected tableName = 'plants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('name').notNullable()
      table.string('photo').notNullable()
      table.json('type').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
