import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ArticleImages extends BaseSchema {
  protected tableName = 'article_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('article_id').notNullable()
      table.string('image').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
