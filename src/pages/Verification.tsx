import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Loader as Loader2, CircleCheck as CheckCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useVerification } from "@/hooks/useVerification";
import {
  sixDigitCode,
  showDevOtp,
  ensureVerificationRecord,
  fetchVerificationRecord,
} from "@/lib/verification";

const Verification = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { emailVerified, isFullyVerified, refresh, record, loading: verificationLoading } = useVerification();

  const [emailCode, setEmailCode] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  const loading = authLoading || verificationLoading;

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
            "Email was not sent. Deploy send-verification-email and set RESEND_API_KEY, or use dev OTP."
        );
        showDevOtp(code, "Email verification code");
      }

      setEmailCode("");
      await refresh();
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
      const recordRow = await fetchVerificationRecord(user.id);
      if (!recordRow) {
        toast.error("No verification record found");
        return;
      }

      if (recordRow.email_otp_code !== trimmed) {
        toast.error("Invalid verification code");
        return;
      }

      if (!recordRow.email_otp_expires_at || new Date(recordRow.email_otp_expires_at) < new Date()) {
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
      await refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Verification failed";
      toast.error(msg);
    } finally {
      setVerifyingEmail(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading verification status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Account Verification</h1>
          <p className="text-muted-foreground mt-2">
            Verify your email to browse members and appear in search results.
          </p>
        </motion.div>

        {isFullyVerified && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900">
            <CardContent className="pt-6 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600 shrink-0" />
              <motion.div>
                <p className="font-semibold text-green-900 dark:text-green-100">You are fully verified</p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Your profile is visible to other verified members in Active Members and search.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        )}

        <div className="grid sm:grid-cols-1 gap-4 mb-8">
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
        </div>

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
                  See <code className="text-xs bg-muted px-1 rounded">docs/VERIFICATION.md</code> for Resend setup. Dev
                  OTP: <code className="text-xs bg-muted px-1 rounded">VITE_DEV_SHOW_OTP=true</code>.
                </p>
                <Button onClick={sendEmailVerification} disabled={sendingEmail} className="w-full">
                  {sendingEmail && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send Code
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter verification code</label>
                  <motion.div className="flex gap-2">
                    <Input
                      placeholder="123456"
                      inputMode="numeric"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                    />
                    <Button onClick={verifyEmailCode} disabled={verifyingEmail || emailCode.length !== 6}>
                      {verifyingEmail && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Verify
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>




        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Verification;
