import { formatDate } from "@angular/common";

export class UserInfoDTO {
    full_name: string;
    date_of_birth: string;

    constructor(data: any) {
        this.full_name = data.full_name;

        // Kiểm tra và chuyển đổi ngày sinh sang định dạng dd/MM/yyyy
        if (data.date_of_birth) {
            // Chuyển từ Date sang 'dd/MM/yyyy'
            this.date_of_birth = formatDate(data.date_of_birth, 'dd/MM/yyyy', 'en');
        } else {
            this.date_of_birth = '';
        }
    }

}