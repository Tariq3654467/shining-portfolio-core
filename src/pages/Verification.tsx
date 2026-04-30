import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Phone, Loader as Loader2, CircleCheck as CheckCircle } from "lucide-react";

const Verification = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingPhone, setSendingPhone] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }
        setUser(user);

        const { data } = await supabase
          .from("verification_records")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!data) {
          await supabase.from("verification_records").insert({
            user_id: user.id,
          });
        }
        setVerification(data);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const sendEmailVerification = async () => {
    setSendingEmail(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("verification_records")
        .update({
          verification_code: code,
          code_expires_at: expiresAt,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success(`Verification code sent to ${user.email}`);
      setEmailCode("");
    } catch (e: any) {
      toast.error(e.message || "Failed to send code");
    } finally {
      setSendingEmail(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!emailCode) {
      toast.error("Please enter the verification code");
      return;
    }

    setVerifyingEmail(true);
    try {
      const { data: record, error } = await supabase
        .from("verification_records")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!record || record.verification_code !== emailCode) {
        toast.error("Invalid verification code");
        return;
      }

      if (new Date(record.code_expires_at) < new Date()) {
        toast.error("Verification code expired. Please request a new one.");
        return;
      }

      await supabase
        .from("verification_records")
        .update({ email_verified: true, verification_code: null })
        .eq("user_id", user.id);

      setVerification({ ...record, email_verified: true });
      toast.success("Email verified successfully!");
      setEmailCode("");
    } catch (e: any) {
      toast.error(e.message || "Verification failed");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const sendPhoneVerification = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    setSendingPhone(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("verification_records")
        .update({
          phone_number: phoneNumber,
          verification_code: code,
          code_expires_at: expiresAt,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success(`Verification code sent to ${phoneNumber}`);
      setPhoneCode("");
    } catch (e: any) {
      toast.error(e.message || "Failed to send code");
    } finally {
      setSendingPhone(false);
    }
  };

  const verifyPhoneCode = async () => {
    if (!phoneCode) {
      toast.error("Please enter the verification code");
      return;
    }

    setVerifyingPhone(true);
    try {
      const { data: record, error } = await supabase
        .from("verification_records")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!record || record.verification_code !== phoneCode) {
        toast.error("Invalid verification code");
        return;
      }

      if (new Date(record.code_expires_at) < new Date()) {
        toast.error("Verification code expired. Please request a new one.");
        return;
      }

      await supabase
        .from("verification_records")
        .update({ phone_verified: true, verification_code: null })
        .eq("user_id", user.id);

      setVerification({ ...record, phone_verified: true });
      toast.success("Phone verified successfully!");
      setPhoneCode("");
    } catch (e: any) {
      toast.error(e.message || "Verification failed");
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

  const emailVerified = verification?.email_verified;
  const phoneVerified = verification?.phone_verified;

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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Verification
                  </CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
                {emailVerified && <CheckCircle className="h-6 w-6 text-green-500" />}
              </div>
            </CardHeader>
            {!emailVerified && (
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We'll send a verification code to your email address.
                </p>
                <div className="flex gap-2">
                  <Button onClick={sendEmailVerification} disabled={sendingEmail || emailVerified} className="flex-1">
                    {sendingEmail && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Send Code
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter verification code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="000000"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.toUpperCase())}
                      maxLength={6}
                    />
                    <Button onClick={verifyEmailCode} disabled={verifyingEmail || !emailCode || emailVerified}>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Phone Verification
                  </CardTitle>
                  <CardDescription>
                    {phoneVerified ? verification?.phone_number : "Add your phone number"}
                  </CardDescription>
                </div>
                {phoneVerified && <CheckCircle className="h-6 w-6 text-green-500" />}
              </div>
            </CardHeader>
            {!phoneVerified && (
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We'll send a verification code via SMS to your phone.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    placeholder="+977 98XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button onClick={sendPhoneVerification} disabled={sendingPhone || phoneVerified} className="w-full">
                  {sendingPhone && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send Code to Phone
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter verification code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="000000"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value.toUpperCase())}
                      maxLength={6}
                    />
                    <Button onClick={verifyPhoneCode} disabled={verifyingPhone || !phoneCode || phoneVerified}>
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
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Verification Benefits</p>
                    <ul className="text-sm text-green-800 mt-2 space-y-1">
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
