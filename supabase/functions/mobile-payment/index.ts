import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MobilePaymentRequest {
  plan: "silver" | "gold" | "platinum";
  userId: string;
  provider: "esewa" | "khalti" | "ime-pay";
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const planDetails: Record<string, { name: string; amount: number; description: string; priceNPR: number }> = {
  silver: {
    name: "Silver Plan",
    amount: 5,
    description: "10 Express Interests",
    priceNPR: 500,
  },
  gold: {
    name: "Gold Plan",
    amount: 10,
    description: "Unlimited Express Interests",
    priceNPR: 1000,
  },
  platinum: {
    name: "Platinum Plan",
    amount: 20,
    description: "Premium features",
    priceNPR: 2000,
  },
};

async function initiateEsewaPayment(plan: string, userId: string, amount: number) {
  const successUrl = `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/payment-success?provider=esewa&plan=${plan}&userId=${userId}`;
  const failureUrl = `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/premium-plans?error=payment_failed`;

  const esewaConfig = {
    amt: amount,
    psc: 0,
    txAmt: amount,
    su: successUrl,
    fu: failureUrl,
    pid: `BIHE-${userId}-${Date.now()}`,
  };

  return {
    provider: "esewa",
    config: esewaConfig,
    paymentUrl: "https://esewa.com.np/epay/main",
  };
}

async function initiateKhaltiPayment(plan: string, userId: string, amount: number) {
  const khaltiPublicKey = Deno.env.get("KHALTI_PUBLIC_KEY") || "";

  return {
    provider: "khalti",
    config: {
      public_key: khaltiPublicKey,
      amount: amount * 100,
      product_identity: `BIHE-${userId}-${Date.now()}`,
      product_name: planDetails[plan].name,
      product_url: `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/premium-plans`,
      merchant_name: "BiheNepal",
      return_url: `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/payment-success?provider=khalti&plan=${plan}`,
    },
  };
}

async function initiateIMEPayPayment(plan: string, userId: string, amount: number) {
  const successUrl = `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/payment-success?provider=ime-pay&plan=${plan}&userId=${userId}`;

  return {
    provider: "ime-pay",
    config: {
      amount: amount,
      transaction_id: `BIHE-${userId}-${Date.now()}`,
      product_name: planDetails[plan].name,
      merchant_name: "BiheNepal",
      merchant_code: "BIHE",
      success_url: successUrl,
      failure_url: `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/premium-plans`,
    },
    paymentUrl: "https://payment.imepay.com.np/api/pay",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "POST") {
      const { plan, userId, provider }: MobilePaymentRequest = await req.json();

      if (!plan || !userId || !provider || !planDetails[plan]) {
        return new Response(
          JSON.stringify({ error: "Invalid plan, userId, or provider" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { priceNPR } = planDetails[plan];
      let paymentData;

      if (provider === "esewa") {
        paymentData = await initiateEsewaPayment(plan, userId, priceNPR);
      } else if (provider === "khalti") {
        paymentData = await initiateKhaltiPayment(plan, userId, priceNPR);
      } else if (provider === "ime-pay") {
        paymentData = await initiateIMEPayPayment(plan, userId, priceNPR);
      } else {
        return new Response(
          JSON.stringify({ error: "Unsupported payment provider" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      await supabase.from("payment_sessions").insert({
        user_id: userId,
        plan,
        payment_method: provider,
        status: "pending",
      });

      return new Response(JSON.stringify(paymentData), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Mobile payment error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
