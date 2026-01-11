import { Contact, CheckinRecord } from '../types';

const API_URL = '/api';

export const api = {
    // User
    getUser: async () => {
        const response = await fetch(`${API_URL}/user`);
        return response.json();
    },

    updateUser: async (username: string) => {
        const response = await fetch(`${API_URL}/user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });
        return response.json();
    },

    // Contacts
    getContacts: async (): Promise<Contact[]> => {
        const response = await fetch(`${API_URL}/contacts`);
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            relation: item.relation,
            email: item.email,
            avatar: item.avatar,
            isPrimary: item.is_primary, // Map snake_case to camelCase
        }));
    },

    addContact: async (contact: Omit<Contact, 'id'>) => {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...contact,
                isPrimary: contact.isPrimary
            }),
        });
        const item = await response.json();
        return {
            id: item.id,
            name: item.name,
            relation: item.relation,
            email: item.email,
            avatar: item.avatar,
            isPrimary: item.is_primary,
        };
    },

    updateContact: async (contact: Contact) => {
        const response = await fetch(`${API_URL}/contacts/${contact.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...contact,
                isPrimary: contact.isPrimary
            }),
        });
        const item = await response.json();
        return {
            id: item.id,
            name: item.name,
            relation: item.relation,
            email: item.email,
            avatar: item.avatar,
            isPrimary: item.is_primary,
        };
    },

    deleteContact: async (id: number) => {
        await fetch(`${API_URL}/contacts/${id}`, {
            method: 'DELETE',
        });
    },

    // Checkins
    getHistory: async (): Promise<CheckinRecord[]> => {
        const response = await fetch(`${API_URL}/history`);
        return response.json();
    },

    checkin: async (type: 'safe' | 'delayed' | 'missed', details?: string) => {
        const response = await fetch(`${API_URL}/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, details }),
        });
        return response.json();
    }
};
