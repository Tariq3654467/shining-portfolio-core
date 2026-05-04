import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Phone, Loader as Loader2, CircleCheck as CheckCircle } from "lucide-react";

type VerificationRecord = {
  id: string;
  user_id: string;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  phone_number: string | null;
  verification_code?: string | null;
  code_expires_at?: string | null;
  email_otp_code?: string | null;
  email_otp_expires_at?: string | null;
  phone_otp_code?: string | null;
  phone_otp_expires_at?: string | null;
};

function sixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function showDevOtp(code: string, label: string) {
  if (import.meta.env.DEV || import.meta.env.VITE_DEV_SHOW_OTP === "true") {
    toast.info(`${label}: ${code}`, { duration: 120_000 });
  }
}

async function ensureVerificationRecord(userId: string): Promise<VerificationRecord> {
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

async function fetchVerificationRow(userId: string): Promise<VerificationRecord | null> {
  const { data, error } = await supabase.from("verification_records").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return (data as VerificationRecord) ?? null;
}

const Verification = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [verification, setVerification] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingPhone, setSendingPhone] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const refreshVerification = useCallback(async (userId: string) => {
    const row = await fetchVerificationRow(userId);
    setVerification(row);
    if (row?.phone_number) setPhoneNumber(row.phone_number);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (!u) {
          navigate("/login");
          return;
        }
        setUser(u);

        await ensureVerificationRecord(u.id);

        if (u.email_confirmed_at) {
          await supabase.from("verification_records").update({ email_verified: true }).eq("user_id", u.id);
        }

        await refreshVerification(u.id);
      } catch (e: unknown) {
        console.error(e);
        const msg = e instanceof Error ? e.message : "Failed to load verification";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate, refreshVerification]);

  const sendEmailVerification = async () => {
    if (!user) return;

    setSendingEmail(true);
    try {
      await ensureVerificationRecord(user.id);

      const code = sixDigitCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("verification_records")
        .update({
          email_otp_code: code,
          email_otp_expires_at: expiresAt,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      const { data: fnResult, error: fnError } = await supabase.functions.invoke("send-verification-email", {
        body: { code },
      });

      const emailed =
        !fnError &&
        fnResult &&
        typeof fnResult === "object" &&
        "emailed" in fnResult &&
        (fnResult as { emailed?: boolean }).emailed === true;

      if (emailed) {
        toast.success(`We sent a 6-digit code to ${user.email}`);
      } else {
        toast.warning(
          fnError?.message ??
            "Email was not sent (deploy send-verification-email and set RESEND_API_KEY on the project, or use dev OTP)."
        );
        showDevOtp(code, "Email verification code");
      }

      setEmailCode("");
      await refreshVerification(user.id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send code";
      toast.error(msg);
    } finally {
      setSendingEmail(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!user) return;
    const trimmed = emailCode.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      toast.error("Enter the 6-digit code");
      return;
    }

    setVerifyingEmail(true);
    try {
      const record = await fetchVerificationRow(user.id);
      if (!record) {
        toast.error("No verification record found");
        return;
      }

      if (record.email_otp_code !== trimmed) {
        toast.error("Invalid verification code");
        return;
      }

      if (!record.email_otp_expires_at || new Date(record.email_otp_expires_at) < new Date()) {
        toast.error("Code expired. Request a new one.");
        return;
      }

      const { error } = await supabase
        .from("verification_records")
        .update({
          email_verified: true,
          email_otp_code: null,
          email_otp_expires_at: null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Email verified successfully!");
      setEmailCode("");
      await refreshVerification(user.id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Verification failed";
      toast.error(msg);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const sendPhoneVerification = async () => {
    if (!user) return;

    const normalized = phoneNumber.trim();
    if (!normalized || normalized.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setSendingPhone(true);
    try {
      await ensureVerificationRecord(user.id);

      const code = sixDigitCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("verification_records")
        .update({
          phone_number: normalized,
          phone_otp_code: code,
          phone_otp_expires_at: expiresAt,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Phone verification code generated.");
      toast.message(
        "SMS is not wired yet — add Twilio (or similar) via an Edge Function for real texts. Dev mode shows the code when enabled."
      );
      showDevOtp(code, "Phone verification code");

      setPhoneCode("");
      await refreshVerification(user.id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send code";
      toast.error(msg);
    } finally {
      setSendingPhone(false);
    }
  };

  const verifyPhoneCode = async () => {
    if (!user) return;
    const trimmed = phoneCode.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      toast.error("Enter the 6-digit code");
      return;
    }

    setVerifyingPhone(true);
    try {
      const record = await fetchVerificationRow(user.id);
      if (!record) {
        toast.error("No verification record found");
        return;
      }

      if (record.phone_otp_code !== trimmed) {
        toast.error("Invalid verification code");
        return;
      }

      if (!record.phone_otp_expires_at || new Date(record.phone_otp_expires_at) < new Date()) {
        toast.error("Code expired. Request a new one.");
        return;
      }

      const { error } = await supabase
        .from("verification_records")
        .update({
          phone_verified: true,
          phone_otp_code: null,
          phone_otp_expires_at: null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Phone verified successfully!");
      setPhoneCode("");
      await refreshVerification(user.id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Verification failed";
      toast.error(msg);
    } finally {
      setVerifyingPhone(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading verification status...</p>
      </div>
    );
  }

  const emailVerified = Boolean(user?.email_confirmed_at || verification?.email_verified);
  const phoneVerified = Boolean(verification?.phone_verified);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Account Verification</h1>
          <p className="text-muted-foreground mt-2">Complete verification to unlock all platform features</p>
        </motion.div>

        {/* Verification Status */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 bg-card border rounded-lg">
            <div className="flex justify-center mb-2">
              {emailVerified ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <Mail className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <p className="font-semibold">Email</p>
            {emailVerified ? (
              <Badge className="mt-2 bg-green-500 text-white">Verified</Badge>
            ) : (
              <Badge variant="outline" className="mt-2">
                Pending
              </Badge>
            )}
          </div>

          <div className="text-center p-4 bg-card border rounded-lg">
            <div className="flex justify-center mb-2">
              {phoneVerified ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <Phone className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <p className="font-semibold">Phone</p>
            {phoneVerified ? (
              <Badge className="mt-2 bg-green-500 text-white">Verified</Badge>
            ) : (
              <Badge variant="outline" className="mt-2">
                Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Email Verification */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 shrink-0" />
                    Email Verification
                  </CardTitle>
                  <CardDescription className="mt-1">We will send a code to your account email.</CardDescription>
                </div>
                {emailVerified && <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />}
              </div>
            </CardHeader>
            {!emailVerified && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account email</label>
                  <Input value={user?.email ?? ""} readOnly className="bg-muted/50" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You will receive a 6-digit code. If emails are not set up yet, enable dev hints with{" "}
                  <code className="text-xs bg-muted px-1 rounded">VITE_DEV_SHOW_OTP=true</code> or run locally (
                  <code className="text-xs bg-muted px-1 rounded">npm run dev</code>).
                </p>
                <div className="flex gap-2">
                  <Button onClick={sendEmailVerification} disabled={sendingEmail} className="flex-1">
                    {sendingEmail && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Send Code
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter verification code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="123456"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                    />
                    <Button onClick={verifyEmailCode} disabled={verifyingEmail || emailCode.length !== 6}>
                      {verifyingEmail && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Phone Verification */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 shrink-0" />
                    Phone Verification
                  </CardTitle>
                  <CardDescription>
                    {phoneVerified ? verification?.phone_number : "Add your phone number"}
                  </CardDescription>
                </div>
                {phoneVerified && <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />}
              </div>
            </CardHeader>
            {!phoneVerified && (
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your number including country code (e.g. +9779876543210). SMS sending requires provider setup;
                  dev mode shows the code when enabled.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    placeholder="+9779876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
                <Button onClick={sendPhoneVerification} disabled={sendingPhone} className="w-full">
                  {sendingPhone && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send Code to Phone
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter verification code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="123456"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                    />
                    <Button onClick={verifyPhoneCode} disabled={verifyingPhone || phoneCode.length !== 6}>
                      {verifyingPhone && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Verify
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Benefits */}
        {(emailVerified || phoneVerified) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">Verification Benefits</p>
                    <ul className="text-sm text-green-800 dark:text-green-200 mt-2 space-y-1">
                      <li>Full access to all platform features</li>
                      <li>Appear as verified member in search results</li>
                      <li>Increased profile visibility</li>
                      <li>Build trust with potential matches</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
