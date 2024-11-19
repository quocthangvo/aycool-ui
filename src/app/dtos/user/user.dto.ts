
export class UserDTO {
    id: number;
    avatar: string;
    full_name: string;
    email: string;
    date_of_birth: Date;
    active: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.avatar = data.avatar;
        this.full_name = data.full_name;
        this.email = data.email;
        this.date_of_birth = new Date(data.date_of_birth);
        this.active = data.active;
    }

    get activeStatus(): string {
        return this.active ? 'Đang hoạt động' : 'Vô hiệu hóa';
    }

}