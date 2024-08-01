import vine from '@vinejs/vine'

export const createPlantDiseasesValidator = vine.compile(
  vine.object({
    description: vine.string().trim(),
    name: vine.string().trim(),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)

export const updatePlantDiseasesValidator = vine.compile(
  vine.object({
    description: vine.string().trim(),
    name: vine.string().trim(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
