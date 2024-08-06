import vine from '@vinejs/vine'

export const monitorTaskValidator = vine.compile(
  vine.object({
    monitorId: vine.number(),
    task: vine.string().trim(),
    description: vine.string().trim(),
  })
)
