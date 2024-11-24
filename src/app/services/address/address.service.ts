import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private apiUrl = `${environment.apiBaseUrl}/addresses`;

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
    private addressSubject = new BehaviorSubject<any[]>([]);  // Giỏ hàng ban đầu là mảng rỗng
    public address$ = this.addressSubject.asObservable();// Dùng Observable để subscribe


    getAllAddressByUserId(userId: number) {
        return this.http.get(`${this.apiUrl}/user/${userId}`, { headers: this.getAuthHeaders() })
    }

    createAddress(data: any) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }


    updateAddressSubject(cartItems: any[]): void {
        this.addressSubject.next(cartItems); // Cập nhật giỏ hàng
    }


}