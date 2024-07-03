import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PlantDiseases extends BaseSchema {
  protected tableName = 'plant_diseases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('plant_id').notNullable()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
