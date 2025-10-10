'use server';

import { createClient } from '@/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import { Notification } from './definitions';

export async function fetchUserNotifiactions() {

    noStore();

    try {

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { error, data: notifications } = await supabase.
                                                        from('notifications').
                                                        select('*').
                                                        eq('receiver_id', user?.id).
                                                        limit(10).
                                                        order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }

        return notifications as Notification[];
        
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user notifications data.');
    }
}
