import { test } from '@japa/runner'

test.group('Authenticated', () => {
  test('user can register', async ({ client }) => {
    try {
      const response = await client.post('/v1/auth/register').json({
        name: 'John Doe',
        username: 'johndoe821',
        email: 'jod@example.com',
        password: 'password123',
        phone: '1234567890',
        role: '2',
      })

      response.assertStatus(200)
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  test('user failed register', async ({ client }) => {
    try {
      const response = await client.post('/v1/auth/register').json({
        name: null,
        username: 'johndoe',
        phone: '1234567890',
        email: 'jod@example.com',
        password: 'password123',
        role: '2',
      })

      response.assertStatus(422)
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  test('user can login', async ({ client }) => {
    try {
      const response = await client.post('/v1/auth/authenticated').json({
        email: 'jod@example.com',
        password: 'password123',
      })

      response.assertStatus(200)
    } catch (error) {
      console.error(error)
      throw error
    }
  })

  test('login fails with invalid credentials', async ({ client }) => {
    try {
      const response = await client.post('/v1/auth/authenticated').json({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      })

      response.assertStatus(401)
    } catch (error) {
      console.error(error)
      throw error
    }
  })
})
