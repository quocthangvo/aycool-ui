export interface Coupon {
    id: number;
    code: string;
    discount_type: string;
    discount_value: number;
    description: string;
    min_order_value: number;
    start_date: Date;
    end_date: Date;
    usage_limit: number;
    status: string;
    discountDescription: string;
}


