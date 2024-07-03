import vine from '@vinejs/vine'

const password = vine.string().minLength(8)
export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(8),
    username: vine.string().trim().minLength(8),
    phone: vine.string().trim().minLength(8),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const match = await db.from('users').select('id').where('email', value).first()
        return !match
      }),
    password,
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().minLength(6),
    password: password,
  })
)
