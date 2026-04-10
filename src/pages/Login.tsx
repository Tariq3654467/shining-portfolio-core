import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => (
  <div className="min-h-[80vh] flex items-center justify-center py-12">
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

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input type="email" placeholder="Email address" />
        <Input type="password" placeholder="Password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-input" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link to="/" className="text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full gradient-primary text-primary-foreground">Log In</Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">Register now</Link>
      </div>
    </motion.div>
  </div>
);

export default Login;
