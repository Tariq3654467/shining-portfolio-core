import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";
import Stripe from "npm:stripe@13.11.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentRequest {
  plan: "silver" | "gold" | "platinum";
  userId: string;
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const planDetails: Record<string, { name: string; amount: number; description: string }> = {
  silver: {
    name: "Silver Plan",
    amount: 50000,
    description: "Rs 500/month - 10 Express Interests",
  },
  gold: {
    name: "Gold Plan",
    amount: 100000,
    description: "Rs 1000/month - Unlimited Express Interests",
  },
  platinum: {
    name: "Platinum Plan",
    amount: 200000,
    description: "Rs 2000/month - Premium features",
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "POST") {
      const { plan, userId }: PaymentRequest = await req.json();

      if (!plan || !userId || !planDetails[plan]) {
        return new Response(
          JSON.stringify({ error: "Invalid plan or userId" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { name, amount, description } = planDetails[plan];

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name,
                description,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
        cancel_url: `${Deno.env.get("VITE_APP_URL") || "http://localhost:5173"}/premium-plans`,
        customer_email_collection: {
          allow_promotion_codes: true,
        },
        metadata: {
          userId,
          plan,
        },
      });

      await supabase.from("payment_sessions").insert({
        user_id: userId,
        plan,
        stripe_session_id: session.id,
        status: "pending",
      });

      return new Response(JSON.stringify({ sessionId: session.id }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        return new Response(JSON.stringify({ error: "Missing session_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        await supabase
          .from("payment_sessions")
          .update({ status: "completed" })
          .eq("stripe_session_id", sessionId);
      }

      return new Response(JSON.stringify({ status: session.payment_status, session }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
