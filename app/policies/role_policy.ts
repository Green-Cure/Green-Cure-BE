import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class RolePolicy extends BasePolicy {
  admin(user: User): AuthorizerResponse {
    return user.role === '1'
  }
  guest(user: User): AuthorizerResponse {
    return user.role === '2'
  }
  user(user: User): AuthorizerResponse {
    return user.role === '3'
  }
}
