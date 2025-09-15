import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MercadoPagoConfig, Payment } from "npm:mercadopago@2.0.0-beta.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

    if (!accessToken) {
      throw new Error("Mercado Pago access token is not configured.");
    }

    const { type, data } = await req.json();

    if (type === "payment") {
      const client = new MercadoPagoConfig({ accessToken });
      const payment = new Payment(client);

      const paymentInfo = await payment.get({ id: data.id });

      if (paymentInfo && paymentInfo.status === "approved") {
        const orderId = paymentInfo.external_reference;

        // 1. Update order status
        const { error: orderError } = await supabaseAdmin
          .from("orders")
          .update({ status: "paid" })
          .eq("id", orderId);

        if (orderError) throw new Error(`Error updating order: ${orderError.message}`);

        // 2. Get order items
        const { data: items, error: itemsError } = await supabaseAdmin
          .from("order_items")
          .select("product_id")
          .eq("order_id", orderId);
        
        if (itemsError) throw new Error(`Error fetching order items: ${itemsError.message}`);

        // 3. Mark products as sold
        const productIds = items.map(item => item.product_id);
        const { error: productError } = await supabaseAdmin
          .from("products")
          .update({ is_sold: true })
          .in("id", productIds);

        if (productError) throw new Error(`Error updating products: ${productError.message}`);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});