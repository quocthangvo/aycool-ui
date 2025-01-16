import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { ReviewDTO } from '../../dtos/review/review.dto';



@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    private apiUrl = `${environment.apiBaseUrl}/purchases`;

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


    createPurchase(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }

    getAllPurchase(page: number, limit: number,
        productName: string = '', subCategoryId: number | undefined): Observable<any> {
        const params: any = {
            page: page.toString(),
            limit: limit.toString()
        };

        // Thêm tham số `productName` nếu có
        if (productName) {
            params.productName = productName;
        }

        // Thêm tham số `subCategoryId` nếu có
        if (subCategoryId) {
            params.subCategoryId = subCategoryId;
        }

        const options = { headers: this.createHeaders(), params };
        return this.http.get(`${this.apiUrl}`, options);
    }


    getPurchaseId(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    deletePurchaseId(id: number) {
        return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
    }

    updatePurchaseId(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/update/${id}`, data, { headers: this.getAuthHeaders() });
    }

}
