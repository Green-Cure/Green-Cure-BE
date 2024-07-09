import vine from '@vinejs/vine'

export const createArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    slug: vine.string().trim(),
    author: vine.number(),
    content: vine.string().trim(),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)

export const updateArticleValidator = vine.compile(
  vine.object({
    title: vine.string().trim(),
    author: vine.number(),
    slug: vine.string().trim(),
    content: vine.string().trim(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
