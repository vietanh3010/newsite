import { Product } from './product';
import { User } from './user';

export interface Neworder{
        order_id: string;
        total_price: number;
        total_paid: number;
        total_unpaid: number;
        customer: Object;
        products: Object;
        created_at: string;
        updated_at: string;
}