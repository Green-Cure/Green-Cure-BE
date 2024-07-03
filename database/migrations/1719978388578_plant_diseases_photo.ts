import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PlantDiseasesPhoto extends BaseSchema {
  protected tableName = 'plant_diseases_photo'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('plant_diseases_id').notNullable()
      table.string('image').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
