
export class ProductFilterDTO {
    id: number;
    sku_name: string;
    sku_version: string;
    color_id: number;
    size_id: number;
    quantity: number;



    constructor(data: any) {
        this.id = data.id;
        this.sku_name = data.sku_name;
        this.quantity = data.quantity;
        this.sku_version = data.sku_version;
        this.color_id = data.color_id;
        this.size_id = data.size_id;
    }

}