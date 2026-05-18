import { supabase } from "@/lib/supabase";

export type OAuthProvider = "google" | "facebook";

/** Must match Supabase → Authentication → URL Configuration → Redirect URLs */
function getOAuthRedirectUrl() {
  const base = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, "");
  return `${base}/dashboard`;
}

export async function signInWithOAuth(provider: OAuthProvider) {
  const redirectTo = getOAuthRedirectUrl();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw error;
}