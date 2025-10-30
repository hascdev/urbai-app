'use server';

import { MessageLocation, ProjectMessage, Subscription } from "@/lib/definitions";
import { createClient } from "@/utils/supabase/server";

type AnswerParams = {
    project_id: string;
    commune_id: string;
    message: string;
    vs_ids: string[];
    subscription: Subscription;
    location: MessageLocation | null;
}

export async function getAnswer({ project_id, commune_id, message, vs_ids, subscription, location }: AnswerParams) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/chat`, {
        method: "POST",
        body: JSON.stringify({ message, vs_ids, location, commune_id })
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
        citations: result.citations || null,
        location: location || null
    }

    return { error: null, message: urbaiMessage };
}