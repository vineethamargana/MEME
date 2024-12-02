import { MemeImpl } from "../_models/Meme1Model.ts";
import supabase from "../_shared/_config/supabaseClient.ts";

export default async function creatememeRepo(meme: MemeImpl) {
    try {
        // Step 1: Validate if the user exists and has permissions
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("user_type")
            .eq("user_id", meme.user_id)
            .single();

        if (userError || !user) {
            console.error("User validation error: ", userError);
            return {
                status: 403,
                message: "User does not exist or is not authorized to create memes."
            };
        }

        if (user.user_type !=='M') {
            console.error("User restricted from creating memes.");
            return {
                status: 403,
                message: "User is restricted from creating memes due to a violation."
            };
        }

        // Step 2: Check if a meme with the same title already exists
        const { data: existingMeme, error: checkError } = await supabase
            .from("memes")
            .select("*")
            .eq("meme_title", meme.meme_title);

        if (checkError) {
            console.error("Error checking for existing meme: ", checkError);
            return {
                status: 400,
                message: `Error checking for existing meme: ${checkError.message}`
            };
        }

        if (existingMeme.length > 0) {
            console.error("Duplicate meme detected:", existingMeme);
            return {
                status: 409,
                message: `A meme with the title '${meme.meme_title}' already exists.`
            };
        }

        // Step 3: Insert the meme into the database
        const { data, error } = await supabase
            .from("memes")
            .insert([{
                user_id: meme.user_id,
                meme_title: meme.meme_title,
                image_url: meme.image_url,
                tags: meme.tags,
            }])
            .select("*")
            .single();

        if (error) {
            console.error("Error inserting meme: ", error);
            return {
                status: 500,
                message: `Error inserting meme: ${error.message}`
            };
        }

        console.log("Meme created successfully: ", data);
        return {
            status: 201,
            message: "Meme created successfully"
        };
    } catch (error) {
        console.error("Error in creatememeRepo: ", error);
        return {
            status: 500,
            message: `Failed to insert meme into the database: ${error instanceof Error ? error.message : error}`
        };
    }
}
