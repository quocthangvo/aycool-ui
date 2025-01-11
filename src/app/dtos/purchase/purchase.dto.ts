
export class PurchaseDTO {

    quantity: number;
    price: number;
    product_detail_id: number;


    constructor(data: any) {

        this.quantity = data.quantity;
        this.price = data.price;
        this.product_detail_id = data.product_detail_id;

    }

}