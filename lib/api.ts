
import { supabase } from './supabase';
import { Pet, AdoptionApplication, UserProfile } from '../types';

// Pets
export async function getPets(userId?: string): Promise<Pet[]> {
    const { data: pets, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching pets:', error);
        return [];
    }

    if (!userId) {
        return pets.map(p => ({ ...p, isFavorite: false })) as Pet[];
    }

    const { data: favorites } = await supabase
        .from('favorites')
        .select('pet_id')
        .eq('user_id', userId);

    const favoriteIds = new Set(favorites?.map(f => f.pet_id));

    return pets.map(p => ({
        ...p,
        isFavorite: favoriteIds.has(p.id)
    })) as Pet[];
}

export async function getPet(id: string, userId?: string): Promise<Pet | null> {
    const { data: pet, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;

    let isFavorite = false;
    if (userId) {
        const { data: fav } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId)
            .eq('pet_id', id)
            .single();
        isFavorite = !!fav;
    }

    return { ...pet, isFavorite } as Pet;
}

export async function togglePetFavorite(petId: string, userId: string, isFavorite: boolean): Promise<void> {
    if (isFavorite) {
        // Add to favorites
        await supabase.from('favorites').insert({ user_id: userId, pet_id: petId });
    } else {
        // Remove from favorites
        await supabase.from('favorites').delete().eq('user_id', userId).eq('pet_id', petId);
    }
}

// Applications
export async function submitApplication(application: Omit<AdoptionApplication, 'id' | 'date' | 'status'>, userId: string) {
    const { data, error } = await supabase
        .from('applications')
        .insert({
            ...application,
            user_id: userId,
            status: 'Submitted'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getMyApplications(userId: string): Promise<AdoptionApplication[]> {
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching applications:', error);
        return [];
    }

    // Transform DB fields to frontend types if necessary (though we tried to match them)
    return data.map(app => ({
        ...app,
        date: new Date(app.created_at).toLocaleDateString()
    })) as AdoptionApplication[];
}

export async function updateApplication(id: string, updates: Partial<AdoptionApplication>) {
    const { error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id);

    if (error) throw error;
}

// User Profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return data as UserProfile;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    if (error) throw error;
}
