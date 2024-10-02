import { z } from 'zod'

const CreatePostSchema = z.object({
  username: z.string(),
  title: z.string(),
  subtitle: z.string(),
  content: z.string(),
  imageUrl: z.string(),
})

type CreatePostType = z.infer<typeof CreatePostSchema>

export { CreatePostSchema, type CreatePostType }

