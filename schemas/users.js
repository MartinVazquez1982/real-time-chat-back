import z from 'zod'

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required'
  }).min(5).max(255),
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required'
  }).email(),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  }).min(1).max(255)
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}
