import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Calendar, 
  Mail, 
  UserCircle, 
  Briefcase, 
  Settings, 
  Shield, 
  CreditCard, 
  Edit3, 
  CheckCircle2,
  Bell,
  Camera,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-card border rounded-3xl p-12 text-center shadow-xl max-w-md w-full">
          <UserCircle className="h-20 w-20 text-muted mx-auto mb-6" />
          <h1 className="text-3xl font-heading font-bold mb-4">Account Required</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Please log in or register to view and manage your profile.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/login")} size="lg" className="gradient-primary text-primary-foreground text-lg rounded-2xl">
              Log In
            </Button>
            <Button onClick={() => navigate("/register")} size="lg" variant="ghost" className="text-lg rounded-2xl">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { label: "My Profile", icon: User, active: true },
    { label: "Account Settings", icon: Settings, active: false },
    { label: "Membership", icon: CreditCard, active: false },
    { label: "Privacy & Security", icon: Shield, active: false },
    { label: "Notifications", icon: Bell, active: false },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Dynamic Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/30 to-transparent" />
      </div>

      <div className="container px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card/80 backdrop-blur-xl border rounded-3xl p-4 shadow-xl sticky top-24"
            >
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      link.active 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t px-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  {/* Profile Image Area */}
                  <div className="relative group">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl bg-muted border-4 border-background shadow-2xl overflow-hidden flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                      <UserCircle className="h-24 w-24 md:h-32 md:w-32 opacity-20" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Header Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <h1 className="text-4xl font-heading font-bold text-foreground">
                            {profile?.first_name} {profile?.last_name}
                          </h1>
                          <CheckCircle2 className="h-6 w-6 text-primary fill-primary/10" aria-label="Verified Member" />
                        </div>
                        <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                          <Mail className="h-4 w-4" /> {user.email}
                        </p>
                      </div>
                      <Button variant="outline" className="rounded-2xl gap-2 h-12 px-6 border-primary/20 hover:bg-primary/5">
                        <Edit3 className="h-4 w-4 text-primary" /> Edit Profile
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                      <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        Premium Member
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-wider">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  {/* Left Column: Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                      <User className="h-5 w-5 text-primary" /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Account Owner</span>
                        <span className="font-bold capitalize">{profile?.on_behalf || "Self"}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Gender</span>
                        <span className="font-bold capitalize">{profile?.gender || "Not specified"}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Date of Birth</span>
                        <div className="flex items-center gap-2 font-bold">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{profile?.date_of_birth || "1994-01-01"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Account */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                      <Briefcase className="h-5 w-5 text-primary" /> Account Overview
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Member Since</span>
                        <span className="font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Last Login</span>
                        <span className="font-bold">Today</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Profile Status</span>
                        <span className="font-bold text-green-500">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { title: "Privacy Settings", desc: "Control who sees your profile", icon: Shield, color: "text-blue-500" },
                { title: "Notification Prefs", desc: "Manage your email alerts", icon: Bell, color: "text-purple-500" },
                { title: "Upgrade Account", desc: "Unlock premium features", icon: Star, color: "text-yellow-500" },
              ].map((item, i) => (
                <button key={i} className="bg-card border p-6 rounded-3xl shadow-sm text-left hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <item.icon className={`h-8 w-8 ${item.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </button>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};



export default Profile;
