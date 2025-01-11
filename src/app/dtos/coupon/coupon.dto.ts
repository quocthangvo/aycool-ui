

export class CouponDTO {


    code: number;
    discount_value: number;
    discount_type: string;
    description: string;
    min_order_value: number
    start_date: string;  // Đổi kiểu dữ liệu từ Date sang string
    end_date: string;    // Đổi kiểu dữ liệu từ Date sang string
    usage_limit: number;
    status: boolean;
    constructor(data: any) {

        this.code = data.code;
        this.discount_value = data.discount_value;
        this.discount_type = data.discount_type;
        this.description = data.description;
        this.min_order_value = data.min_order_value;
        // Chuyển đổi từ Date thành chuỗi yyyy-MM-dd (chỉ lấy ngày, không có giờ)
        this.start_date = this.formatDate(data.start_date);
        this.end_date = this.formatDate(data.end_date);

        this.usage_limit = data.usage_limit;
        this.status = data.status === 'true';

    }
    // Hàm chuyển đổi Date thành chuỗi yyyy-MM-dd
    private formatDate(date: Date): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];  // Tách chuỗi và lấy phần ngày
    }

}
