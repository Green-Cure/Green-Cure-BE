import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      name: 'Administrator',
      username: 'admin',
      email: 'developer@dev.com',
      password: 'Integrated17@',
      avatar: null,
      role: '1',
      phone: '0812312312',
      createdAt: DateTime.now(),
    })
  }
}
