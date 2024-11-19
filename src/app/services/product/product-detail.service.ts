import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { ProductDetailDTO } from '../../dtos/product/product-detail.dto';


@Injectable({
    providedIn: 'root'
})
export class ProductDetailService {
    private apiUrl = `${environment.apiBaseUrl}/product_details`;


    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }



    getAllProductDetails(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/product/${id}`);
    }
    getProductDetailById(id: number): Observable<ProductDetailDTO> {
        return this.http.get<ProductDetailDTO>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    deleteProductDetailById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateProductDetailById(id: number, userData: ProductDetailDTO) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }

    getAllProductDetailsNoId() {
        return this.http.get(`${this.apiUrl}`);

    }




}