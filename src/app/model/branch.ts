import { Admin } from './admin';

export interface Branch {
    branch_id: string;
    branch_hash_id: string;
    branch_name: string;
    branch_manager: Admin;
    branch_address: string;
    branch_employees: Admin[];
    created_at: Date;
    updated_at: Date;
}
