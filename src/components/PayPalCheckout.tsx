import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader as Loader2, DollarSign } from "lucide-react";

interface PayPalCheckoutProps {
  plan: "silver" | "gold" | "platinum";
  planName: string;
}

const PayPalCheckout = ({ plan, planName }: PayPalCheckoutProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayPal = async () => {
    if (!user) {
      toast.error("Please log in to purchase a plan");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            plan,
            userId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize PayPal payment");
      }

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "PayPal payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayPal}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <DollarSign className="h-4 w-4 mr-2" />
          PayPal
        </>
      )}
    </Button>
  );
};

export default PayPalCheckout;
