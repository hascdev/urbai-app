import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function AppPage() {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return redirect("/app/dashboard")
    } else {
        return redirect("/app/create-account")
    }
}
