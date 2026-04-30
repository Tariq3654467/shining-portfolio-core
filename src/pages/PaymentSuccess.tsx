import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck as CheckCircle, Clock, Circle as XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "pending" | "failed">("loading");
  const [plan, setPlan] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const planParam = searchParams.get("plan");

        if (!sessionId) {
          setStatus("failed");
          return;
        }

        setPlan(planParam || "");

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-payment?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );

        const data = await response.json();

        if (data.status === "paid") {
          setStatus("success");
          toast.success("Payment successful! Your subscription is now active.");
        } else if (data.status === "unpaid") {
          setStatus("pending");
          toast.info("Payment is processing. Please wait...");
        } else {
          setStatus("failed");
          toast.error("Payment failed. Please try again.");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        toast.error("Failed to verify payment");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardContent className="pt-8">
            <div className="text-center">
              {status === "success" && (
                <>
                  <div className="flex justify-center mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Payment Successful!</h2>
                  <p className="text-muted-foreground mb-4">
                    Your {plan} plan subscription is now active.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>✓ Your account has been upgraded</li>
                      <li>✓ All premium features are now available</li>
                      <li>✓ You can start using advanced search and filters</li>
                    </ul>
                  </div>
                  <Button onClick={() => navigate("/dashboard")} className="w-full gradient-primary text-primary-foreground">
                    Go to Dashboard
                  </Button>
                </>
              )}

              {status === "pending" && (
                <>
                  <div className="flex justify-center mb-6">
                    <Clock className="h-16 w-16 text-blue-500 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Payment Processing</h2>
                  <p className="text-muted-foreground mb-6">
                    Your payment is being processed. We'll update your subscription shortly.
                  </p>
                  <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                    Back to Dashboard
                  </Button>
                </>
              )}

              {status === "failed" && (
                <>
                  <div className="flex justify-center mb-6">
                    <XCircle className="h-16 w-16 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-2">Payment Failed</h2>
                  <p className="text-muted-foreground mb-6">
                    There was an issue processing your payment. Please try again.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={() => navigate("/premium-plans")} className="w-full gradient-primary text-primary-foreground">
                      Try Again
                    </Button>
                    <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                      Back to Dashboard
                    </Button>
                  </div>
                </>
              )}

              {status === "loading" && (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                  <p className="text-muted-foreground">Verifying your payment...</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
