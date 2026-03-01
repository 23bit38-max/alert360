export const updateAccidentStatus = async (id: string, nextStatus: string) => {
    const { supabase } = await import('@/core/config/supabase.config');
    return supabase
        .from('accidents')
        .update({ response_status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1) })
        .eq('id', id);
};
