"use server";

import { requireUser, getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/action-result";

export type ContactSearchResult = {
  id: string;
  firstName: string;
  lastName: string | null;
  nickname: string | null;
  title: string | null;
  organizationName: string | null;
  lastContactedAt: string | null;
};

export async function searchContactsAction(
  query: string = ""
): Promise<ActionResult<ContactSearchResult[]>> {
  const user = await getUser();

  if (!user) {
    // Return empty array if not logged in
    return { ok: true, data: [] };
  }

  const trimmed = query.trim();

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        userId: user.id,
        archivedAt: null,
        ...(trimmed
          ? {
              OR: [
                { firstName: { contains: trimmed, mode: "insensitive" } },
                { lastName: { contains: trimmed, mode: "insensitive" } },
                { nickname: { contains: trimmed, mode: "insensitive" } },
                {
                  organization: {
                    name: { contains: trimmed, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickname: true,
        title: true,
        lastContactedAt: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { lastContactedAt: "desc" },
        { updatedAt: "desc" },
      ],
      take: 20,
    });

    const formatted: ContactSearchResult[] = contacts.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      nickname: c.nickname,
      title: c.title,
      organizationName: c.organization?.name ?? null,
      lastContactedAt: c.lastContactedAt?.toISOString() ?? null,
    }));

    return { ok: true, data: formatted };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search contacts";
    return { ok: false, error: message };
  }
}
