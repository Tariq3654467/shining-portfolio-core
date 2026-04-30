import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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
  Star,
  Heart,
  Search,
  FileText,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface BioDataInfo {
  fullName?: string;
  gender?: string;
  dob?: string;
  age?: string;
  height?: string;
  religion?: string;
  caste?: string;
  areaOfResidence?: string;
  profile_picture_url?: string;
}

const Profile = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [biodata, setBiodata] = useState<BioDataInfo | null>(null);
  const [biodataLoading, setBiodataLoading] = useState(true);

  useEffect(() => {
    const fetchBiodata = async () => {
      try {
        if (user) {
          const { data } = await supabase
            .from("biodatas")
            .select("payload, profile_picture_url")
            .eq("user_id", user.id)
            .maybeSingle();

          if (data) {
            setBiodata({
              ...data.payload,
              profile_picture_url: data.profile_picture_url,
            });
          }
        }
      } catch (e) {
        console.error("Failed to fetch biodata:", e);
      } finally {
        setBiodataLoading(false);
      }
    };

    if (user && !loading) {
      fetchBiodata();
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading || biodataLoading) {
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
    { label: "My Profile", icon: User, action: () => {}, active: true },
    { label: "View Biodata", icon: FileText, action: () => navigate("/biodata-review"), active: false },
    { label: "Edit Biodata", icon: Edit3, action: () => navigate("/biodata"), active: false },
    { label: "Browse Profiles", icon: Search, action: () => navigate("/search"), active: false },
    { label: "Verify Account", icon: Lock, action: () => navigate("/verification"), active: false },
    { label: "Account Settings", icon: Settings, action: () => {}, active: false },
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
                    onClick={link.action}
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
                    <Avatar className="h-40 w-40 border-4 border-background shadow-2xl">
                      <AvatarImage
                        src={biodata?.profile_picture_url}
                        alt={biodata?.fullName || "Profile"}
                      />
                      <AvatarFallback className="text-2xl">
                        {(biodata?.fullName || "U")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => navigate("/biodata")}
                      className="absolute -bottom-2 -right-2 p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                      title="Update profile picture"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Header Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <h1 className="text-4xl font-heading font-bold text-foreground">
                            {biodata?.fullName || profile?.first_name || "User"}
                          </h1>
                          <CheckCircle2 className="h-6 w-6 text-primary fill-primary/10" aria-label="Verified Member" />
                        </div>
                        <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                          <Mail className="h-4 w-4" /> {user.email}
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate("/biodata")}
                        variant="outline"
                        className="rounded-2xl gap-2 h-12 px-6 border-primary/20 hover:bg-primary/5"
                      >
                        <Edit3 className="h-4 w-4 text-primary" /> Edit Profile
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                      <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        Member
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
                        <span className="text-muted-foreground font-medium">Gender</span>
                        <span className="font-bold capitalize">{biodata?.gender || profile?.gender || "Not specified"}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Age</span>
                        <span className="font-bold">{biodata?.age || "Not specified"}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Height</span>
                        <span className="font-bold">{biodata?.height || "Not specified"}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Religion</span>
                        <span className="font-bold capitalize">{biodata?.religion || "Not specified"}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Caste</span>
                        <span className="font-bold capitalize">{biodata?.caste || "Not specified"}</span>
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
                        <span className="text-muted-foreground font-medium">Area</span>
                        <span className="font-bold">{biodata?.areaOfResidence || "Not specified"}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Profile Status</span>
                        <span className="font-bold text-green-500">Active</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 flex justify-between items-center group hover:bg-white/50 transition-colors">
                        <span className="text-muted-foreground font-medium">Biodata</span>
                        <span className="font-bold text-blue-500">{biodata ? "Complete" : "Incomplete"}</span>
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
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {[
                { title: "Browse Profiles", desc: "Find your match", icon: Search, color: "text-blue-500", action: () => navigate("/search") },
                { title: "Likes & Interests", desc: "View your connections", icon: Heart, color: "text-red-500", action: () => navigate("/search") },
                { title: "Verify Account", desc: "Get verified badge", icon: Shield, color: "text-purple-500", action: () => navigate("/verification") },
                { title: "Upgrade Plan", desc: "Get premium access", icon: Star, color: "text-yellow-500", action: () => navigate("/premium-plans") },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="bg-card border p-6 rounded-3xl shadow-sm text-left hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
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
