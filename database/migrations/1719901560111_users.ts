import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('username').notNullable()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.string('avatar')
      table.string('phone').notNullable()
      table.enu('role', ['1', '2', '3']).notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
