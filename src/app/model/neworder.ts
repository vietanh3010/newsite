import { Product } from './product';
import { User } from './user';
import { Cart } from './cart';
import { Admin } from './admin';
import { Branch } from './branch';

export interface Neworder {
    order_id: string;
    order_subtotal: number;
    order_discount: number;
    order_total: number;
    customer: User;
    products: Cart[];
    created_at: string;
    updated_at: string;
    order_hash: string;
    order_shipfee: number;
    order_tax: number;
    order_payment_option: string;
    order_branch: Branch;
    order_tag: string[];
    order_ship_option: string;
    order_status: string[];
    order_delivery_time: Date;
    additional_info: string;
    order_sale_person: Admin;
    order_discount_type: string;
    order_address: string;
}
