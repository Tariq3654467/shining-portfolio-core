import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const members = [
  { id: 1, name: "Aarav S.", age: 28, location: "Kathmandu", profession: "Software Engineer", education: "M.Tech", gender: "Male" },
  { id: 2, name: "Priya M.", age: 25, location: "Pokhara", profession: "Doctor", education: "MBBS", gender: "Female" },
  { id: 3, name: "Rohan K.", age: 30, location: "New York", profession: "Business Analyst", education: "MBA", gender: "Male" },
  { id: 4, name: "Sita R.", age: 26, location: "London", profession: "Architect", education: "B.Arch", gender: "Female" },
  { id: 5, name: "Bikash T.", age: 32, location: "Sydney", profession: "Civil Engineer", education: "B.E.", gender: "Male" },
  { id: 6, name: "Anita G.", age: 27, location: "Kathmandu", profession: "Teacher", education: "M.Ed", gender: "Female" },
];

const ActiveMembers = () => (
  <div className="py-12">
    <div className="container">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-center">Active Members</h1>
      <p className="text-muted-foreground text-center mt-2 mb-8">Browse verified profiles and find your match</p>

      {/* Filters */}
      <div className="bg-card rounded-xl border p-4 mb-8 flex flex-wrap gap-3">
        <Input placeholder="Search by name..." className="flex-1 min-w-[200px]" />
        <Select>
          <SelectTrigger className="w-40"><SelectValue placeholder="Gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="kathmandu">Kathmandu</SelectItem>
            <SelectItem value="pokhara">Pokhara</SelectItem>
            <SelectItem value="usa">USA</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gradient-primary text-primary-foreground">Search</Button>
      </div>

      {/* Member Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-accent to-muted flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-3xl font-heading font-bold text-primary">
                {m.name[0]}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-heading font-semibold">{m.name}, <span className="text-muted-foreground font-body text-base">{m.age}</span></h3>
              <div className="flex flex-col gap-1.5 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{m.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{m.profession}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{m.education}</span>
              </div>
              <Button className="w-full mt-4 gradient-primary text-primary-foreground" size="sm">View Profile</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default ActiveMembers;
