import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';




@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiBaseUrl}/payment`;

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
            'Authorization': `Bearer ${token}`
        });
    }


    // createPayment(data: PaymentDTO): Observable<PaymentDTO> {
    //     return this.http.post<PaymentDTO>(`${this.apiUrl}/create`, data, { headers: this.getAuthHeaders() })
    // }

    getVNPay(amount: number, bankCode: string): Observable<any> {
        const params = new HttpParams()
            .set('amount', amount.toString())
            .set('bankCode', bankCode);

        return this.http.get(`${this.apiUrl}/vn-pay`, { params });
    }

    getVNPayCallback(): Observable<any> {
        return this.http.get<any>('/vn-pay-callback');
    }

    verifyPayment(paymentData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/vn-pay-callback`, paymentData);
    }






}