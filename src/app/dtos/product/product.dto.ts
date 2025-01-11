
export class ProductDTO {
    name: string;
    sku: string;
    description: string;
    sub_category_id: number;
    material_id: number;
    colors: number[];
    sizes: number[];
    // productItems: ProductItemDTO[]; // Lưu trữ các kết hợp giữa size và color
    quantity: {
        [sizeId: number]: { [colorId: number]: number }
    };

    constructor(data: any) {
        this.name = data.name;
        this.sku = data.sku;
        this.description = data.description;
        this.sub_category_id = data.sub_category_id;
        this.material_id = data.material_id;
        this.colors = data.colors;
        this.sizes = data.sizes;
        // this.productItems = data.productItems || []; // Lưu các kết hợp size-color nếu có
        this.quantity = data.quantity;
    }

}

// Định nghĩa thêm ProductItemDTO cho các kết hợp size-color
export class ProductItemDTO {
    sizeId: number;
    colorId: number;
    quantity: number;

    constructor(sizeId: number, colorId: number, quantity: number) {
        this.sizeId = sizeId;
        this.colorId = colorId;
        this.quantity = quantity;
    }
}