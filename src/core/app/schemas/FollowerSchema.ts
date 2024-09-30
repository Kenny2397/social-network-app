import { z } from 'zod'

const SetFollowerSchema = z.object({
  followedUsername: z.string(),
  followingUsername: z.string()
})

type SetFollowerType = z.infer<typeof SetFollowerSchema>

export { SetFollowerSchema, type SetFollowerType }

