
import { supabase } from '../../lib/supabase';
import { Pet } from '../../types';

export type NewPetData = Omit<Pet, 'id' | 'created_at' | 'isFavorite'>;

// Fetch ALL pets, including Adopted ones
export async function getAdminPets(): Promise<Pet[]> {
    const { data: pets, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin pets:', error);
        return [];
    }

    // In admin view, we don't care about favorites, so default to false
    return pets.map(p => ({ ...p, isFavorite: false })) as Pet[];
}

export async function addPet(petData: NewPetData) {
    // We need to generate an ID manually if we are using TEXT ids as per schema discussion
    // The schema says `id TEXT PRIMARY KEY`. 
    // The previous code in `schema.sql` comments mentioned generated uuid v4 but the type is TEXT.
    // Let's use crypto.randomUUID() to be safe and standard.

    // Wait, the schema actually has `id TEXT PRIMARY KEY`. 
    // If I insert without ID, it expects a default or I must provide it.
    // Let's check schema again? 
    // "id TEXT PRIMARY KEY" - no default mentioned in my view of schema.sql line 21. 
    // Ah, schema line 39 for applications has default. Line 21 for pets does NOT.
    // So I must generate it.

    const id = crypto.randomUUID();

    const { isNew, isUrgent, ...rest } = petData;

    const { data, error } = await supabase
        .from('pets')
        .insert({
            id,
            ...rest,
            is_new: isNew,
            is_urgent: isUrgent,
            status: 'Available'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}


export async function updatePetStatus(id: string, status: 'Available' | 'Adopted') {
    const { error } = await supabase
        .from('pets')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
}

// Applications
import { AdoptionApplication } from '../../types';

export async function getAdminApplications(): Promise<AdoptionApplication[]> {
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin applications:', error);
        return [];
    }

    // Transform fields if necessary to match frontend types
    return data.map(app => ({
        ...app,
        date: new Date(app.created_at).toLocaleDateString()
    })) as AdoptionApplication[];
}

export async function updateApplicationStatus(id: string, status: string) {
    const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
}
