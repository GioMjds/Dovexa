import { z } from "zod";

export const interactionTypeSchema = z.enum([
  "CALL",
  "MEETING",
  "MESSAGE",
  "EMAIL",
  "OTHER",
]);

export type InteractionType = z.infer<typeof interactionTypeSchema>;

export const createInteractionSchema = z.object({
  contactId: z.uuid("Invalid contact ID"),
  type: interactionTypeSchema.default("MEETING"),
  summary: z
    .string()
    .trim()
    .min(1, "Summary is required")
    .max(5000, "Summary cannot exceed 5000 characters"),
  occurredAt: z.coerce.date().default(() => new Date()),
  nextFollowUpAt: z.coerce.date().nullable().optional(),
});

export type CreateInteractionInput = z.infer<typeof createInteractionSchema>;
