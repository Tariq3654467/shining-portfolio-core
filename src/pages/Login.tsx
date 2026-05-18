import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Loader as Loader2, Phone, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const goNext = async (userId?: string) => {
    if (!userId) return navigate("/dashboard");
    const { data: profileData } = await supabase
      .from("profiles").select("first_name").eq("id", userId).single();
    navigate(profileData?.first_name ? "/dashboard" : "/expectations");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      await goNext(data.user?.id);
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };


  const sendOtp = async () => {
    if (!phone.startsWith("+")) return toast.error("Use international format e.g. +9779812345678");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (e: any) {
      toast.error(e.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
      if (error) throw error;
      toast.success("Logged in!");
      await goNext(data.user?.id);
    } catch (e: any) {
      toast.error(e.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border rounded-2xl p-8"
      >
        <div className="text-center mb-6">
          <div className="h-14 w-14 mx-auto mb-3 rounded-full bg-gradient-primary flex items-center justify-center">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Log in to your eBihe.com account</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="email"><Mail className="h-4 w-4 mr-1.5" />Email</TabsTrigger>
            <TabsTrigger value="phone"><Phone className="h-4 w-4 mr-1.5" />Phone</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form className="space-y-4" onSubmit={handleLogin}>
              <Input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-input" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/" className="text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Logging In..." : "Log In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <div className="space-y-4">
              <Input type="tel" placeholder="+977 98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} />
              {otpSent && (
                <Input type="text" inputMode="numeric" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              )}
              {!otpSent ? (
                <Button onClick={sendOtp} className="w-full gradient-primary text-primary-foreground" disabled={loading || !phone}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send OTP
                </Button>
              ) : (
                <Button onClick={verifyOtp} className="w-full gradient-primary text-primary-foreground" disabled={loading || otp.length < 4}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Log In
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <SocialLoginButtons />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register now</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
