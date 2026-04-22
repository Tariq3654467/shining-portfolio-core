import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
 
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
 
      if (error) throw error;
 
      // Check if this user already has a profile (returning user)
      // New users go through /expectations, returning users go to /dashboard
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', data.user.id)
          .single();
 
        toast.success("Welcome back!");
        // If profile exists and has a name, they've completed onboarding
        if (profileData?.first_name) {
          navigate("/dashboard");
        } else {
          navigate("/expectations");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
      console.error("Login error:", error);
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
          <Heart className="h-10 w-10 text-primary fill-primary mx-auto mb-3" />
          <h1 className="text-2xl font-heading font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Log in to your ebihe.com account</p>
        </div>
 
        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-input" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <Link to="/" className="text-primary hover:underline">Forgot password?</Link>
          </div>
          <Button
            type="submit"
            className="w-full gradient-primary text-primary-foreground"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </form>
 
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register now</Link>
        </div>
      </motion.div>
    </div>
  );
};
 
export default Login;
 