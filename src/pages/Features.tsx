import { motion } from "framer-motion";
import { Check, Users, Search, Heart, Shield, Zap, FileText, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Comprehensive Biodata",
      description: "Create a detailed marriage biodata with all essential information including education, profession, family background, and partner preferences.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Search,
      title: "Advanced Search & Filters",
      description: "Find your ideal match using 8+ detailed filters: age, height, religion, caste, education, location, marital status, and more.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Smart Matching",
      description: "Our intelligent matching algorithm connects you with profiles that align with your preferences and requirements.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Heart,
      title: "Like & Connection",
      description: "Express interest in profiles you like and get notified when someone matches with you.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All members are verified through email and phone verification for a safe and trustworthy community.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Lock,
      title: "Privacy Controls",
      description: "Mark specific fields as private (caste, income, contact) to control what information you share.",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your account with your email and password. Quick and secure registration.",
      details: ["Enter email and password", "Verify your email", "Complete basic profile"],
    },
    {
      step: 2,
      title: "Create Biodata",
      description: "Fill out your comprehensive marriage biodata across 6 easy steps.",
      details: ["Basic Information (age, height, religion, caste)", "Location Details", "Education & Career", "Family Details", "Partner Preferences", "About You"],
    },
    {
      step: 3,
      title: "Verify Identity",
      description: "Complete email and phone verification to become a verified member.",
      details: ["Verify email address", "Verify phone number", "Gain full access to all features"],
    },
    {
      step: 4,
      title: "Search & Browse",
      description: "Use advanced filters to find matches based on your preferences.",
      details: ["Filter by age, height, education", "Filter by religion, caste, location", "View detailed profiles"],
    },
    {
      step: 5,
      title: "Express Interest",
      description: "Like profiles and send connection requests to people you're interested in.",
      details: ["Like profiles", "Send messages", "Get real-time notifications"],
    },
    {
      step: 6,
      title: "Connect & Chat",
      description: "Once matched, start conversations and get to know each other.",
      details: ["Private messaging", "Safe communication", "Share information gradually"],
    },
  ];

  return (
    <div className="py-16 px-4">
      <div className="container max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">How BiheNepal Works</h1>
          <p className="text-xl text-muted-foreground mt-4">
            A complete guide to finding your perfect match
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-20">
          <h2 className="text-3xl font-heading font-bold mb-10 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Step-by-Step Guide */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-20">
          <h2 className="text-3xl font-heading font-bold mb-10 text-center">Step-by-Step Guide</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-6 p-6">
                      {/* Step Number */}
                      <div className="flex-shrink-0 flex items-start">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-primary text-white font-heading font-bold text-lg">
                          {step.step}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Matching Criteria */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-20">
          <h2 className="text-3xl font-heading font-bold mb-10 text-center">Smart Matching Criteria</h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Primary Filters
                  </h3>
                  <ul className="space-y-3">
                    {["Age & Height Compatibility", "Religion Match", "Caste Preference", "Education Level", "Geographic Location"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Secondary Filters
                  </h3>
                  <ul className="space-y-3">
                    {["Marital Status", "Career & Occupation", "Lifestyle Expectations", "Family Background", "Intercaste Openness"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Safety */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-20">
          <h2 className="text-3xl font-heading font-bold mb-10 text-center">Your Privacy & Safety</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Mark sensitive information as private:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Caste/Ethnicity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Income Information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Contact Details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Custom Fields</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Safety Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">We prioritize your safety:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Verified members only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>No spam or fake profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Private messaging only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>Report & block options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center">
          <Button
            onClick={() => navigate("/register")}
            className="gradient-primary text-primary-foreground px-8 py-6 text-lg"
          >
            Get Started Today
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
