import { supabase } from "@/lib/supabase";

export type OAuthProvider = "google" | "facebook" | "apple";

export async function signInWithOAuth(provider: OAuthProvider) {
  const redirectTo = `${window.location.origin}/dashboard`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw error;
}
