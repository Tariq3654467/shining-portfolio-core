import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader as Loader2, Smartphone } from "lucide-react";

interface MobilePaymentCheckoutProps {
  plan: "silver" | "gold" | "platinum";
  provider: "esewa" | "khalti" | "ime-pay";
  providerName: string;
}

const MobilePaymentCheckout = ({
  plan,
  provider,
  providerName,
}: MobilePaymentCheckoutProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleMobilePayment = async () => {
    if (!user) {
      toast.error("Please log in to purchase a plan");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mobile-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            plan,
            userId: user.id,
            provider,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      if (provider === "esewa" && data.paymentUrl) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.paymentUrl;

        Object.entries(data.config).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else if (provider === "khalti") {
        window.location.href = `https://khalti.com/checkout/?key=${data.config.public_key}&amount=${data.config.amount}&product_identity=${data.config.product_identity}&product_name=${data.config.product_name}&merchant_name=${data.config.merchant_name}&return_url=${data.config.return_url}`;
      } else if (provider === "ime-pay" && data.paymentUrl) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.paymentUrl;

        Object.entries(data.config).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error: any) {
      toast.error(error.message || `${providerName} payment initialization failed`);
    } finally {
      setLoading(false);
    }
  };

  const providerColors: Record<string, string> = {
    esewa: "bg-green-600 hover:bg-green-700",
    khalti: "bg-purple-600 hover:bg-purple-700",
    "ime-pay": "bg-orange-600 hover:bg-orange-700",
  };

  return (
    <Button
      onClick={handleMobilePayment}
      disabled={loading}
      className={`w-full text-white ${providerColors[provider]}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Smartphone className="h-4 w-4 mr-2" />
          {providerName}
        </>
      )}
    </Button>
  );
};

export default MobilePaymentCheckout;
