export interface UserReq {
    count: number;
    links: Links;
    page: number;
    success: boolean;
    total_pages: number;
    total_users: number;
    users: User[]
}

export interface User {
    id: number;
    name: string;
    phone: string;
    photo: string;
    position: string;
    position_id: number;
    registration_timestamp: number;
    email: string;
}

export interface Links {
    next_url: string | null;
    prev_url: string | null;
}