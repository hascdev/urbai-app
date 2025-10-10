'use server';

import { redirect } from "next/navigation";
import { actionClient } from "./safe-action";
import { Provider } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

const signInWithProvider = async (provider: Provider) => {

    const supabase = await createClient();
    const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
    console.log("signInWithProvider - auth_callback_url", auth_callback_url);
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: auth_callback_url } });
    console.log("signInWithProvider - data", data);

    if (error) {
        console.error("signInWithProvider - error", error);
        return { failure: error.message };
    }

    console.log("signInWithProvider - data", data);
    redirect(data.url);
}

export const signInWithGoogle = actionClient
    .action(async () => {
        return signInWithProvider('google');
    }
);

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();    
};