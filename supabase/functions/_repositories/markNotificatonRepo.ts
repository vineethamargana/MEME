import supabase from "../_shared/_config/supabaseClient.ts";


export default async function markNotifications(notification_id: string)
{
  try{
    // Fetch the notification
  const { data: existingNotification, error: fetchError } = await supabase
  .from("notifications")
  .select("*")
  .eq("notification_id", notification_id)
  .single();
  
  if (fetchError ||!existingNotification) {
    return { status: 404, message: "Notification not found." };
  }

  if(existingNotification.read_status===true)
  {
    return { status: 400, message: "Notification is already marked as read." };
  }

  // Mark the notification as read
  const { data: updatedNotification, error: updateError } = await supabase
  .from("notifications")
  .update({ read_status: true })
  .eq("notification_id", notification_id)
  .single();
  
  if (updateError) {
    return { status: 400, message: "Failed to mark notification as read." };
  }
  
  return { status: 200, message: "Notification marked as read." };
  }
  catch(err){
    console.error("Error in markNotifications: ", err);
    return { status: 500, message: "Failed to mark notification as read." };
  }
}