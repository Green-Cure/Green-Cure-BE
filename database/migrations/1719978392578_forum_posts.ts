import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ForumPosts extends BaseSchema {
  protected tableName = 'forum_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('user_id').notNullable()
      table.text('content').notNullable()
      table.string('image').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
