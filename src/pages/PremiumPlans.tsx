import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Star, CreditCard, Smartphone, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import StripeCheckout from "@/components/StripeCheckout";
import PayPalCheckout from "@/components/PayPalCheckout";
import MobilePaymentCheckout from "@/components/MobilePaymentCheckout";
import BankTransferCheckout from "@/components/BankTransferCheckout";

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
      { text: "Verified Badge", included: false },
    ],
  },
  {
    name: "Silver",
    price: "Rs 500",
    period: "/month",
    popular: false,
    features: [
      { text: "10 Express Interests", included: true },
      { text: "5 Gallery Photo Upload", included: true },
      { text: "5 Contact Info View", included: true },
      { text: "Auto Profile Match", included: false },
      { text: "Verified Badge", included: true },
    ],
  },
  {
    name: "Gold",
    price: "Rs 1000",
    period: "/month",
    popular: true,
    features: [
      { text: "25 Express Interests", included: true },
      { text: "15 Gallery Photo Upload", included: true },
      { text: "15 Contact Info View", included: true },
      { text: "Auto Profile Match", included: true },
      { text: "Verified Badge", included: true },
    ],
  },
  {
    name: "Platinum",
    price: "Rs 2000",
    period: "/month",
    popular: false,
    features: [
      { text: "Unlimited Express Interests", included: true },
      { text: "Unlimited Photo Upload", included: true },
      { text: "Unlimited Contact View", included: true },
      { text: "Priority Personalized Match", included: true },
      { text: "Premium Verified Badge", included: true },
    ],
  },
];

const paymentMethods = [
  {
    name: "PayPal",
    icon: CreditCard,
    description: "Secure international payment",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Bank Transfer",
    icon: Building2,
    description: "Direct bank payment in Nepal",
    color: "from-green-500 to-green-600",
  },
  {
    name: "Mobile Payment",
    icon: Smartphone,
    description: "eSewa, Khalti, IME Pay",
    color: "from-purple-500 to-purple-600",
  },
];

const PaymentMethodSelector = ({
  plan,
  planName,
}: {
  plan: "silver" | "gold" | "platinum";
  planName: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full gradient-primary text-primary-foreground"
      >
        Subscribe Now
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Tabs defaultValue="international" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="international">International</TabsTrigger>
                  <TabsTrigger value="local">Local Payment</TabsTrigger>
                </TabsList>

                <TabsContent value="international" className="space-y-3">
                  <StripeCheckout plan={plan} planName={planName} />
                  <PayPalCheckout plan={plan} planName={planName} />
                </TabsContent>

                <TabsContent value="local" className="space-y-3">
                  <MobilePaymentCheckout
                    plan={plan}
                    provider="esewa"
                    providerName="eSewa"
                  />
                  <MobilePaymentCheckout
                    plan={plan}
                    provider="khalti"
                    providerName="Khalti"
                  />
                  <MobilePaymentCheckout
                    plan={plan}
                    provider="ime-pay"
                    providerName="IME Pay"
                  />
                  <BankTransferCheckout plan={plan} />
                </TabsContent>
              </Tabs>

              <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

const PremiumPlans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const handlePurchase = (planName: string) => {
    if (planName === "Free") {
      navigate("/dashboard");
      return;
    }
    setSelectedPlan(planName);
    setShowPaymentMethods(true);
  };

  return (
    <div className="py-16 px-4">
      <div className="container max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Premium Plans</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Choose the perfect plan for your matrimony journey. All plans include full biodata creation and advanced search features.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 text-left flex flex-col ${
                plan.popular
                  ? "border-primary shadow-2xl lg:scale-105 bg-gradient-to-br from-primary/5 to-card"
                  : "bg-card hover:shadow-lg"
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" /> Most Popular
                </div>
              )}
              <h3 className="font-heading font-bold text-xl">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-heading font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                    )}
                    <span className={f.included ? "" : "text-muted-foreground/50 line-through"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              {plan.price === "Free" ? (
                <Button
                  onClick={() => navigate("/biodata")}
                  className={`w-full ${plan.popular ? "gradient-primary text-primary-foreground" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              ) : (
                <PaymentMethodSelector
                  plan={plan.name.toLowerCase() as "silver" | "gold" | "platinum"}
                  planName={plan.name}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Payment Methods Section */}
        {showPaymentMethods && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Payment Methods for {selectedPlan} Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.button
                        key={method.name}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          if (method.name === "PayPal") {
                            alert(`Redirecting to PayPal payment for ${selectedPlan} plan...`);
                          } else if (method.name === "Bank Transfer") {
                            alert("Bank transfer details:\nAccount: BiheNepal\nBank: Nepal Bank Limited\nAccount No: 1234567890");
                          } else {
                            alert("Mobile Payment Options:\n- eSewa\n- Khalti\n- IME Pay\n\nContact support for payment details.");
                          }
                        }}
                        className="relative rounded-xl border p-6 text-center hover:shadow-lg transition-all"
                      >
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-heading font-semibold mb-1">{method.name}</h4>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setShowPaymentMethods(false)}>
                    Back to Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FAQ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card border rounded-2xl p-8">
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold mb-2">Can I upgrade/downgrade my plan?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-2">Is there a money-back guarantee?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! If you're not satisfied within 7 days, we'll refund your full payment.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept PayPal, bank transfers, and mobile payment options like eSewa and Khalti.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-2">Is my payment information secure?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, all payments are processed through secure, encrypted channels.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Why Choose BiheNepal Premium?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Get access to advanced matching, unlimited views, and connect with verified members to find your perfect life partner.
          </p>
          <Link to="/biodata">
            <Button className="gradient-primary text-primary-foreground px-8 py-6">
              Start Your Journey <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPlans;
