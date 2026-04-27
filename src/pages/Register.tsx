import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
    onBehalf: "",
    dateOfBirth: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~';]).+$/;
    if (!strongPassword.test(formData.password)) {
      toast.error("Password must include one uppercase letter, one number, and one special character");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create the user profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              gender: formData.gender,
              on_behalf: formData.onBehalf,
              date_of_birth: formData.dateOfBirth,
            },
          ]);

        if (profileError) throw profileError;

        toast.success("Account created successfully!");
        navigate("/expectations");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border rounded-2xl p-8"
      >
        <div className="text-center mb-6">
          <img src={logo} alt="ebihe.com logo" className="h-14 w-14 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-heading font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join ebihe.com and find your perfect match</p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <Select 
            onValueChange={(v) => updateFormData("onBehalf", v)}
            required
          >
            <SelectTrigger><SelectValue placeholder="On Behalf" /></SelectTrigger>
            <SelectContent>
              {["Self", "Son", "Daughter", "Brother", "Sister", "Friend"].map((v) => (
                <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input 
              placeholder="First Name" 
              required
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
            />
            <Input 
              placeholder="Last Name" 
              required
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select 
              onValueChange={(v) => updateFormData("gender", v)}
              required
            >
              <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="date" 
              placeholder="Date of Birth" 
              required
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            />
          </div>

          <Input 
            type="email" 
            placeholder="Email address" 
            required
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            required
            min={8}
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
          />
          <p className="text-xs text-muted-foreground -mt-2">
            Must be 8+ chars with one uppercase, one number, and one special character.
          </p>
          <Input 
            type="password" 
            placeholder="Confirm Password" 
            required
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
          />

          <p className="text-xs text-muted-foreground">
            By signing up you agree to our <Link to="/" className="text-primary underline">terms and conditions</Link>.
          </p>

          <Button 
            type="submit" 
            className="w-full gradient-primary text-primary-foreground"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
