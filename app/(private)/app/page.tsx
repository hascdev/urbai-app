import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { createUserFirstTime } from "@/lib/user-action"

export default async function AppPage() {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {

        console.log("AppPage - user", user);        
        const result = await createUserFirstTime({
            uid: user.id,
            name: user.user_metadata.full_name,
            phone: user.phone || ""
        });
        
        console.log("AppPage - result completo", result);
        //console.log("AppPage - data", result?.data);
        //console.log("AppPage - serverError", result?.serverError);
        //console.log("AppPage - validationErrors", result?.validationErrors);
        
        if (result?.data?.newUser) {
            return redirect("/app/dashboard")
        } else {
            return redirect("/create-account")
        }
    } else {
        return redirect("/create-account")
    }
}
