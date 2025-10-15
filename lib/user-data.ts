"use server";

import { createClient } from "@/utils/supabase/server";
import { Subscription, SubscriptionPlans, User } from "./definitions";
import { User as SupabaseUser } from "@supabase/supabase-js";

export async function fetchUser(user: SupabaseUser) {

    try {

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('users')
            .select('*, subscriptions(*, plan:subscription_plans(name, queries))')
            .eq('uid', user.id)
            .eq('subscriptions.status', 'active')
            .maybeSingle()

        if (error) {
            throw error;
        }

        if (!data) {

            return {
                uid: user.id,
                name: user.user_metadata.full_name || "",
                email: user.email || "",
                phone: user.user_metadata.phone || "",
                created_at: new Date().toISOString()
            } as unknown as User;
        }

        data.email = user.email || "";
        data.subscription = null;
        if (data.subscriptions.length > 0) {
            data.subscription = data.subscriptions[0];            
            data.subscription.plan = data.subscriptions[0].plan;
        }
        console.log("data", data);

        return data as unknown as User;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user data.');
    }
}

export async function existsUserByPhone(uid: string, phone: string) {

    try {

        const supabase = await createClient();

        // Check if phone is already in use by another user
        const { data, error } = await supabase .from('users').select('*').eq('phone', phone).neq('uid', uid);

        if (error) {
            throw error;
        }

        console.log("existsUserByPhone", data);

        return data.length > 0 ? true : false;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch subscription data.');
    }
}

export async function fetchCurrentSubscription() {

    try {

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            throw authError;
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*, plan:subscription_plans(name, queries)')
            .eq('user_id', user?.id)
            .eq('status', 'active').maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return null;
        }

        return data as unknown as Subscription;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch subscription data.');
    }
}

export async function fetchSubscriptionPlans(id: string) {

    try {

        const supabase = await createClient();

        const { data, error } = await supabase .from('subscription_plans').select('*').eq('id', id);

        if (error) {
            throw error;
        }

        return data[0] as unknown as SubscriptionPlans;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch subscription data.');
    }
}