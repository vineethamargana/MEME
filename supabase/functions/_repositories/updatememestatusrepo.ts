import supabase from "../_shared/_config/supabaseClient.ts";


export default async function updateMemeStatusRepo(meme_id:string, status:string,user_id:string)
{
    try{
        // Step 1: Validate if the user exists and has permissions
        const {data: user, error: userError} = await supabase
       .from('users')
       .select('can_edit_meme,is_admin')
       .eq('user_id',user_id)
       .single();

        if(userError ||!user || (user.can_edit_meme === false)){
            return {status: 403, message: 'User does not have permission to update meme status.'};
        }

        if(userError ||!user || (user.is_admin === false)){
            return {status: 403, message: 'User is not admin'};
        } 

        // Step 2: check meme exists or not
        const {data:existingMeme, error: existingMemeError} = await supabase
       .from('memes')
       .select('meme_id')
       .eq('meme_id',meme_id)
       .single();

        if(existingMemeError ||!existingMeme){
            return {status: 404, message: 'Meme not found.'};
        }

        // Step 3: update meme status
        const {data: updatedMeme, error: updateError} = await supabase
       .from('memes')
       .update({status})



    }
    catch(err){
    }
}