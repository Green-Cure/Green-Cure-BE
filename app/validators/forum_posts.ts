import vine from '@vinejs/vine'

export const createForumPostsValidator = vine.compile(
  vine.object({
    content: vine.string().trim(),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })
)

export const updateForumPostsValidator = vine.compile(
  vine.object({
    content: vine.string().trim(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
