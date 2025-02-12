import { supabase } from "./supabaseClient";


export const imageUPloader = async (file: File) => {
    if (!file) return alert("Please select an image!");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public_bucket/${fileName}`;

    const {error}= await supabase.storage.from("next_auth").upload(filePath,file,{
        cacheControl:"3600",
        upsert:false,
    })

    if(error){
        console.log(error);
        return null;
    }else{
        const getPublicUrl = supabase.storage.from("next_auth").getPublicUrl(filePath).data.publicUrl;
        return getPublicUrl;
    }
}