'use server';

import MercadoPagoConfig, { Payment } from "mercadopago";
import { NextResponse } from "next/server";
import crypto from "crypto";

const mercadopago = new MercadoPagoConfig({ accessToken: process.env.NEXT_PRIVATE_MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(request: Request) {

    const body = await request.json();
    console.log("body", body);

    if (body.type === "payment") {

        const checked = checkSignature(request, body.data.id);
        if (!checked) return NextResponse.json({ status: 400 });
        
        const payment = await new Payment(mercadopago).get({ id: body.data.id });
        console.log("payment", payment);

        if (payment.status === 'approved') {
            return NextResponse.json({ status: 200 });
        }
    }

    /*
    // Calculate end date of the subscription
    const start_date = new Date();
    const end_date = new Date();
    end_date.setMonth(end_date.getMonth() + 1);

    // TODO: Get remaining questions of the subscription_plans
    const subscription = {
        //user_id: payment.metadata.user_id,
        plan_id: payment.metadata.new_plan_id,
        status: payment.status === 'approved' ? 'active' : 'inactive',
        start_date: start_date,
        end_date: end_date,
        remaining: 100,
        payment_due_date: end_date
    }

    console.log("subscriptions - subscription", subscription);    
    const { error } = await supabase.from("subscriptions").update(subscription).eq("id", payment.metadata.subscription_id);
    
    console.log("subscriptions - error", error);
    if (error) NextResponse.json({ status: 400 });

    const subscription_payment = {
        subscription_id: payment.metadata.subscription_id,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        payment_method: payment.payment_method_id,
        status: payment.status,
        payment_gateway: "Mercado Pago",
        payment_gateway_id: payment.id
    }

    console.log("subscription_payment", subscription_payment);

    await supabase.from("payments").insert(subscription_payment);
    */

    return NextResponse.json({ status: 200 });
}

function checkSignature(request: Request, data_id: string) {

    const x_signature = request.headers.get("x-signature");
    const x_request_id = request.headers.get("x-request-id");

    if (x_signature) {

        // Separating the x-signature into parts
        const parts = x_signature.split(',');

        // Initializing variables to store ts and hash
        let ts;
        let hash;

        // Iterate over the values to obtain ts and v1
        parts.forEach(part => {
            // Split each part into key and value
            const [key, value] = part.split('=');
            if (key && value) {
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();
                if (trimmedKey === 'ts') {
                    ts = trimmedValue;
                } else if (trimmedKey === 'v1') {
                    hash = trimmedValue;
                }
            }
        });

        // Obtain the secret key for the user/application from Mercadopago developers site
        const secret = process.env.NEXT_PRIVATE_MERCADOPAGO_WEBHOOK_SECRET_KEY!;

        // Generate the manifest string
        const manifest = `id:${data_id};request-id:${x_request_id};ts:${ts};`;

        // Create an HMAC signature
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(manifest);

        // Obtain the hash result as a hexadecimal string
        const sha = hmac.digest('hex');

        if (sha === hash) {
            // HMAC verification passed
            console.log("HMAC verification passed");
            return true;
        } else {
            // HMAC verification failed
            console.log("HMAC verification failed");
            return false;
        }
    }

    return false;
}