
export class RegisterDTO {
    full_name: string;
    email: string;
    password: string;
    retype_password: string;
    role_id: number;

    constructor(data: any) {
        this.full_name = data.full_name;
        this.email = data.email;
        this.password = data.password;
        this.retype_password = data.retype_password
        // Gán role_id là 2 nếu không có giá trị nào được cung cấp
        this.role_id = data.role_id !== undefined ? data.role_id : 2;
    }

}