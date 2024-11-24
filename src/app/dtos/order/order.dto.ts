
export class OrderDTO {


    user_id: number;
    address_id: number;
    note: string;
    payment_method: string;
    selected_items: any[];

    constructor(data: any) {

        this.user_id = data.user_id;
        this.address_id = data.address_id;
        this.note = data.note;
        this.payment_method = data.payment_method;
        this.selected_items = data.selected_items;

    }

}