import { Contact, CheckinRecord } from '../types';

const API_URL = '/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || `HTTP error! status: ${response.status}`);
        } catch (e) {
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
    }
    return response.json();
};

export const api = {
    // User
    getUser: async () => {
        const response = await fetch(`${API_URL}/user`);
        return handleResponse(response);
    },

    updateUser: async (username: string) => {
        const response = await fetch(`${API_URL}/user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });
        return handleResponse(response);
    },

    // Contacts
    getContacts: async (): Promise<Contact[]> => {
        const response = await fetch(`${API_URL}/contacts`);
        const data = await handleResponse(response);
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
        const item = await handleResponse(response);
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
        const item = await handleResponse(response);
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
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Delete Error:', response.status, errorText);
            throw new Error(`Delete failed: ${response.status}`);
        }
    },

    // Checkins
    getHistory: async (): Promise<CheckinRecord[]> => {
        const response = await fetch(`${API_URL}/history`);
        return handleResponse(response);
    },

    checkin: async (type: 'safe' | 'delayed' | 'missed', details?: string) => {
        const response = await fetch(`${API_URL}/checkin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, details }),
        });
        return handleResponse(response);
    }
};
