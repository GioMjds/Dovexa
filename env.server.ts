import 'server-only';
import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ALLOW_SIGNUP: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
});

export const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  ALLOW_SIGNUP: process.env.ALLOW_SIGNUP,
});
