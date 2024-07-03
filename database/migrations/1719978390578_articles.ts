import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Articles extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('author').index().notNullable()
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
