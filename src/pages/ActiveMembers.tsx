import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, ListFilter as Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useVerification } from "@/hooks/useVerification";
import { VerificationRequiredBanner } from "@/components/VerificationRequiredBanner";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { sanitizePayloadForViewer, payloadAgeNum } from "@/lib/publicBiodata";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type BiodataRow = {
  user_id: string;
  payload: Record<string, unknown>;
  private_fields: Record<string, boolean>;
  profile_picture_url: string | null;
};

const countries = [
  "Any", "Nepal", "India", "USA", "UK", "Australia", "Canada", "Germany", "France", "Italy",
  "Spain", "Netherlands", "Belgium", "Switzerland", "Sweden", "Norway", "Denmark", "Finland",
  "Poland", "Czech Republic", "Austria", "Portugal", "Greece", "Japan", "South Korea", "China",
  "Thailand", "Malaysia", "Singapore", "Philippines", "Indonesia", "Vietnam", "Pakistan",
  "Bangladesh", "Sri Lanka", "UAE", "Saudi Arabia", "Qatar", "New Zealand", "Ireland",
];

/** Card-ready fields after privacy stripping */
function toCardModel(row: BiodataRow) {
  const p = sanitizePayloadForViewer(row.payload, row.private_fields) as Record<string, string>;
  const ageNum = payloadAgeNum(p as unknown as Record<string, unknown>);
  const name =
    typeof p.fullName === "string" && p.fullName.trim()
      ? p.fullName.trim()
      : "Member";
  return {
    user_id: row.user_id,
    name,
    age: ageNum,
    ageLabel: typeof p.age === "string" && p.age.trim() ? p.age : ageNum !== null ? String(ageNum) : "",
    location: p.areaOfResidence || "",
    country: p.country || "",
    profession: p.occupation || "",
    education: p.education || "",
    gender: (p.gender || "").trim(),
    imageUrl: row.profile_picture_url ?? undefined,
  };
}

type CardModel = ReturnType<typeof toCardModel>;

