export interface GroupedProduct {
    product_name: string;
    product_id: number;
    image_url: string[];
    details: GroupedProductDetail[];
}

export interface GroupedProductDetail {
    size_id: number;
    color_id: number;
    size: string;
    color: string;
    rating: number;
    comment: string;
    product_id: number;
    product_name: string;
}