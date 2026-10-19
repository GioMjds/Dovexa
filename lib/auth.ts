import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthUser = { id: string; email: string };

/** Verified user from the JWT claims, or null. Cached per request. */
export const getUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) return null;

  return { id: claims.sub, email: claims.email ?? "" };
});

/**
 * Call first in every page, Server Action, and route handler.
 * Then scope every Prisma query with `where: { userId: user.id }`.
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}
