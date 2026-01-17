
import { supabase } from '../../lib/supabase';

export async function uploadImage(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `pets/${fileName}`;

    try {
        const { error } = await supabase.storage
            .from('pet-images')
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        const { data } = supabase.storage
            .from('pet-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error: any) {
        console.error("Error uploading to Supabase Storage:", error);
        throw new Error(error.message || "Failed to upload image");
    }
}
