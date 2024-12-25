import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';

import { CouponDTO } from '../../dtos/coupon/coupon.dto';
import { Coupon } from '../../models/coupon/coupon.model';


@Injectable({
    providedIn: 'root'
})
export class CouponService {
    private apiUrl = `${environment.apiBaseUrl}/coupons`;

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    createCoupon(data: CouponDTO) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }
    getAllCoupons(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
    getCouponById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
    deleteCouponById(id: number) {
        return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
    }

    updateCouponById(id: number, userData: CouponDTO) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }

    getCouponByStatus(): Observable<any> {
        return this.http.get(`${this.apiUrl}/status`);
    }

}