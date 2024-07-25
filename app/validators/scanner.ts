import vine from '@vinejs/vine'

export const createScannerValidator = vine.compile(
  vine.object({
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)
