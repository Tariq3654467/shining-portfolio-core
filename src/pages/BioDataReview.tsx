import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard as Edit, Check, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

type BioData = {
  id: string;
  user_id: string;
  payload: Record<string, any>;
  private_fields: Record<string, boolean>;
  created_at: string;
  updated_at: string;
};

const BioDataReview = () => {
  const navigate = useNavigate();
  const [biodata, setBioData] = useState<BioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }
        setUser(user);

        const { data, error } = await supabase
          .from("biodatas")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) setBioData(data);
        else {
          toast.info("No biodata found. Please create one first.");
          navigate("/biodata");
        }
      } catch (e: any) {
        toast.error(e.message || "Failed to load biodata");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your biodata...</p>
      </div>
    );
  }

  if (!biodata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => navigate("/biodata")}>Create Biodata</Button>
      </div>
    );
  }

  const { payload, private_fields } = biodata;
  const sections = [
    { title: "Basic Information", keys: ["fullName", "gender", "dob", "age", "height", "maritalStatus", "religion", "caste", "casteOther", "intercaste", "motherTongue", "nationality"] },
    { title: "Location Details", keys: ["country", "areaOfResidence", "currentAddress", "permanentAddress", "relocate"] },
    { title: "Education & Career", keys: ["education", "fieldOfStudy", "occupation", "company", "income", "workLocation"] },
    { title: "Family Details", keys: ["fatherName", "motherName", "siblings", "familyType", "familyBackground"] },
    { title: "Partner Preferences", keys: ["prefAge", "prefHeight", "prefEducation", "prefCareer", "prefLocation", "prefCaste", "prefReligion", "prefLifestyle"] },
    { title: "About Me", keys: ["bio"] },
  ];

  const renderValue = (key: string, value: any) => {
    if (!value) return "-";
    return Array.isArray(value) ? value.join(", ") : String(value);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Your Biodata</h1>
          <p className="text-muted-foreground mt-2">Review and edit your profile information</p>
        </motion.div>

        <div className="grid gap-6 mb-8">
          {sections.map((section) => {
            const sectionData = section.keys
              .filter((k) => payload[k])
              .reduce((acc, k) => ({ ...acc, [k]: payload[k] }), {});

            if (Object.keys(sectionData).length === 0) return null;

            return (
              <motion.div key={section.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Object.entries(sectionData).map(([key, value]: [string, any]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                            {private_fields[key] && (
                              <Badge variant="outline" className="ml-2 inline text-xs gap-1">
                                <EyeOff className="h-2.5 w-2.5" /> Private
                              </Badge>
                            )}
                          </p>
                          <p className="font-medium">{renderValue(key, value)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <Check className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <Button onClick={() => navigate("/biodata")} className="gradient-primary text-primary-foreground">
            <Edit className="h-4 w-4 mr-2" /> Edit Biodata
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BioDataReview;
