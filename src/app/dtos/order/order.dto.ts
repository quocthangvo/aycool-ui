
export class OrderDTO {
    user_id: string;
    order_code: String;
    order_date: Date;
    total_money: number;
    status: String;




    constructor(data: any) {
        this.user_id = data.user_id;
        this.order_code = data.order_code;
        this.order_date = new Date(data.order_date);
        this.total_money = data.total_money;
        this.status = data.status;
    }

}