import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ArticleTags extends BaseSchema {
  protected tableName = 'article_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.integer('tag_id').notNullable()
      table.integer('article_id').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
