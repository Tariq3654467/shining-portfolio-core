import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const navigate = useNavigate();
  return (
  <div className="min-h-[80vh] flex items-center justify-center py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-card border rounded-2xl p-8"
    >
      <div className="text-center mb-6">
        <Heart className="h-10 w-10 text-primary fill-primary mx-auto mb-3" />
        <h1 className="text-2xl font-heading font-bold">Create Account</h1>
        <p className="text-sm text-muted-foreground">Join ebihe.com and find your perfect match</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate("/expectations"); }}>
        <Select>
          <SelectTrigger><SelectValue placeholder="On Behalf" /></SelectTrigger>
          <SelectContent>
            {["Self", "Son", "Daughter", "Brother", "Sister", "Friend"].map((v) => (
              <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="First Name" />
          <Input placeholder="Last Name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select>
            <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" placeholder="Date of Birth" />
        </div>
        <Input type="email" placeholder="Email address" />
        <Input type="password" placeholder="Password (min 8 chars)" />
        <Input type="password" placeholder="Confirm Password" />
        <p className="text-xs text-muted-foreground">
          By signing up you agree to our <Link to="/" className="text-primary underline">terms and conditions</Link>.
        </p>
        <Button type="submit" className="w-full gradient-primary text-primary-foreground">Create Account</Button>
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
