import { motion } from "framer-motion";
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Bell, 
  Search, 
  Settings, 
  Trophy, 
  Star,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { profile, user } = useAuth();

  const stats = [
    { label: "Profile Views", value: "128", icon: Users, color: "text-blue-500" },
    { label: "Interests", value: "45", icon: Heart, color: "text-red-500" },
    { label: "Messages", value: "12", icon: MessageSquare, color: "text-green-500" },
    { label: "Matches", value: "8", icon: Star, color: "text-yellow-500" },
  ];

  const matches = [
    {
      id: 1,
      name: "Sahra Ahmed",
      age: 24,
      location: "Mogadishu",
      profession: "Doctor",
      match: "98%",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Abdi Hassan",
      age: 28,
      location: "Hargeisa",
      profession: "Software Engineer",
      match: "95%",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Leyla Barre",
      age: 26,
      location: "Garowe",
      profession: "Teacher",
      match: "92%",
      image: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2ea6?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      {/* Header / Hero */}
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-heading font-bold">
                Namaste, {profile?.first_name || "Guest"}! 🙏
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your search for a life partner today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/biodata">
                <Button variant="outline" className="gap-2 hidden sm:inline-flex">
                  Complete Biodata
                </Button>
              </Link>
              <Link to="/profile">
                <Button className="gradient-primary text-primary-foreground gap-2">
                  <Settings className="h-4 w-4" /> Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-4 rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color} mb-2`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" /> Top Matches for You
                </h2>
                <Button variant="link" className="text-primary gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matches.map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="group bg-card rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={match.image} 
                        alt={match.name} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> {match.match} Match
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{match.name}, {match.age}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {match.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{match.profession}</p>
                      <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors rounded-xl">
                        View Profile
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="space-y-6">
            
            {/* Profile Completion */}
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> Profile Completion
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-bold">65%</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Complete your profile to get 2x more matches and visibility!
                </p>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl">
                  Add Details
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-primary">Trust & Safety</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your profile is verified. This helps other members feel safe connecting with you.
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-green-600">Verified Member</span>
              </div>
            </div>

            {/* Quick Search */}
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" /> Advanced Search
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Narrow down your results by age, location, or education.
              </p>
              <Button variant="outline" className="w-full rounded-xl">
                Open Filters
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
