import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="py-12 px-4">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/premium-plans">
            <Button variant="ghost" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Plans
            </Button>
          </Link>
          <h1 className="text-4xl font-heading font-bold">Terms & Conditions</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to eBihe.com ("we," "us," "our," or "Company"). These Terms & Conditions ("Terms") govern your use of our website and services. By accessing and using eBihe.com, you agree to be bound by these Terms. If you do not agree to abide by these Terms, please do not use this service.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">2. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you create an account with eBihe.com, you agree to:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your password</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
              <li>Use the service only for lawful purposes and in accordance with these Terms</li>
            </ul>
          </section>

          {/* Biodata Creation */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">3. Biodata & Profile Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for the content of your biodata and profile. You agree not to post any content that is:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc mt-3">
              <li>Offensive, abusive, or harassing</li>
              <li>False, misleading, or fraudulent</li>
              <li>Violative of any person's rights or laws</li>
              <li>Promotional or commercial in nature</li>
              <li>Contains personal information of third parties without consent</li>
            </ul>
          </section>

          {/* Subscription Plans */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">4. Subscription Plans & Pricing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              eBihe.com offers multiple subscription plans:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li><strong>Free Plan:</strong> Free for 30 days with limited features</li>
              <li><strong>Silver Plan:</strong> $5/month for enhanced features</li>
              <li><strong>Gold Plan:</strong> $10/month for premium features</li>
              <li><strong>Platinum & Custom Plans:</strong> Contact us for custom pricing and requirements</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              All prices are subject to change without notice. We will provide notice of any price changes. Your continued use after such notice constitutes acceptance of the new pricing.
            </p>
          </section>

          {/* Payments & Refunds */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">5. Payments & Refunds</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              <strong>Payment Terms:</strong> All payments are charged to your selected payment method at the start of your billing cycle.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Refund Policy:</strong> We offer a 7-day money-back guarantee for new subscribers. If you are not satisfied with the service within 7 days of purchase, contact us for a full refund. Refunds after 7 days are at the sole discretion of eBihe.com.
            </p>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">6. User Conduct & Prohibited Activities</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 list-disc">
              <li>Harassing, threatening, or abusing other users</li>
              <li>Creating multiple fake accounts</li>
              <li>Attempting to hack or gain unauthorized access</li>
              <li>Using automated tools or bots to access the service</li>
              <li>Sharing explicit or inappropriate content</li>
              <li>Scamming or defrauding other users</li>
              <li>Violating others' privacy or intellectual property rights</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              eBihe.com is provided on an "AS IS" basis. We do not warrant that the service will be uninterrupted or error-free. To the maximum extent permitted by law, eBihe.com shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the service.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">8. Privacy & Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your use of eBihe.com is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information.
            </p>
          </section>

          {/* Amendments */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-heading font-bold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-card border rounded-lg">
              <p className="text-muted-foreground"><strong>Email:</strong> support@ebihe.com</p>
              <p className="text-muted-foreground"><strong>Phone:</strong> +1 (530) 574-9007</p>
              <p className="text-muted-foreground"><strong>Address:</strong> eBihe.com, Kathmandu, Nepal</p>
            </div>
          </section>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12 text-center">
          <Link to="/premium-plans">
            <Button className="gradient-primary text-primary-foreground px-8">
              Back to Premium Plans
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsConditions;
