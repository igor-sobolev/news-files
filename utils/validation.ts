import { z } from 'zod';

export const newsSubmissionSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters long.').max(120),
  excerpt: z.string().trim().min(12, 'Excerpt must be at least 12 characters long.').max(200),
  category: z.string().trim().min(3, 'Category is required.').max(40),
  author: z.string().trim().max(60).optional().or(z.literal('')),
  content: z.string().trim().min(80, 'Content must be at least 80 characters long.'),
});

export type NewsSubmissionInput = z.infer<typeof newsSubmissionSchema>;

export function validateNewsSubmission(input: unknown) {
  return newsSubmissionSchema.safeParse(input);
}