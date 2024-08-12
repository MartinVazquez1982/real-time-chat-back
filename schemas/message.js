import z from 'zod'

const messageSchema = z.object({
  message: z.string({
    invalid_type_error: 'Message must be a string',
    required_error: 'Message is required'
  }).min(1),
  date: z.date({
    invalid_type_error: 'Date must be in ISO format (yyyy-mm-ddThh:mm:ss)',
    required_error: 'Date is required'
  }),
  from: z.string({
    invalid_type_error: 'Message must be a string',
    required_error: 'Message is required'
  }).uuid({
    message: 'From must be a UUID'
  }),
  to: z.string({
    invalid_type_error: 'To must be a string',
    required_error: 'To is required'
  }).min(5).max(255)
})

export function validateMessage (object) {
  return messageSchema.safeParse(object)
}
