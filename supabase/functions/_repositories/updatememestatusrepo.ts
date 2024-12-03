import supabase from "../_shared/_config/supabaseClient.ts";

export default async function updateMemeStatusRepo(meme_id: string, meme_status: string) {
  try {
    // Step 1: 
    const { data: existingMeme, error: existingMemeError } = await supabase
    .from("memes")
    .select("meme_id, user_id")
    .eq("meme_id", meme_id)
    .single();

  if (existingMemeError || !existingMeme) {
    return { status: 404, message: "Meme not found." };
  }

  //Validate if the requester has admin privileges
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_type")
      .eq("user_id",existingMeme.user_id)
      .single();

    if (userError || !user) {
      return { status: 403, message: "User does not exist or lacks permissions." };
    }

    if (user.user_type !== "A") {
      return { status: 403, message: "User is not authorized to update meme status." };
    }

    const validStatuses = ["Approved", "Rejected", "Pending"];
    if (!validStatuses.includes(meme_status))
    {
      return { status: 400, message: "Invalid status value." };
    }
   

    // Step 4: Update meme status
    const { error: updateError } = await supabase
      .from("memes")
      .update({meme_status: meme_status ,updated_at: new Date().toISOString()})
      .eq("meme_id", meme_id);

    if (updateError) {
      return {
        status: 500,
        message: "An error occurred while updating the meme status.",
      };
    }

    return { status: 200, message: "Meme status updated successfully." };
  } 
  catch (err) {
    console.error("Unexpected error:", err);
    return {
      status: 500,
      message: "An unexpected error occurred.",
    };
}
}
