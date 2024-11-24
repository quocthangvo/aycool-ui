
export class StatusDTO {


    user_id: number;
    status: string;


    constructor(data: any) {

        this.user_id = data.user_id;
        this.status = data.status;

    }

}