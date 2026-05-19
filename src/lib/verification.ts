import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type VerificationRecord = {
  id: string;
  user_id: string;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  phone_number: string | null;
  email_otp_code?: string | null;
  email_otp_expires_at?: string | null;
  phone_otp_code?: string | null;
  phone_otp_expires_at?: string | null;
};

export function sixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function showDevOtp(code: string, label: string) {
  if (import.meta.env.DEV || import.meta.env.VITE_DEV_SHOW_OTP === "true") {
    // Lazy import avoids circular deps; callers may use toast from sonner directly instead.
    void import("sonner").then(({ toast }) => {
      toast.info(`${label}: ${code}`, { duration: 120_000 });
    });
  }
}

export function isEmailVerified(user: User | null, record: VerificationRecord | null): boolean {
  return Boolean(user?.email_confirmed_at || record?.email_verified);
}

export function isPhoneVerified(record: VerificationRecord | null): boolean {
  return Boolean(record?.phone_verified);
}

export function isFullyVerified(user: User | null, record: VerificationRecord | null): boolean {
  return isEmailVerified(user, record) && isPhoneVerified(record);
}

export async function ensureVerificationRecord(userId: string): Promise<VerificationRecord> {
  const { data: existing, error: selErr } = await supabase
    .from("verification_records")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (selErr) throw selErr;
  if (existing) return existing as VerificationRecord;

  const { data: inserted, error: insErr } = await supabase
    .from("verification_records")
    .insert({ user_id: userId })
    .select()
    .single();

  if (insErr) {
    if (insErr.code === "23505") {
      const { data: again, error: rErr } = await supabase
        .from("verification_records")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (rErr) throw rErr;
      return again as VerificationRecord;
    }
    throw insErr;
  }

  return inserted as VerificationRecord;
}

export async function fetchVerificationRecord(userId: string): Promise<VerificationRecord | null> {
  const { data, error } = await supabase
    .from("verification_records")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as VerificationRecord) ?? null;
}

export async function syncEmailConfirmedFromAuth(user: User): Promise<void> {
  if (!user.email_confirmed_at) return;
  await supabase.from("verification_records").update({ email_verified: true }).eq("user_id", user.id);
}
