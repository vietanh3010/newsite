import { Product } from './product';
import { User } from './user';
import { Cart } from './cart';

export interface Neworder{
        order_id: string;
        total_price: number;
        total_paid: number;
        total_unpaid: number;
        customer: Object;
        products: Cart[];
        created_at: string;
        updated_at: string;
        order_hash: string;
}