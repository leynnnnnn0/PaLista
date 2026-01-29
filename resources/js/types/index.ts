export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface Loan {
    id: number;
    borrower_id: number;
    amount: number;
    interest_type: string;
    interest_value: number;
    transaction_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    borrower?: Borrower;
    interest:  number;
    total_amount: number;

    
}

export interface Borrower {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    contact_number: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    created_at: string;
    updated_at: string;
    full_name: string
    

    references?: BorrowerReference[];
    documents?: BorrowerDocument[];
    loans?: Loan[];
}

export interface BorrowerReference {
    id: number;
    borrower_id: number;
    name: string | null;
    contact_number: string | null;
    created_at: string;
    updated_at: string;
}

export interface BorrowerDocument {
    id: number;
    borrower_id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

export interface PaymentSchedule {
    id: number;
    loan_id: number;
    amount_due: number;
    rebate_amount: number;
    penalty_amount: number;
    due_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface PaymentHistory {
    id: number;
    payment_schedule_id: number;
    amount_paid: number;
    payment_date: string;
    payment_method: string;
    receipt_number: string | null;
    reference_number: string | null;
    created_at: string;
    updated_at: string;
}
