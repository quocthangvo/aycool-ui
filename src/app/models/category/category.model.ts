export interface SubCategory {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    subCategories: SubCategory[]; // Danh sách các subcategory
}
