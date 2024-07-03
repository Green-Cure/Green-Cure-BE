import vine from '@vinejs/vine'

export const login_validator = vine.compile(
  vine.object({
    email: vine.string().email().trim().minLength(6),
    password: vine.string().trim(),
  })
)
