export interface User {
    id: string;
    name: string;
    email: string;
    role: 'superadmin' | 'user';
    image: string | null;
}

export interface UserEmail {
    email: string;
}