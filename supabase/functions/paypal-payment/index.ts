import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PayPalPaymentRequest {
  plan: "silver" | "gold" | "platinum";
  userId: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID") || "";
const paypalSecret = Deno.env.get("PAYPAL_SECRET") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const planDetails: Record<string, { name: string; amount: string; description: string }> = {
  silver: {
    name: "Silver Plan",
    amount: "5.00",
    description: "Rs 500/month - 10 Express Interests",
  },
  gold: {
    name: "Gold Plan",
    amount: "10.00",
    description: "Rs 1000/month - Unlimited Express Interests",
  },
  platinum: {
    name: "Platinum Plan",
    amount: "20.00",
    description: "Rs 2000/month - Premium features",
  },
};

async function getPayPalAccessToken() {
  const auth = btoa(`${paypalClientId}:${paypalSecret}`);
  const response = await fetch("https://api.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json() as any;
  return data.access_token;
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
      const { plan, userId }: PayPalPaymentRequest = await req.json();

      if (!plan || !userId || !planDetails[plan]) {
        return new Response(
          JSON.stringify({ error: "Invalid plan or userId" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!paypalClientId || !paypalSecret) {
        return new Response(
          JSON.stringify({ error: "PayPal credentials not configured" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { name, amount, description } = planDetails[plan];
      const accessToken = await getPayPalAccessToken();

      const paypalOrder = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
            description,
          },
        ],
        return_url: `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/paypal-success?plan=${plan}`,
        cancel_url: `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/premium-plans`,
      };

      const response = await fetch("https://api.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paypalOrder),
      });

      const orderData = await response.json() as any;

      if (orderData.id) {
        await supabase.from("payment_sessions").insert({
          user_id: userId,
          plan,
          payment_method: "paypal",
          paypal_order_id: orderData.id,
          status: "pending",
        });

        const approveLink = orderData.links?.find((link: any) => link.rel === "approve");

        return new Response(
          JSON.stringify({
            orderId: orderData.id,
            approvalUrl: approveLink?.href,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to create PayPal order" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("PayPal error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
