import vine from '@vinejs/vine'

export const createPlantValidator = vine.compile(
  vine.object({
    description: vine.string().trim(),
    latin: vine.string().trim(),
    name: vine.string().trim(),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)

export const updatePlantValidator = vine.compile(
  vine.object({
    description: vine.string().trim(),
    latin: vine.string().trim(),
    name: vine.string().trim(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
