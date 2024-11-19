export interface Order {
    id: number;
    name: string;
    order_code: string;
    order_date: string;
    total_money: number;
    active: boolean;
    status: string;
    statusDisplayName: string;
}