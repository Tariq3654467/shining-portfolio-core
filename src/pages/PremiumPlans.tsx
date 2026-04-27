import { motion } from "framer-motion";
import { Check, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "Free",
    period: "30 Days",
    popular: false,
    features: [
      { text: "5 Express Interests", included: true },
      { text: "2 Gallery Photo Upload", included: true },
      { text: "Contact Info View", included: false },
      { text: "Auto Profile Match", included: false },
    ],
  },
  {
    name: "Silver",
    price: "$5",
    period: "/month",
    popular: false,
    features: [
      { text: "10 Express Interests", included: true },
      { text: "5 Gallery Photo Upload", included: true },
      { text: "5 Contact Info View", included: true },
      { text: "Auto Profile Match", included: false },
    ],
  },
  {
    name: "Gold",
    price: "$10",
    period: "/month",
    popular: true,
    features: [
      { text: "25 Express Interests", included: true },
      { text: "15 Gallery Photo Upload", included: true },
      { text: "15 Contact Info View", included: true },
      { text: "Auto Profile Match", included: true },
    ],
  },
  {
    name: "Platinum",
    price: "Custom",
    period: "",
    popular: false,
    features: [
      { text: "Unlimited Express Interests", included: true },
      { text: "Unlimited Photo Upload", included: true },
      { text: "Unlimited Contact View", included: true },
      { text: "Priority Personalized Match", included: true },
    ],
  },
];

const PremiumPlans = () => (
  <div className="py-16">
    <div className="container text-center">
      <h1 className="text-3xl md:text-4xl font-heading font-bold">Premium Plans</h1>
      <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
        Choose any of our packages as per your need. You'll get your money back anytime if we're unable to satisfy your need.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl border p-6 text-left flex flex-col ${
              plan.popular
                ? "border-primary shadow-xl scale-105 bg-card"
                : "bg-card hover:shadow-lg"
            } transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Most Popular
              </div>
            )}
            <h3 className="font-heading font-bold text-xl">{plan.name}</h3>
            <div className="mt-3 mb-6">
              <span className="text-3xl font-heading font-bold">{plan.price}</span>
              <span className="text-muted-foreground text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-3 flex-1">
              {plan.features.map((f) => (
                <li key={f.text} className="flex items-center gap-2 text-sm">
                  {f.included ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground/40" />
                  )}
                  <span className={f.included ? "" : "text-muted-foreground/50 line-through"}>{f.text}</span>
                </li>
              ))}
            </ul>
            {plan.name === "Platinum" ? (
              <Link to="/contact">
                <Button variant="outline" className="w-full mt-6 border-primary text-primary hover:bg-accent">
                  Contact Us
                </Button>
              </Link>
            ) : (
              <Button className={`w-full mt-6 ${plan.popular ? "gradient-primary text-primary-foreground" : ""}`} variant={plan.popular ? "default" : "outline"}>
                {plan.price === "Free" ? "Get Started" : "Purchase"}
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default PremiumPlans;
