import { z } from 'zod';


export const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

export const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
});


export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(6),
});


export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
});
