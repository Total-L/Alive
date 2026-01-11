import express from 'express';
import cors from 'cors';
import { supabase } from './supabase.js';

const router = express.Router();

// Helper to get the default user (simulating auth)
const getUser = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1)
        .single();
    
    if (error || !data) {
        // Create default user if not exists (fallback)
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({ username: '小雅' })
            .select()
            .single();
        if (createError) throw createError;
        return newUser;
    }
    return data;
};

// --- User Routes ---
router.get('/user', async (req, res) => {
    try {
        const user = await getUser();
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/user', async (req, res) => {
    try {
        const user = await getUser();
        const { username } = req.body;
        const { data, error } = await supabase
            .from('users')
            .update({ username })
            .eq('id', user.id)
            .select()
            .single();
        
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- Contacts Routes ---
router.get('/contacts', async (req, res) => {
    try {
        const user = await getUser();
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .eq('user_id', user.id);
            
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/contacts', async (req, res) => {
    try {
        const user = await getUser();
        const { name, relation, email, avatar, isPrimary } = req.body;
        const { data, error } = await supabase
            .from('contacts')
            .insert({
                user_id: user.id,
                name,
                relation,
                email,
                avatar,
                is_primary: isPrimary || false
            })
            .select()
            .single();
            
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, relation, email, avatar, isPrimary } = req.body;
        const { data, error } = await supabase
            .from('contacts')
            .update({
                name,
                relation,
                email,
                avatar,
                is_primary: isPrimary
            })
            .eq('id', id)
            .select()
            .single();
            
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- Checkin Routes ---
router.get('/history', async (req, res) => {
    try {
        const user = await getUser();
        const { data, error } = await supabase
            .from('checkins')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
            
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/checkin', async (req, res) => {
    try {
        const user = await getUser();
        const { type, details } = req.body;
        const { data, error } = await supabase
            .from('checkins')
            .insert({
                user_id: user.id,
                type,
                date: new Date().toISOString(),
                details
            })
            .select()
            .single();
            
        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
