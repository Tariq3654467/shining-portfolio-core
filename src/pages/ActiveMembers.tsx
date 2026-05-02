import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, ListFilter as Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  const [keyword, setKeyword] = useState("");
  const [lookingFor, setLookingFor] = useState("any");
  const [ageRange, setAgeRange] = useState([21, 32]);
  const [heightRange, setHeightRange] = useState([150, 195]);
  const [education, setEducation] = useState("any");
  const [religion, setReligion] = useState("any");
  const [maritalStatus, setMaritalStatus] = useState("any");

  const filteredMembers = members.filter(m => {
    const matchesKeyword = keyword === "" ||
      m.name.toLowerCase().includes(keyword.toLowerCase()) ||
      m.profession.toLowerCase().includes(keyword.toLowerCase());

    const matchesLookingFor = lookingFor === "any" || m.gender.toLowerCase() === lookingFor.toLowerCase();
    const matchesAge = m.age >= ageRange[0] && m.age <= ageRange[1];
    const matchesEducation = education === "any" || m.education.toLowerCase().includes(education.toLowerCase());

    return matchesKeyword && matchesLookingFor && matchesAge && matchesEducation;
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
            <div className="bg-card rounded-xl border p-4 space-y-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Keyword</label>
                <Input
                  placeholder="Name or profession"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Looking For */}
              <div>
                <label className="text-sm font-medium mb-2 block">Looking for</label>
                <Select value={lookingFor} onValueChange={setLookingFor}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">Age: {ageRange[0]} – {ageRange[1]}</label>
                <Slider
                  min={18}
                  max={60}
                  step={1}
                  value={ageRange}
                  onValueChange={setAgeRange}
                  className="w-full"
                />
              </div>

              {/* Height Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">Height (cm): {heightRange[0]} – {heightRange[1]}</label>
                <Slider
                  min={140}
                  max={210}
                  step={1}
                  value={heightRange}
                  onValueChange={setHeightRange}
                  className="w-full mb-1"
                />
                <p className="text-xs text-muted-foreground">Include inches as well</p>
              </div>

              {/* Education */}
              <div>
                <label className="text-sm font-medium mb-2 block">Education</label>
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="bachelor">Bachelor's</SelectItem>
                    <SelectItem value="master">Master's</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Religion */}
              <div>
                <label className="text-sm font-medium mb-2 block">Religion</label>
                <Select value={religion} onValueChange={setReligion}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                    <SelectItem value="buddhist">Buddhist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Marital Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">Marital Status</label>
                <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="never">Never Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" /> Show Filters
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
