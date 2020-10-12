import { ProductPurchase } from './productpurchase';

export interface ProductTag {
    tag_id: string;
    tag_hash_id: string;
    tag_new_product: ProductPurchase[];
    tag_name: string;
    tag_created_at: Date;
    tag_updated_at: Date;
    tag_supplier_hid: string;
    tag_emp_created_hid: string;
    tag_emp_updated_hid: string;
    tag_branch_id: string;
    tag_info: string;
    tag_user_id: string;
    tag_order_id: string;
    tag_discount_amount: number;
}