import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const expectations = [
  { label: "Serious about marriage", size: "lg" },
  { label: "Respect & Understanding", size: "lg" },
  { label: "Family Values", size: "md" },
  { label: "Honesty & Trust", size: "md" },
  { label: "Good Communication", size: "lg" },
  { label: "Education & Career Preferences", size: "xl" },
  { label: "Lifestyle Compatibility", size: "md" },
  { label: "Cultural & Religious Compatibility", size: "xl" },
  { label: "Caste Preference", size: "md" },
  { label: "Intercaste Preference", size: "md" },
  { label: "Location-Based Matching", size: "md" },
  { label: "Shared Future Goals", size: "lg" },
  { label: "Mutual Growth & Support", size: "lg" },
];

const sizeMap = {
  sm: "w-20 h-20 text-xs",
  md: "w-24 h-24 text-xs",
  lg: "w-28 h-28 text-sm",
  xl: "w-32 h-32 text-xs",
};

const Expectations = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-8 px-4">
      {/* Top bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-2">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground font-medium">
          Skip
        </Link>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-1 bg-muted rounded-full mb-8">
        <div className="h-full w-1/3 gradient-primary rounded-full" />
      </div>

      <h1 className="text-2xl md:text-3xl font-heading font-bold text-center mb-2">
        Expectations from a Life Partner
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-8 max-w-md">
        Pick what matters most to you in your future partner.
      </p>

      {/* Bubble grid */}
      <div className="flex flex-wrap justify-center gap-3 max-w-lg mb-10">
        {expectations.map((item, i) => {
          const isSelected = selected.includes(item.label);
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(item.label)}
              className={`${sizeMap[item.size as keyof typeof sizeMap]} rounded-full flex items-center justify-center text-center p-2 font-medium transition-all duration-200 leading-tight ${
                isSelected
                  ? "gradient-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {item.label}
            </motion.button>
          );
        })}
      </div>

      {/* Continue */}
      <div className="w-full max-w-md">
        <Button
          size="lg"
          className="w-full gradient-primary text-primary-foreground text-lg"
          disabled={selected.length === 0}
          onClick={() => navigate("/dashboard")}
        >
          Continue
        </Button>
        {selected.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            {selected.length} selected
          </p>
        )}
      </div>
    </div>
  );
};

export default Expectations;
