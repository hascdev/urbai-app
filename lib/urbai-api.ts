'use server';

import { ProjectMessage, Subscription } from "@/lib/definitions";
import { createClient } from "@/utils/supabase/server";

export async function getAnswer(message: string, project_id: string, vs_ids: string[], subscription: Subscription) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/chat`, {
        method: "POST",
        body: JSON.stringify({ message, vs_ids })
    });

    const result = await response.json();
    if (result.error) {
        return { error: result.error, message: null }
    }

    console.log("result", result);    

    // Update remaining
    const supabase = await createClient();
    await supabase.from('subscriptions')
        .update({ remaining: subscription.remaining - 1 })
        .eq('id', subscription.id);

    console.log('Updated user remaining questions');

    const urbaiMessage: ProjectMessage = {
        id: crypto.randomUUID(),
        project_id: project_id,
        role: "assistant",
        content: result.answer,
        citations: result.citations || null
    }

    return { error: null, message: urbaiMessage };
}