"use server";

import { createClient } from "@/utils/supabase/server";
import { actionClient } from "./safe-action";
import { feedbackSchema, subscriptionSchema, userSchema } from "./user-schema";
import { revalidatePath } from "next/cache";
import { User } from "./definitions";

export const createUser = actionClient.inputSchema(userSchema)
    .action(async ({ parsedInput: { uid, name, phone } }) => {

        console.log("createUser", uid, name, phone);
        const supabase = await createClient();
        const { error, data } = await supabase.from('users').insert({
            uid: uid,
            name: name,
            phone: phone
        }).select().single();

        if (error) {
            console.error("createUser - error", error);
            return { failure: error.message };
        }

        return { user: data as unknown as User };
    }
    );

export const updateUser = actionClient.inputSchema(userSchema)
    .action(async ({ parsedInput: { uid, name, phone, active } }) => {

        console.log("updateUser", uid, name, phone, active);
        const supabase = await createClient();
        const { error } = await supabase.from('users').upsert({
            uid: uid,
            name: name,
            phone: phone,
            active: true
        }, {
            onConflict: 'uid'
        });

        if (error) {
            console.error("updateUser - error", error);
            return { failure: error.message };
        }

        // Send welcome message to the user first time. Only if the user is not active.
        if (!active) {
            fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/welcome`, {
                method: 'POST',
                body: JSON.stringify({
                    user_name: name,
                    user_phone: phone
                })
            });
        }

        revalidatePath('/app', 'page');
    }
    );

export const createFreeSubscription = actionClient.inputSchema(subscriptionSchema)
    .action(async ({ parsedInput: { user_id, plan_id, status, start_date, end_date, payment_due_date } }) => {

        console.log("createFreeSubscription", user_id, plan_id, status, start_date, end_date, payment_due_date);
        const supabase = await createClient();
        const { error } = await supabase.from('subscriptions').insert({
            user_id: user_id,
            plan_id: plan_id,
            status: status,
            start_date: start_date,
            end_date: end_date,
            payment_due_date: payment_due_date
        });

        if (error) {
            console.error("createFreeSubscription - error", error);
            return { failure: error.message };
        }

        return { success: "Free subscription created successfully" };
    }
    );

export const sendFeedback = actionClient.inputSchema(feedbackSchema)
    .action(async ({ parsedInput: { user_id, comment } }) => {

        const supabase = await createClient();
        const { error } = await supabase.from('feedback')
            .insert({ user_id: user_id, comment: comment });

        if (error) {
            console.log("sendFeedback - error", error);
            return { failure: "Ocurrió un error inesperado, intente nuevamente." };
        }

        return { success: "Feedback enviado correctamente" };
    }
    );