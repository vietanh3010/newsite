import { Product } from './product';

export interface ProductPurchase {
    product_object: Product;
    product_quantity: number;
    total_primecost: number;
}