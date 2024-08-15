import z from 'zod'

const userSchema = z.object({
  username: z.string({
    invalid_type_error: 'Username must be a string',
    required_error: 'Username is required'
  }).min(5, {
    message: 'Username must contain at least 5 characters'
  }).max(255, {
    message: 'Username must contain a maximum of 255 characters'
  }),
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required'
  }).email(),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  }).min(1, {
    message: 'Password must contain at least 5 characters'
  }).max(255, {
    message: 'Password must contain a maximum of 255 characters'
  })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}