const ActiveMembers = () => {
  const { user, loading: authLoading } = useAuth();
  const { isFullyVerified, loading: verificationLoading } = useVerification();
  const [rows, setRows] = useState<BiodataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [lookingFor, setLookingFor] = useState("any");
  const [ageRange, setAgeRange] = useState([21, 32]);
  const [heightRange, setHeightRange] = useState([150, 195]);
  const [education, setEducation] = useState("any");
  const [religion, setReligion] = useState("any");
  const [maritalStatus, setMaritalStatus] = useState("any");
  const [country, setCountry] = useState("any");

  useEffect(() => {
    const load = async () => {
      if (authLoading) return;

      if (!user) {
        setRows([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("biodatas")
          .select("user_id, payload, private_fields, profile_picture_url")
          .neq("user_id", user.id);

        if (error) throw error;
        setRows((data as BiodataRow[]) || []);
      } catch (e: unknown) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : "Could not load members");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, authLoading]);

  const filteredMembers: CardModel[] = rows
    .map((row) => {
      const m = toCardModel(row);
      const pub = sanitizePayloadForViewer(row.payload, row.private_fields) as Record<string, string>;
      return { m, pub };
    })
    .filter(({ m, pub }) => {
      const matchesKeyword =
        keyword === "" ||
        m.name.toLowerCase().includes(keyword.toLowerCase()) ||
        m.profession.toLowerCase().includes(keyword.toLowerCase()) ||
        m.education.toLowerCase().includes(keyword.toLowerCase());

      const matchesLookingFor =
        lookingFor === "any" || m.gender.toLowerCase() === lookingFor.toLowerCase();

      const matchesAge = m.age === null || (m.age >= ageRange[0] && m.age <= ageRange[1]);

      const matchesEducation =
        education === "any" ||
        (m.education && m.education.toLowerCase().includes(education.toLowerCase()));

      const matchesCountry =
        country === "any" ||
        (m.country && m.country.toLowerCase() === country.toLowerCase());

      const matchesReligion =
        religion === "any" ||
        (pub.religion && pub.religion.toLowerCase() === religion.toLowerCase());

      const matchesMarital =
        maritalStatus === "any"
          ? true
          : !pub.maritalStatus
            ? true
            : (maritalStatus === "never" && pub.maritalStatus.includes("Never")) ||
              (maritalStatus === "divorced" && pub.maritalStatus.toLowerCase().includes("divorc")) ||
              (maritalStatus === "widowed" && pub.maritalStatus.toLowerCase().includes("widow"));

      let matchesHeightRange = true;
      const ht = typeof pub.height === "string" ? pub.height.trim() : "";
      if (heightRange && ht) {
        const cmMatch = ht.match(/(\d{2,3})\s*cm/i);
        const cm = cmMatch ? parseInt(cmMatch[1], 10) : NaN;
        if (!Number.isNaN(cm)) {
          matchesHeightRange = cm >= heightRange[0] && cm <= heightRange[1];
        }
      }

      return (
        matchesKeyword &&
        matchesLookingFor &&
        matchesAge &&
        matchesEducation &&
        matchesCountry &&
        matchesReligion &&
        matchesMarital &&
        matchesHeightRange
      );
    })
    .map(({ m }) => m);

  const resetFilters = () => {
    setKeyword("");
    setLookingFor("any");
    setAgeRange([21, 32]);
    setHeightRange([150, 195]);
    setEducation("any");
    setReligion("any");
    setMaritalStatus("any");
    setCountry("any");
  };

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-center">Active Members</h1>
        <p className="text-muted-foreground text-center mt-2 mb-8">Browse verified profiles and find your match</p>

        {!user && !authLoading && (
          <div className="max-w-lg mx-auto text-center rounded-xl border bg-card p-8 mb-8">
            <p className="text-muted-foreground mb-4">Log in to see real member profiles from your community.</p>
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        )}

        {user && !authLoading && !verificationLoading && !isFullyVerified && (
          <VerificationRequiredBanner />
        )}

        {user && isFullyVerified && !verificationLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className={`lg:col-span-1 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-xl border p-4 space-y-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h3>
                <button type="button" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Keyword</label>
                <Input
                  placeholder="Name or profession"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="text-sm"
                />
              </div>

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

              <div>
                <label className="text-sm font-medium mb-3 block">Age: {ageRange[0]} – {ageRange[1]}</label>
                <Slider min={18} max={60} step={1} value={ageRange} onValueChange={setAgeRange} className="w-full" />
                <p className="text-xs text-muted-foreground mt-2">Members without numeric age still appear unless age is filtered out.</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Height (cm): {heightRange[0]} – {heightRange[1]}</label>
                <Slider min={140} max={210} step={1} value={heightRange} onValueChange={setHeightRange} className="w-full mb-1" />
                <p className="text-xs text-muted-foreground">
                  Applies when height includes cm (e.g. 175 cm). Foot/inch-only entries skip this filter.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Education</label>
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="bachelor">Bachelor&apos;s</SelectItem>
                    <SelectItem value="master">Master&apos;s</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <div>
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c.toLowerCase()}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full text-sm" onClick={resetFilters}>
                Reset All Filters
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="lg:hidden mb-6">
              <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full">
                <Filter className="h-4 w-4 mr-2" /> Show Filters
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m, i) => (
                  <motion.div
                    key={m.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-accent to-muted flex items-center justify-center">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src={m.imageUrl} alt={m.name} className="object-cover" />
                        <AvatarFallback className="text-3xl font-heading font-bold bg-primary/10 text-primary">
                          {m.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-heading font-semibold flex items-center gap-2 flex-wrap">
                        {m.name}
                        <VerifiedBadge verified showLabel={false} />
                        {(m.ageLabel || m.age !== null) && (
                          <span className="text-muted-foreground font-body text-base">
                            , {m.age !== null ? m.age : m.ageLabel}
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-col gap-1.5 mt-3 text-sm text-muted-foreground">
                        {(m.location || m.country) && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {[m.location, m.country].filter(Boolean).join(", ") || "—"}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 shrink-0" />
                          {m.profession || "—"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                          {m.education || "—"}
                        </span>
                      </div>
                      <Button asChild className="w-full mt-4 gradient-primary text-primary-foreground" size="sm">
                        <Link to={`/members/${m.user_id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    {rows.length === 0
                      ? "No other members yet. Ask friends to register and submit biodata, or check back soon."
                      : "No members found matching your filters"}
                  </p>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ActiveMembers;
