export interface Product {
    id: number;
    name: string;
    description: string;
    sub_category_id: number;
    material_id: number;
    productDetails: ProductDetail[];
    url: string;
}

export interface ProductDetail {
    size_id: number;
    color_id: number;
}