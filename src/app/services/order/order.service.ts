import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../dtos/order/order.dto';
import { ApplyCouponDTO } from '../../dtos/order/apply-coupon.dto';



@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiBaseUrl}/orders`;

    private apiConfig = {
        headers: this.createHeaders()
    }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }


    createOrder(data: OrderDTO): Observable<OrderDTO> {
        return this.http.post<OrderDTO>(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }

    // getAllOrders(page: number, limit: number): Observable<OrderDTO> {
    //     const params = { page: page.toString(), limit: limit.toString() };
    //     const options = {
    //         params: params,
    //         headers: this.getAuthHeaders(),

    //     };

    //     return this.http.get<OrderDTO>(this.apiUrl, options);
    // }

    getOrderById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    getOrderByUserId(id: number, status: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/user/${id}?status=${status}`);
    }

    updateOrderStatus(orderId: number, status: string): Observable<any> {
        const payload = { status };
        return this.http.put<any>(`${this.apiUrl}/update/${orderId}`, payload, { headers: this.getAuthHeaders() });
    }


    getAllOrders(
        page: number,
        limit: number,
        orderCode?: string,
        status?: string,
        orderDate?: string
    ): Observable<any> {
        const params: any = {
            page: page.toString(),
            limit: limit.toString(),
        };

        // Thêm các tham số lọc nếu có
        if (orderCode) params.orderCode = orderCode;
        if (status) params.status = status;
        if (orderDate) params.orderDate = orderDate;

        const options = {
            params: params,
            headers: this.getAuthHeaders(),
        };

        return this.http.get<any>(`${this.apiUrl}/all`, options); // Cập nhật URL API theo đúng endpoint
    }

    applyCoupon(data: ApplyCouponDTO): Observable<any> {

        return this.http.post<any>(`${this.apiUrl}/apply-coupon`, data, { headers: this.getAuthHeaders() });
    }

    getTotalMoneyOrder() {
        return this.http.get(`${this.apiUrl}/total-money-order`, { headers: this.getAuthHeaders() });
    }

    // theo ngày hôm nay
    getTotalMoneyByDate() {
        return this.http.get(`${this.apiUrl}/paid-order`, { headers: this.getAuthHeaders() });
    }
    getTotalPaidOrderByDate() {
        return this.http.get(`${this.apiUrl}/date-order`, { headers: this.getAuthHeaders() });
    }
}