import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { PriceDTO } from '../../dtos/price/price.dto';



@Injectable({
    providedIn: 'root'
})
export class PriceService {
    private apiUrl = `${environment.apiBaseUrl}/prices`;


    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }


    createPrice(data: PriceDTO) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() });
    }

    getAllPrices(page: number, limit: number, sortOrder: string): Observable<any> {
        const params = { page: page.toString(), limit: limit.toString(), sortOrder: sortOrder };
        const options = { headers: this.createHeaders(), params };
        return this.http.get(`${this.apiUrl}`, options);
    }
    getPriceById(id: number): Observable<PriceDTO> {
        return this.http.get<PriceDTO>(`${this.apiUrl}/${id}`);
    }

    getPriceByProductDetailId(id: number): Observable<PriceDTO> {
        return this.http.get<PriceDTO>(`${this.apiUrl}/product_detail/${id}`)
    }

    deletePriceById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updatePriceById(id: number, userData: PriceDTO) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }





}