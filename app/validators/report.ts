import vine from '@vinejs/vine'

export const reportValidation = vine.compile(
  vine.object({
    reason: vine.string().trim(),
  })
)
