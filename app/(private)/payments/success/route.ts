// app/(private)/payments/success/route.ts (para método GET)
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import MercadoPagoConfig, { Payment } from 'mercadopago'
import { createClient } from '@/utils/supabase/server';

const mercadopago = new MercadoPagoConfig({ accessToken: process.env.NEXT_PRIVATE_MERCADOPAGO_ACCESS_TOKEN! });

//http://localhost:3000/payments/success?collection_id=113179444969&collection_status=approved&payment_id=113179444969&status=approved&external_reference=1&payment_type=debit_card&merchant_order_id=31424870757&preference_id=5536567-5f7a0c1b-4e08-48cd-a4b7-c2efd2100e75&site_id=MLC&processing_mode=aggregator&merchant_account_id=null

export async function GET(request: NextRequest) {

    const url = new URL(request.url)
    const payment_id = url.searchParams.get('payment_id');

    if (!payment_id) {
        return redirect('/payments/error?status=error&reason=missing_payment_id')
    }

    const payment = await new Payment(mercadopago).get({ id: payment_id });
    console.log("payment", payment);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log("user", user);

    if (payment && payment.status === 'approved' && user && payment.metadata.user_id === user.id) {

        const { data: urbai_payment, error: urbai_payment_error } = await supabase.from("payments").select("*").eq("payment_gateway_id", payment_id);

        if (urbai_payment_error) return redirect('/payments/error?status=error&reason=payment_not_found')

        if (urbai_payment && urbai_payment.length > 0) {
            console.log("payment was already processed");
            return redirect(`/app/billing`)
        }

        // Calculate end date of the subscription
        const start_date = new Date();
        const end_date = new Date();
        end_date.setMonth(end_date.getMonth() + 1);

        // Get remaining questions of the subscription_plans
        const subscription = {
            plan_id: payment.metadata.new_plan_id,
            status: payment.status === 'approved' ? 'active' : 'inactive',
            start_date: start_date,
            end_date: end_date,
            remaining: payment.metadata.queries,
            payment_due_date: end_date
        }

        console.log("subscriptions - subscription", subscription);
        const { error } = await supabase.from("subscriptions").update(subscription).eq("id", payment.metadata.subscription_id);

        console.log("subscriptions - error", error);
        if (error) return redirect('/payments/error?status=error&reason=subscription_update_error')

        const subscription_payment = {
            subscription_id: payment.metadata.subscription_id,
            amount: payment.transaction_amount,
            currency: payment.currency_id,
            payment_method: payment.payment_method_id,
            status: payment.status,
            payment_gateway: "Mercado Pago",
            payment_gateway_id: payment.id,
            payment_response: JSON.stringify(payment)
        }

        console.log("subscription_payment", subscription_payment);

        await supabase.from("payments").insert(subscription_payment);

        return redirect(`/app/billing?status=success`);
    }

    return redirect(`/app/billing?status=${payment.status}`)
}


export async function POST(request: NextRequest) {

    const body = await request.json();
    console.log("POST - body", body);

    const x_signature = request.headers.get("x-signature");
    console.log("POST - x_signature", x_signature);
    const x_request_id = request.headers.get("x-request-id");
    console.log("POST - x_request_id", x_request_id);

    return NextResponse.json({ message: "OK" });
}