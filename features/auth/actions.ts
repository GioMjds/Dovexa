"use server";

import { redirect } from "next/navigation";
import { publicEnv } from "@/env";
import { serverEnv } from "@/env.server";
import type { ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "./schemas";

export async function sendMagicLink(input: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      shouldCreateUser: serverEnv.ALLOW_SIGNUP,
    },
  });

  if (error) {
    return { ok: false, error: "Couldn't send the link. Try again." };
  }
  return { ok: true, data: undefined };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
