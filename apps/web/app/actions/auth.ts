"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function signOutAction() {
  const result = await createSupabaseServerClient();
  if (result.status === "READY") {
    await result.client.auth.signOut({ scope: "local" });
  }

  redirect("/account/sign-in");
}
