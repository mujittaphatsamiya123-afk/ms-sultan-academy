import { z } from 'zod'

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  courseId: z.string().uuid().optional().nullable(),
  lessonContext: z.string().max(6000).optional(),
})

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export const couponSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9_-]+$/i, 'Only letters, numbers, - and _'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
})
