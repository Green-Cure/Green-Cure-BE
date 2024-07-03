/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/Auth/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router
  .group(() => {
    router
      .group(() => {
        router.post('register', [AuthController, 'register'])
        router.post('authenticated', [AuthController, 'login'])
        router.delete('logout', [AuthController, 'logout']).use(middleware.auth())
        router.get('my', [AuthController, 'me'])
      })
      .prefix('auth')
  })
  .prefix('v1')
