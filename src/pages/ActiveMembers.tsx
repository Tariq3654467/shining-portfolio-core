import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, ListFilter as Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const members = [
  { id: 1, name: "Aarav S.", age: 28, location: "Kathmandu", profession: "Software Engineer", education: "M.Tech", gender: "Male" },
  { id: 2, name: "Priya M.", age: 25, location: "Pokhara", profession: "Doctor", education: "MBBS", gender: "Female" },
  { id: 3, name: "Rohan K.", age: 30, location: "New York", profession: "Business Analyst", education: "MBA", gender: "Male" },
  { id: 4, name: "Sita R.", age: 26, location: "London", profession: "Architect", education: "B.Arch", gender: "Female" },
  { id: 5, name: "Bikash T.", age: 32, location: "Sydney", profession: "Civil Engineer", education: "B.E.", gender: "Male" },
  { id: 6, name: "Anita G.", age: 27, location: "Kathmandu", profession: "Teacher", education: "M.Ed", gender: "Female" },
];

const ActiveMembers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesGender = selectedGender === "all" || m.gender.toLowerCase() === selectedGender;
    const matchesLocation = selectedLocation === "all" || m.location.toLowerCase() === selectedLocation.toLowerCase();
    return matchesSearch && matchesGender && matchesLocation;
  });

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Active Members", value: "active" },
    { label: "Education", value: "education" },
    { label: "Preferences", value: "preferences" },
  ];

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-center">Active Members</h1>
        <p className="text-muted-foreground text-center mt-2 mb-8">Browse verified profiles and find your match</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-xl border p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">SEARCH</h4>
                <Input
                  placeholder="Search by name"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Top Filter Bar */}
            <div className="bg-card rounded-xl border p-4 mb-8 flex flex-wrap gap-3">
              <Input
                placeholder="Search by name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="kathmandu">Kathmandu</SelectItem>
                  <SelectItem value="pokhara">Pokhara</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                </SelectContent>
              </Select>
              <Button className="lg:hidden" variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Filter className="h-4 w-4 mr-1" /> Filters
              </Button>
            </div>

            {/* Member Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m, i) => (
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
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No members found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMembers;
