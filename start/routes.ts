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
    router.group(() => {
      router.get('forum', '#controllers/forums_controller.index').use(middleware.auth())
      router.get('forum/my', '#controllers/forums_controller.getMyForum').use(middleware.auth())
      router.get('forum/:id', '#controllers/forums_controller.show').use(middleware.auth())
      router.post('forum', '#controllers/forums_controller.store').use(middleware.auth())
      router.put('forum/:id', '#controllers/forums_controller.update').use(middleware.auth())
      router.delete('forum/:id', '#controllers/forums_controller.destroy').use(middleware.auth())
      router.get('report', '#controllers/forums_controller.allReport').use(middleware.auth())
      router
        .post('report/forum/:id', '#controllers/forums_controller.reportForum')
        .use(middleware.auth())
      router
        .post('report/replies/:id', '#controllers/forums_controller.reportRepliesForum')
        .use(middleware.auth())
      router
        .delete('replies/:id', '#controllers/forums_controller.destroyForumReplies')
        .use(middleware.auth())
      router
        .post('forum/:id/replies', '#controllers/forums_controller.replies')
        .use(middleware.auth())
    })
    router.group(() => {
      router.get('plants', '#controllers/plants_controller.index')
      router.get('plants/:id', '#controllers/plants_controller.show')
      router.post('plants', '#controllers/plants_controller.store').use(middleware.auth())
      router.put('plants/:id', '#controllers/plants_controller.update').use(middleware.auth())
      router.delete('plants/:id', '#controllers/plants_controller.destroy').use(middleware.auth())
    })
    router.group(() => {
      router.get('plant-diseases', '#controllers/plant_diseases_controller.index')
      router.get('plant-diseases/:id', '#controllers/plant_diseases_controller.show')
      router
        .post('plant-diseases', '#controllers/plant_diseases_controller.store')
        .use(middleware.auth())
      router
        .put('plant-diseases/:id', '#controllers/plant_diseases_controller.update')
        .use(middleware.auth())
      router
        .delete('plant-diseases/:id', '#controllers/plant_diseases_controller.destroy')
        .use(middleware.auth())
    })
    router.group(() => {
      router.post('scan', '#controllers/detection_plants_controller.scanner').use(middleware.auth())
      router
        .get('scan/result', '#controllers/detection_plants_controller.myScan')
        .use(middleware.auth())
      router
        .get('scan/result/:id', '#controllers/detection_plants_controller.show')
        .use(middleware.auth())
    })
    router.group(() => {
      router.get('user', '#controllers/user_controller.index').use(middleware.auth())
    })
    router.get('weather-today', '#controllers/weathers_controller.today')
  })
  .prefix('v1')

router.get('/uploads/*', ({ request, response }) => {
  const filePath = request.param('*').join(sep)
  const normalizedPath = normalize(filePath)

  if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
    return response.badRequest('Malformed path')
  }

  const absolutePath = app.makePath('uploads', normalizedPath)
  return response.download(absolutePath)
})
