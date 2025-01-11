import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class OrderDetailService {
    private apiUrl = `${environment.apiBaseUrl}/order_details`;

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



    getOrderDetailByOrderId(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/orders/${id}`);
    }


    getTopSellingProducts(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/top3-selling`);
    }

}