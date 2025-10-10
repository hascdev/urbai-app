'use server';

import { redirect } from "next/navigation";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { createClient } from "@/utils/supabase/server";
import { actionClient } from "./safe-action";
import { fetchSubscriptionPlans } from "./user-data";
import { preferenceSchema } from "./user-schema";

const mercadopago = new MercadoPagoConfig({ accessToken: process.env.NEXT_PRIVATE_MERCADOPAGO_ACCESS_TOKEN! });

export const createPreference = actionClient.schema(preferenceSchema)
    .action(async ({ parsedInput: { new_plan_id, subscription_id } }) => {

        console.log("new_plan_id", new_plan_id);
        const upgrade_plan = await fetchSubscriptionPlans(new_plan_id);

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const preference = new Preference(mercadopago);
        const result = await preference.create({
            body: {
                auto_return: "approved",
                back_urls: {
                    success: `${process.env.NEXT_PRIVATE_MERCADOPAGO_BACK_URL}`,
                    failure: `${process.env.NEXT_PRIVATE_MERCADOPAGO_BACK_URL}`,
                    pending: `${process.env.NEXT_PRIVATE_MERCADOPAGO_BACK_URL}`
                },
                metadata: {
                    user_id: user?.id,
                    new_plan_id: new_plan_id,
                    subscription_id: subscription_id
                },
                items: [{ id: upgrade_plan.id, title: upgrade_plan.name, quantity: 1, unit_price: Number(upgrade_plan.price), currency_id: upgrade_plan.currency }],
                external_reference: "1"
            }
        });

        console.log("preference", result);

        if (result.init_point) {
            redirect(result.init_point);
        }
    }
);
