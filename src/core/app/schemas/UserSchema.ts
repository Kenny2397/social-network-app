import { z } from 'zod'

const CreateUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  birthDate: z.string()
})

type CreateUserType = z.infer<typeof CreateUserSchema>

export { CreateUserSchema, type CreateUserType }

