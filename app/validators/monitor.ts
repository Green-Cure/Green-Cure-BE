import vine from '@vinejs/vine'

export const createMonitorValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    information: vine.string().trim(),
    resultScannerId: vine.number().optional(),
  })
)
