// @ts-nocheck

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { MercadoPagoConfig, Preference } from "npm:mercadopago@2.9.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, payer, order_id } = await req.json();
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    
    // Dynamically get the site URL from the request origin
    const origin = req.headers.get("origin");
    const siteUrl = origin || Deno.env.get("SITE_URL") || "http://localhost:8080";

    if (!accessToken) {
      throw new Error("Mercado Pago access token is not configured.");
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
        })),
        payer: {
          name: payer.name,
          email: payer.email,
        },
        back_urls: {
          success: `${siteUrl}/payment/success`,
          failure: `${siteUrl}/payment/failure`,
          pending: `${siteUrl}/payment/pending`,
        },
        auto_return: "approved",
        external_reference: order_id,
        notification_url: `https://rnehpkppkmgpngwlwdii.supabase.co/functions/v1/handle-payment-notification?source_news=webhooks`,
      },
    });

    return new Response(JSON.stringify({ preferenceId: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});