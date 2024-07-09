/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { sep, normalize } from 'node:path'
import app from '@adonisjs/core/services/app'
import { middleware } from './kernel.js'

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
router
  .group(() => {
    router
      .group(() => {
        router.post('register', '#controllers/auth/auth_controller.register')
        router.post('authenticated', '#controllers/auth/auth_controller.login')
        router.delete('logout', '#controllers/auth/auth_controller.logout').use(middleware.auth())
        router.get('my', '#controllers/auth/auth_controller.me').use(middleware.auth())
      })
      .prefix('auth')
    router.group(() => {
      router.get('articles', '#controllers/articles_controller.index')
      router.get('articles/:slug', '#controllers/articles_controller.show')
      router.post('articles', '#controllers/articles_controller.store').use(middleware.auth())
      router.put('articles/:slug', '#controllers/articles_controller.update').use(middleware.auth())
      router
        .delete('articles/:slug', '#controllers/articles_controller.destroy')
        .use(middleware.auth())
    })
  })
  .prefix('v1')
