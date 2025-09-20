import { z } from "zod";

export const createDatabaseSchema = z.object({
  name: z
    .string()
    .min(1, "Database name is required")
    .max(100, "Database name must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Database name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  isPublic: z.boolean().default(false),

  icon: z.string().max(100, "Icon must be less than 100 characters").optional(),

  cover: z
    .string()
    .max(500, "Cover URL must be less than 500 characters")
    .optional(),
});

export const updateDatabaseSchema = createDatabaseSchema.partial();

export type CreateDatabaseFormData = z.infer<typeof createDatabaseSchema>;
export type UpdateDatabaseFormData = z.infer<typeof updateDatabaseSchema>;
