import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ReportedPostReplies extends BaseSchema {
  protected tableName = 'reported_post_replies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('forum_post_id').notNullable()
      table.bigInteger('user_id').notNullable()
      table.text('reason').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
