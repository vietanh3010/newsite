import { ProductTag } from './productTag';

export interface Product {
    product_id: string;
    product_name: string;
    product_price: number;
    product_img: string;
    product_stock: number;
    product_bought: number;
    product_created_at: Date;
    product_updated_at: Date;
    product_hash_id: string;
    product_prime_cost: number;
    product_category: string;
    product_weight: number;
    product_description: string;
    product_branch: string;
    product_tag: ProductTag[];
    additional_info: string;
    product_barcode: number;
    product_unit: string;
    product_brand: string;
}
