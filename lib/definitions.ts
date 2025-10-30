export interface User {
    uid: string;
    name: string;
    email: string;
    phone: string;
    active: boolean;
    subscription: Subscription;
    created_at: string;
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    status: string;  // 'active', 'inactive', 'cancelled', 'expired'
    start_date: string;
    end_date: string;
    payment_due_date: string;
    remaining: number;
    plan: SubscriptionPlans;
}

export interface SubscriptionPlans {
    id: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    queries: string;
}

export const SUBSCRIPTION_PLANS_IDS = {
    basic: "4056dcc9-5209-4138-8bb5-6373901eac84",
    starter: "7fdfdef2-6352-474f-88f3-952c12df10f0",
    pro: "72de63e7-f071-4ba4-bfe9-ba7b3c8eb292",
}

export interface Notification {
    id: string;
    message: string;
    status: string;
    receiver_id: string;
    created_at: string;
}

export interface Library {
    id: string;
    name: string;
    type_id: number;
    location_id: number;
    status_id: number;
    date: string;
    vector_store_id: string;
    status: LibraryStatus;
    type: LibraryType;
    location: LibraryLocation;
    documents: LibraryDocument[];
    favorites: LibraryFavorite[];
    created_at: string;
    updated_at: string;
}

export interface LibraryType {
    id: string;
    name: string;
    level_id: number;
    level: LibraryLevel;
    created_at: string;
    updated_at: string;
}

export interface LibraryLevel {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface LibraryStatus {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface LibraryLocation {
    id: string;
    name: string;
    commune_id: string;
    created_at: string;
    updated_at: string;
}

export interface LibraryDocument {
    id: string;
    library_id: string;
    library: Library;
    url: string;
    pages: number;
    version_date: string;
    source_id: number;
    storage_file_id: string;
    created_at: string;
    updated_at: string;
}

export interface LibraryFavorite {
    id: number;
    user_id: string;
    library_id: string;
    created_at: string;
    updated_at: string;
}

export interface Commune {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    name: string;
    commune_id: string;
    commune: Commune;
    type_id: string;
    type: ProjectType;
    description: string;
    tags: string;
    libraries: Library[];
    notes: ProjectNote[];
    created_at: string;
    updated_at: string;
}

export interface ProjectType {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectMessage {
    id: string
    project_id: string
    role: "user" | "assistant"
    content: string
    date?: string
    citations?: MessageCitation[] | null
    location: MessageLocation | null
}

export interface MessageCitation {
    id: string;
    article: string;
    quote: string;
    file_id: string;
}

export interface MessageLocation {
    address: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
}

export interface ProjectNote {
    id: string;
    project_id: string;
    name: string;
    content: string;
    created_at: string;
}

export interface ProjectLibrary {
    id: string;
    project_id: string;
    library_id: string;
    library: Library;
}