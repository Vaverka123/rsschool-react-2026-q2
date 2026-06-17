import { z } from 'zod';

export const searchSchema = z.object({
  query: z
    .string()
    .max(50, 'Query must be 50 characters or less.')
    .refine(
      (v) => v.length === 0 || v.length >= 2,
      'Query must be at least 2 characters.'
    ),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
