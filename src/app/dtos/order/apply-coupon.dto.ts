

export class ApplyCouponDTO {


    order_id: number;
    coupon_id: number;
    user_id: number;


    constructor(data: any) {

        this.user_id = data.user_id;
        this.coupon_id = data.coupon_id;
        this.order_id = data.order_id;


    }

}
