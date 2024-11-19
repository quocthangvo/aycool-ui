import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { ProductDTO } from '../../dtos/product/product.dto';


@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiBaseUrl}/products`;

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


    createProduct(data: ProductDTO): Observable<ProductDTO> {
        return this.http.post<ProductDTO>(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }

    getAllProducts(page: number, limit: number): Observable<any> {
        const params = { page: page.toString(), limit: limit.toString() };
        const options = { headers: this.createHeaders(), params };

        return this.http.get(this.apiUrl, options);
    }
    getProductById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    deleteProductById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateProductById(id: number, userData: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }

    uploadImageProduct(id: number, data: FormData) {
        return this.http.post(`${this.apiUrl}/uploads/${id}`, data, { headers: this.getAuthHeaders() });
    }


    getImageByProductId(id: number) {
        return this.http.get(`${this.apiUrl}/images/${id}`);
    }

    getAllProductNotPage() {
        return this.http.get(`${this.apiUrl}/all`)
    }
}