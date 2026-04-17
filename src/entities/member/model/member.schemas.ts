import { z } from 'zod'

const socialLinksSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  telegram: z.string().optional(),
})

export const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  photo: z.string().url(),
  skills: z.array(z.string()),
  social: socialLinksSchema,
  email: z.string().email().optional(),
})

export const membersListSchema = z.array(memberSchema)

export type Member = z.infer<typeof memberSchema>
export type SocialLinks = z.infer<typeof socialLinksSchema>
