'use server';

import { actionClient } from "./safe-action";
import { createClient } from "@/utils/supabase/server";
import z from "zod";

export const createFavorite = actionClient.inputSchema(z.object({
    library_id: z.string(),
    favorite: z.boolean()
}))
    .action(async ({ parsedInput: { library_id, favorite } }) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (favorite) {
            await supabase.from('library_favorites').insert({
                user_id: user?.id,
                library_id: library_id
            });
        } else {
            await supabase.from('library_favorites').delete().eq('library_id', library_id).eq('user_id', user?.id);
        }

        return { success: true };
    }
)