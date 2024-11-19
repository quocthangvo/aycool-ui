import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { OrderDTO } from '../../dtos/order/order.dto';



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

    getAllOrders(page: number, limit: number): Observable<OrderDTO> {
        const params = { page: page.toString(), limit: limit.toString() };
        const options = {
            params: params,
            headers: this.getAuthHeaders(),

        };

        return this.http.get<OrderDTO>(this.apiUrl, options);
    }

    getOrderById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    deleteOrderById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateOrderById(id: number, userData: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }

}