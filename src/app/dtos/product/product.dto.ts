
export class ProductDTO {
    name: string;
    sku: string;
    description: string;
    sub_category_id: number;
    material_id: number;
    colors: number[];
    sizes: number[];


    constructor(data: any) {
        this.name = data.name;
        this.sku = data.sku;
        this.description = data.description;
        this.sub_category_id = data.sub_category_id;
        this.material_id = data.material_id;
        this.colors = data.colors;
        this.sizes = data.sizes;
    }

}