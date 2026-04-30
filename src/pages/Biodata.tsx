import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "number-range";
  options?: string[];
  optional?: boolean;
  privateToggle?: boolean;
  allowManualEntry?: boolean;
};

const CASTE_OPTIONS = [
  "Chhetri",
  "Bahun / Hill Brahmin",
  "Thakuri",
  "Sanyasi / Dashnami",
  "Bishwakarma (Kami)",
  "Pariyar (Damai/Dholi)",
  "Mijar (Sarki)",
  "Magar",
  "Gurung",
  "Ghale",
  "Tamang",
  "Chepang / Praja",
  "Jirel",
  "Rai",
  "Limbu",
  "Sunuwar",
  "Sherpa",
  "Bhote",
  "Thakali",
  "Tharu",
  "Danuwar",
  "Rajbanshi",
  "Santhal",
  "Dhimal",
  "Newar Brahmins (Rajopadhyaya)",
  "Shrestha (Kshatriya)",
  "Uray groups",
  "Jyapu groups",
  "Maithil Brahmin",
  "Rajput",
  "Kayastha",
  "Kushwaha/Koiri",
  "Yadav",
  "Teli",
  "Sudi",
  "Kurmi",
  "Bania/Kalwar",
  "Halwai",
  "Mallah",
  "Mali",
  "Rajbhar",
  "Chamar",
  "Dhanuk",
  "Dom",
  "Musahar",
  "Tatma",
  "Terai Muslims",
  "Hill Muslims (Churaute)",
  "Marwadi",
  "Bengali",
  "Punjabi/Sikh",
  "Other",
  "Prefer not to say"
];

