'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from '@/lib/action-result';
import {
  createInteractionSchema,
  type CreateInteractionInput,
} from './schemas';

export type LoggedInteractionResult = {
  id: string;
  contactId: string;
  type: string;
  summary: string;
  occurredAt: string;
  taskId?: string;
};

export async function logInteractionAction(
  input: unknown,
): Promise<ActionResult<LoggedInteractionResult>> {
  const user = await requireUser();
  const parsed = createInteractionSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? 'Invalid interaction data';
    return { ok: false, error: issue };
  }

  const { contactId, type, summary, occurredAt, nextFollowUpAt } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify contact ownership
      const contact = await tx.contact.findFirst({
        where: { id: contactId, userId: user.id },
        select: { id: true, firstName: true, lastName: true },
      });

      if (!contact) {
        throw new Error('Contact not found or unauthorized');
      }

      // 2. Create interaction record
      const interaction = await tx.interaction.create({
        data: {
          userId: user.id,
          contactId,
          type,
          summary,
          occurredAt,
        },
      });

      // 3. Update contact denormalized lastContactedAt (D7 in CONTEXT.md)
      await tx.contact.update({
        where: { id: contactId, userId: user.id },
        data: { lastContactedAt: occurredAt },
      });

      // 4. Optional: create follow-up task
      let createdTask = null;
      if (nextFollowUpAt) {
        const contactFullName = [contact.firstName, contact.lastName]
          .filter(Boolean)
          .join(' ');

        createdTask = await tx.task.create({
          data: {
            userId: user.id,
            contactId,
            title: `Follow up with ${contactFullName}`,
            dueAt: nextFollowUpAt,
            status: 'OPEN',
          },
        });
      }

      return {
        id: interaction.id,
        contactId: interaction.contactId,
        type: interaction.type,
        summary: interaction.summary,
        occurredAt: interaction.occurredAt.toISOString(),
        taskId: createdTask?.id,
      };
    });

    return { ok: true, data: result };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to log interaction';
    return { ok: false, error: message };
  }
}

export async function deleteInteractionAction(
  interactionId: string,
): Promise<ActionResult> {
  const user = await requireUser();

  try {
    await prisma.$transaction(async (tx) => {
      const interaction = await tx.interaction.findFirst({
        where: { id: interactionId, userId: user.id },
      });

      if (!interaction) {
        throw new Error('Interaction not found');
      }

      await tx.interaction.delete({
        where: { id: interactionId, userId: user.id },
      });

      // Recompute latest lastContactedAt
      const latestInteraction = await tx.interaction.findFirst({
        where: { contactId: interaction.contactId, userId: user.id },
        orderBy: { occurredAt: 'desc' },
        select: { occurredAt: true },
      });

      await tx.contact.update({
        where: { id: interaction.contactId, userId: user.id },
        data: { lastContactedAt: latestInteraction?.occurredAt ?? null },
      });
    });

    return { ok: true, data: undefined };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete interaction';
    return { ok: false, error: message };
  }
}
