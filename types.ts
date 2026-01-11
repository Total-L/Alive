
export enum Screen {
    Home,
    History,
    Contacts,
    Settings,
}

export interface Contact {
    id: number;
    name: string;
    relation: string;
    email: string;
    avatar: string;
    isPrimary: boolean;
}

export interface CheckinRecord {
    id: number;
    type: 'safe' | 'delayed' | 'missed';
    date: string;
    details: string;
}
