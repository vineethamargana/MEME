import supabase from "../_shared/_config/supabaseClient.ts";


export default async function getnotificationsRepo(user_id: string){
    try {
        const { data: existinguser, error: errors } = await supabase
        .from("users")
        .select("user_id,account_status")
        .eq("user_id", user_id)
        .single();
        
        if (errors || !existinguser || existinguser.account_status === "suspended") {
            console.error(errors);
            return {
                message: "User not found or account suspended",
                status: 403
            }
        }

        const { data: notifications, error: notificationError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user_id)
        .order("notification_id", { ascending: false })
        .limit(5);

        if (notificationError) {
            return {
                message: "Error fetching notifications",
                status: 400
            };
        }

        if (notifications.length > 0) {
            return {
                message: "Notifications found",
                status: 200,
                data: notifications
            };
        }

        return {
            message: "No notifications found",
            status: 200
        };
    } catch (error) {
        console.error("Error in getNotificationsRepo:", error);
        return {
            message: "An unexpected error occurred",
            status: 500
        };
    }
}
