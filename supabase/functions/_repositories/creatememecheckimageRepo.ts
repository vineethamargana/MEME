import { MemeImpl } from "../_models/Meme1Model.ts";
import supabase from "../_shared/_config/supabaseClient.ts";

// Helper function to upload an image to Supabase Storage
async function uploadImageToBucket(
    imageUrl: string,
    memeTitle: string,
): Promise<string | null> {
    try {
        const fileName = `${Date.now()}-${memeTitle}.jpg`;
        const bucketName = "memes";
        const filePath = `memes/${fileName}`;

        // Fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            console.error("Error fetching the image:", response.statusText);
            return null;
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType?.startsWith("image/")) {
            console.error("Fetched file is not a valid image.");
            return null;
        }

        const file = await response.blob();

        // Upload the file to Supabase
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: true,
            });

        if (error || !data) {
            console.error("File upload failed:", error);
            return null;
        }

        // Get the public URL
        const { data: publicData } = supabase.storage.from(bucketName)
            .getPublicUrl(filePath);
        return publicData?.publicUrl || null;
    } catch (error) {
        console.error("Error in uploadImageToBucket:", error);
        return null;
    }
}

export default async function creatememeUsingbucketRepo(meme: MemeImpl) {
    try {
        // Step 1: Validate user permissions
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("user_type")
            .eq("user_id", meme.user_id)
            .single();

        if (userError || !user || user.user_type !== "M") {
            console.error("User validation error:", userError);
            return {
                status: 403,
                message: "User is not authorized to create memes.",
            };
        }

        // Step 3: Check for duplicate meme
        const { data: existingMeme, error: checkError } = await supabase
            .from("memes")
            .select("meme_title")
            .eq("meme_title", meme.meme_title)
            .eq("image_url", meme.image_url)
            .maybeSingle();

        if (checkError) {
            console.error("Error checking for existing meme:", checkError);
            return {
                status: 400,
                message: `Error checking for existing meme: ${checkError.message}`,
                };
        }

        if (existingMeme) {
            return {
                status: 409,
                message: `A meme with the title or same image already exists.`,
            };
        }

        // Step 2: Handle image URL upload
        if (meme.image_url && !meme.image_url.startsWith("https://your-supabase-storage-url"))
       {
            const uploadedUrl = await uploadImageToBucket(meme.image_url, meme.meme_title);
            if (!uploadedUrl) {
                return {
                    status: 500,
                    message: "Failed to upload image. Please try again.",
                };
            }
            meme.image_url = uploadedUrl; // Set the uploaded image URL
        }

        // Step 4: Insert the meme
        const { data, error: insertError } = await supabase
            .from("memes")
            .insert([{
                user_id: meme.user_id,
                meme_title: meme.meme_title,
                image_url: meme.image_url,
                tags: meme.tags,
            }])
            .select("*")
            .single();

        if (insertError) {
            console.error("Error inserting meme:", insertError);
            return {
                status: 500,
                message: `Error inserting meme: ${insertError.message}`,
            };
        }

        console.log("Meme created successfully:", data);
        return { status: 201, message: "Meme created successfully", data };
    } catch (error) {
        console.error("Error in creatememeUsingbucketRepo:", error);
        return {
            status: 500,
            message: `Failed to insert meme: ${
                error instanceof Error ? error.message : error
            }`,
        };
    }
}
