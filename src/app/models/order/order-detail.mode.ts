interface OrderDetail {
    id: number;
    price: { sellingPrice: number; promotionPrice?: number }[];
    order_id: number;
    product_detail_id: number;
    quantity: number;
    total_money: number;
    product_name: string;
    size: string;
    color: string;
    rating?: number;  // Rating for the product
    comment?: string;
}

interface SelectedOrderDetails {
    details: OrderDetail[];
    total_money: number;
}