const steps: { title: string; description: string; fields: Field[] }[] = [
  {
    title: "Basic Information",
    description: "Tell us about yourself",
    fields: [
      { key: "fullName", label: "Full Name" },
      { key: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
      { key: "dob", label: "Date of Birth", type: "date" },
      { key: "age", label: "Age", type: "number", allowManualEntry: true },
      { key: "height", label: "Height (e.g., 5'8\" or cm)", type: "text", allowManualEntry: true },
      { key: "maritalStatus", label: "Marital Status", type: "select", options: ["Never Married", "Divorced", "Widowed"] },
      { key: "religion", label: "Religion", type: "select", options: ["Hindu", "Buddhist", "Christian", "Muslim", "Other"] },
      { key: "caste", label: "Caste / Ethnicity", type: "select", options: CASTE_OPTIONS, privateToggle: true, optional: true },
      { key: "casteOther", label: "If Other, please specify", type: "text", optional: true },
      { key: "intercaste", label: "Intercaste Preference", type: "select", options: ["Yes", "No", "Open"] },
      { key: "motherTongue", label: "Mother Tongue", type: "select", options: ["Nepali","Newari","Maithili","Hindi","English","Other"] },
      { key: "nationality", label: "Nationality", type: "select", options: ["Nepali","Indian","American","British","Australian","Other"] },
    ],
  },
  {
    title: "Location Details",
    description: "Where are you based?",
    fields: [
      { key: "country", label: "Country", type: "select", options: ["Nepal","India","USA","UK","Australia","Canada","Other"] },
      { key: "areaOfResidence", label: "Area of Residence (City/District)" },
      { key: "currentAddress", label: "Current Address", optional: true },
      { key: "permanentAddress", label: "Permanent Address", optional: true },
      { key: "relocate", label: "Willing to Relocate", type: "select", options: ["Yes","No","Maybe"] },
    ],
  },
  {
    title: "Education & Career",
    description: "Your professional background",
    fields: [
      { key: "education", label: "Highest Education", type: "select", options: ["High School","Bachelors","Masters","Doctorate","Other"] },
      { key: "fieldOfStudy", label: "Field of Study" },
      { key: "occupation", label: "Occupation / Profession" },
      { key: "company", label: "Company / Organization", optional: true },
      { key: "income", label: "Annual Income", type: "select", options: ["< 5 Lakh","5 – 10 Lakh","10 – 20 Lakh","20 – 50 Lakh","50 Lakh+","Prefer not to say"], optional: true, privateToggle: true },
      { key: "workLocation", label: "Work Location" },
    ],
  },
  {
    title: "Family Details",
    description: "About your family",
    fields: [
      { key: "fatherName", label: "Father's Name & Occupation" },
      { key: "motherName", label: "Mother's Name & Occupation" },
      { key: "siblings", label: "Number of Siblings", type: "select", options: ["0","1","2","3","4+"] },
      { key: "familyType", label: "Family Type", type: "select", options: ["Joint","Nuclear"] },
      { key: "familyBackground", label: "Family Background", type: "textarea", optional: true },
    ],
  },
  {
    title: "Partner Preferences",
    description: "What you're looking for",
    fields: [
      { key: "prefAge", label: "Preferred Age Range", type: "select", options: ["18-24","22-28","25-32","28-35","32-40","40+"] },
      { key: "prefHeight", label: "Preferred Height", type: "select", options: ["< 5'0\"","5'0\" – 5'4\"","5'4\" – 5'8\"","5'8\" – 6'0\"","6'0\"+","No Preference"] },
      { key: "prefEducation", label: "Education Preference", type: "select", options: ["Bachelors+","Masters+","Doctorate","No Preference"] },
      { key: "prefCareer", label: "Career Preference", type: "select", options: ["Working","Business","Government Job","Self-employed","No Preference"] },
      { key: "prefLocation", label: "Location Preference", type: "select", options: ["Same City","Same Country","Anywhere"] },
      { key: "prefCaste", label: "Caste Preference", type: "select", options: ["Same","Intercaste","No Preference"] },
      { key: "prefReligion", label: "Religion Preference", type: "select", options: ["Hindu","Buddhist","Christian","Muslim","No Preference"] },
      { key: "prefLifestyle", label: "Lifestyle Expectations", type: "select", options: ["Traditional","Modern","Balanced","No Preference"] },
    ],
  },
  {
    title: "About Me",
    description: "Tell your story",
    fields: [
      { key: "bio", label: "Short Bio (personality, values, expectations)", type: "textarea" },
    ],
  },
];

const Biodata = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [privateFields, setPrivateFields] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  useEffect(() => {
    const loadExistingBiodata = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: biodata } = await supabase
            .from("biodatas")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          if (biodata) {
            setData(biodata.payload || {});
            setPrivateFields(biodata.private_fields || {});
            setProfilePictureUrl(biodata.profile_picture_url || "");
            setStep(steps.length - 1);
          }
        }
      } catch (e) {
        console.error("Failed to load biodata:", e);
      } finally {
        setLoading(false);
      }
    };
    loadExistingBiodata();
  }, []);

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const update = (k: string, v: string) => setData((p) => ({ ...p, [k]: v }));
  const togglePrivate = (k: string) => setPrivateFields((p) => ({ ...p, [k]: !p[k] }));

  const validateStep = () => {
    for (const f of current.fields) {
      if (!f.optional && !data[f.key]) {
        toast.error(`${f.label} is required`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save biodata");
        navigate("/login");
        return;
      }

      const { data: existingBiodata } = await supabase
        .from("biodatas")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const bioDataPayload = {
        user_id: user.id,
        payload: data,
        private_fields: privateFields,
        profile_picture_url: profilePictureUrl,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (existingBiodata) {
        const result = await supabase
          .from("biodatas")
          .update(bioDataPayload)
          .eq("user_id", user.id);
        error = result.error;
      } else {
        const result = await supabase
          .from("biodatas")
          .insert(bioDataPayload);
        error = result.error;
      }

      if (error) throw error;
      toast.success("Biodata saved successfully!");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e.message || "Failed to save biodata. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (f: Field) => {
    const isPrivate = privateFields[f.key];
    return (
      <div key={f.key} className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {f.label} {f.optional && <span className="text-xs text-muted-foreground">(optional)</span>}
          </label>
          {f.privateToggle && (
            <button
              type="button"
              onClick={() => togglePrivate(f.key)}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              {isPrivate ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {isPrivate ? "Private" : "Public"}
            </button>
          )}
        </div>
        {f.type === "select" ? (
          <Select value={data[f.key] || ""} onValueChange={(v) => update(f.key, v)}>
            <SelectTrigger><SelectValue placeholder={`Select ${f.label.toLowerCase()}`} /></SelectTrigger>
            <SelectContent>
              {f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : f.type === "textarea" ? (
          <Textarea value={data[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} rows={4} />
        ) : (
          <Input type={f.type || "text"} value={data[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your biodata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Marriage Biodata</h1>
          <p className="text-sm text-muted-foreground mt-1">Step {step + 1} of {steps.length}</p>
        </div>

        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground mb-6">
          {steps.map((s, i) => (
            <span key={s.title} className={`hidden sm:block ${i <= step ? "text-primary font-medium" : ""}`}>
              {i < step && <Check className="inline h-3 w-3 mr-0.5" />}
              {s.title.split(" ")[0]}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-card border rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-xl font-heading font-semibold">{current.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{current.description}</p>

            {step === 0 && user && (
              <div className="mb-8 pb-8 border-b">
                <p className="text-sm font-medium mb-4">Profile Picture</p>
                <ProfilePictureUpload
                  userId={user.id}
                  currentImageUrl={profilePictureUrl}
                  onImageUpload={setProfilePictureUrl}
                  displayName={data.fullName || "User"}
                />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {current.fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  {renderField(f)}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6 gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0 || submitting}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={submitting}
            className="gradient-primary text-primary-foreground min-w-[140px]"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            {step === steps.length - 1 ? "Submit Biodata" : "Next"}
            {step !== steps.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Biodata;
