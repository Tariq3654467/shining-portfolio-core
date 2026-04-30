import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, ListFilter as Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Mock dataset linked to biodata fields
const allMembers = [
  { id: 1, name: "Aarav S.", age: 28, height: 175, location: "Kathmandu", country: "Nepal", profession: "Software Engineer", education: "Masters", religion: "Hindu", caste: "Brahmin", maritalStatus: "Never Married", gender: "Male" },
  { id: 2, name: "Priya M.", age: 25, height: 162, location: "Pokhara", country: "Nepal", profession: "Doctor", education: "Doctorate", religion: "Hindu", caste: "Chettri", maritalStatus: "Never Married", gender: "Female" },
  { id: 3, name: "Rohan K.", age: 30, height: 180, location: "New York", country: "USA", profession: "Business Analyst", education: "Masters", religion: "Hindu", caste: "Newar", maritalStatus: "Divorced", gender: "Male" },
  { id: 4, name: "Sita R.", age: 26, height: 165, location: "London", country: "UK", profession: "Architect", education: "Bachelors", religion: "Hindu", caste: "Brahmin", maritalStatus: "Never Married", gender: "Female" },
  { id: 5, name: "Bikash T.", age: 32, height: 178, location: "Sydney", country: "Australia", profession: "Civil Engineer", education: "Bachelors", religion: "Buddhist", caste: "Tamang", maritalStatus: "Never Married", gender: "Male" },
  { id: 6, name: "Anita G.", age: 27, height: 160, location: "Kathmandu", country: "Nepal", profession: "Teacher", education: "Masters", religion: "Hindu", caste: "Magar", maritalStatus: "Never Married", gender: "Female" },
  { id: 7, name: "Suman P.", age: 29, height: 170, location: "Biratnagar", country: "Nepal", profession: "Banker", education: "Masters", religion: "Hindu", caste: "Chettri", maritalStatus: "Widowed", gender: "Female" },
  { id: 8, name: "Rajan B.", age: 34, height: 182, location: "Kathmandu", country: "Nepal", profession: "Entrepreneur", education: "Bachelors", religion: "Buddhist", caste: "Gurung", maritalStatus: "Never Married", gender: "Male" },
];

const educationLevels = ["Any", "High School", "Bachelors", "Masters", "Doctorate"];
const religions = ["Any", "Hindu", "Buddhist", "Christian", "Muslim", "Other"];
const maritalStatuses = ["Any", "Never Married", "Divorced", "Widowed"];
const countries = ["Any", "Nepal", "India", "USA", "UK", "Australia", "Canada"];
const locations = ["Any", "Kathmandu", "Pokhara", "Biratnagar", "Chitwan", "Dharan", "Janakpur", "Birgunj", "Bhaktapur", "Lalitpur"];
const castes = [
  "Any", "Chhetri", "Bahun/Hill Brahmin", "Thakuri", "Magar", "Gurung", "Ghale", "Tamang",
  "Chepang", "Rai", "Limbu", "Sunuwar", "Sherpa", "Bhote", "Thakali", "Tharu", "Rajbanshi",
  "Newar Brahmins", "Shrestha", "Maithil Brahmin", "Rajput", "Kayastha", "Yadav", "Other"
];

const AdvancedSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [gender, setGender] = useState("Any");
  const [ageRange, setAgeRange] = useState<[number, number]>([21, 40]);
  const [heightRange, setHeightRange] = useState<[number, number]>([150, 195]);
  const [education, setEducation] = useState("Any");
  const [religion, setReligion] = useState("Any");
  const [marital, setMarital] = useState("Any");
  const [country, setCountry] = useState("Any");
  const [location, setLocation] = useState("Any");
  const [caste, setCaste] = useState("Any");

  const filtered = useMemo(() => {
    return allMembers.filter((m) => {
      if (keyword && !m.name.toLowerCase().includes(keyword.toLowerCase()) && !m.profession.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (gender !== "Any" && m.gender !== gender) return false;
      if (m.age < ageRange[0] || m.age > ageRange[1]) return false;
      if (m.height < heightRange[0] || m.height > heightRange[1]) return false;
      if (education !== "Any" && m.education !== education) return false;
      if (religion !== "Any" && m.religion !== religion) return false;
      if (marital !== "Any" && m.maritalStatus !== marital) return false;
      if (country !== "Any" && m.country !== country) return false;
      if (location !== "Any" && m.location !== location) return false;
      if (caste !== "Any" && m.caste !== caste) return false;
      return true;
    });
  }, [keyword, gender, ageRange, heightRange, education, religion, marital, country, location, caste]);

  const reset = () => {
    setKeyword(""); setGender("Any"); setAgeRange([21, 40]); setHeightRange([150, 195]);
    setEducation("Any"); setReligion("Any"); setMarital("Any"); setCountry("Any"); setLocation("Any"); setCaste("Any");
  };

  const activeFilters = [
    gender !== "Any" && `Gender: ${gender}`,
    education !== "Any" && `Edu: ${education}`,
    religion !== "Any" && `Religion: ${religion}`,
    marital !== "Any" && `Status: ${marital}`,
    country !== "Any" && `Country: ${country}`,
    location !== "Any" && `Location: ${location}`,
    caste !== "Any" && `Caste: ${caste}`,
  ].filter(Boolean) as string[];

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium text-muted-foreground">Keyword</label>
        <Input placeholder="Name or profession" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="mt-1" />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Looking for</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Any", "Male", "Female"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Age: {ageRange[0]} – {ageRange[1]}</label>
        <Slider min={18} max={60} step={1} value={ageRange} onValueChange={(v) => setAgeRange(v as [number, number])} className="mt-2" />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Height (cm): {heightRange[0]} – {heightRange[1]}</label>
        <Slider min={140} max={210} step={1} value={heightRange} onValueChange={(v) => setHeightRange(v as [number, number])} className="mt-2" />
      </div>

      {[
        { label: "Education", value: education, setter: setEducation, options: educationLevels },
        { label: "Religion", value: religion, setter: setReligion, options: religions },
        { label: "Marital Status", value: marital, setter: setMarital, options: maritalStatuses },
        { label: "Country", value: country, setter: setCountry, options: countries },
        { label: "Area of Residence", value: location, setter: setLocation, options: locations },
        { label: "Caste / Ethnicity", value: caste, setter: setCaste, options: castes },
      ].map((f) => (
        <div key={f.label}>
          <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
          <Select value={f.value} onValueChange={f.setter}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      ))}

      <Button variant="outline" className="w-full" onClick={reset}>Reset Filters</Button>
    </div>
  );

  return (
    <div className="py-10">
      <div className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Advanced Search</h1>
          <p className="text-muted-foreground mt-2">Find your ideal match using detailed biodata filters</p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block bg-card border rounded-xl p-5 h-fit sticky top-20">
            <h3 className="font-heading font-semibold mb-4">Filters</h3>
            <FilterPanel />
          </aside>

          {/* Mobile filter trigger */}
          <div className="lg:hidden flex items-center justify-between mb-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] overflow-y-auto">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterPanel /></div>
              </SheetContent>
            </Sheet>
            <span className="text-sm text-muted-foreground">{filtered.length} results</span>
          </div>

          <div>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f) => (
                  <Badge key={f} variant="secondary" className="gap-1">
                    {f}
                  </Badge>
                ))}
                <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear all
                </button>
              </div>
            )}

            <p className="hidden lg:block text-sm text-muted-foreground mb-4">{filtered.length} matching profiles</p>

            {filtered.length === 0 ? (
              <div className="bg-card border rounded-xl p-12 text-center">
                <p className="text-muted-foreground">No matches found. Try widening your filters.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 bg-gradient-to-br from-accent to-muted flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-2xl font-heading font-bold text-primary">
                        {m.name[0]}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold">{m.name}, <span className="text-muted-foreground font-normal text-sm">{m.age}</span></h3>
                      <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{m.location}, {m.country}</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" />{m.profession}</span>
                        <span className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3" />{m.education} • {m.religion}</span>
                      </div>
                      <Button className="w-full mt-3 gradient-primary text-primary-foreground" size="sm">View Profile</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
