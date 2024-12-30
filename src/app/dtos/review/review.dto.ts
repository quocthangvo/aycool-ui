
export class ReviewDTO {

    rating: number[];
    comment: string[];
    product_id: number[];
    order_id: number;
    user_id: number;

    constructor(data: any) {

        this.rating = data.rating;
        this.comment = data.comment;
        this.product_id = data.product_id;
        this.order_id = data.order_id;
        this.user_id = data.user_id;

    }

}