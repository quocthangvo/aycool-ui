
export class PriceDTO {
    selling_price: number;
    promotion_price: number;
    start_date: Date;
    end_date: Date;
    product_detail_id: number;



    constructor(data: any) {
        this.selling_price = data.selling_price;
        this.promotion_price = data.promotion_price;

        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.product_detail_id = data.product_detail_id;

    }

}