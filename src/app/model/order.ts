export interface Order {
    order_id:string;
    product_id:string;
    product_quantity:number;
    customer_id:string;
    is_purchase:boolean;
    date_created:string;
}
