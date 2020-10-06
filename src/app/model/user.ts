export interface User {
    user_id: string;
    user_name: string;
    user_email: string;
    user_password: string;
    is_login: boolean;
    user_role: string;
    user_hash_id: string;
    created_at: Date;
    updated_at: Date;
    user_img: string;
    user_telephone: string;
    user_dob: Date;
    user_gender: string;
    user_address: string[];
    user_tag: string[];
    additional_info: string;
}
