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

    getAllProduct(page: number, limit: number): Observable<any> {
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

    getAllProducts(page: number, limit: number, name: string, materialId: number | null): Observable<any> {
        const params: any = {
            page: page.toString(),
            limit: limit.toString(),
        };

        // Thêm tham số tìm kiếm và lọc nếu có
        if (name) params.name = name;
        if (materialId !== null && materialId !== undefined) { // Kiểm tra materialId là number và không phải null
            params.materialId = materialId.toString(); // Convert to string for HTTP params
        }

        const options = {
            headers: this.createHeaders(),
            params: params,
        };

        return this.http.get<any>(`${this.apiUrl}/all`, options); // Cập nhật URL API cho đúng endpoint
    }

    getProductBySubCategory(page: number, limit: number, subCategoryId: number,
        colorId: number | null, sizeId: number[] | null, materialId: number[] | null) {

        const params: any = {
            page: page.toString(),
            limit: limit.toString(),
            subCategoryId: subCategoryId.toString(), // Lọc theo subCategoryId trước

        };

        // Chỉ thêm các bộ lọc nếu có giá trị
        if (colorId !== null && colorId !== undefined) {
            params.colorId = colorId.toString();  // Lọc theo color nếu có
        }

        if (sizeId && sizeId.length > 0) {
            params.sizeId = sizeId.join(',');  // Lọc theo size nếu có
        }

        if (materialId && materialId.length > 0) {
            params.materialId = materialId.join(',');  // Lọc theo material nếu có
        }

        const options = {
            headers: this.createHeaders(),
            params: params,
        };

        // Gọi API với các tham số đã chuẩn bị
        return this.http.get<any>(`${this.apiUrl}/sub_category/${subCategoryId}`, options);
    }

    getProductBySearchAndSubCategory(page: number, limit: number, name: string, subCategoryId: number) {
        const params: any = {
            page: page.toString(),
            limit: limit.toString(),
            name: name || '',
            sub_category_id: subCategoryId ?? '',
        };

        const options = {
            headers: this.createHeaders(),
            params: params,
        };

        return this.http.get<any>(`${this.apiUrl}/search`, options);
    }


    // lấy sản phẩm theo danh mục 
    getProductByCategory(page: number, limit: number, categoryId: number) {
        const params: any = {
            page: page.toString(),
            limit: limit.toString(),
            categoryId: categoryId.toString(),
        }
        const options = {
            headers: this.createHeaders(),
            params: params,
        };
        return this.http.get(`${this.apiUrl}/category/${categoryId}`, options);
    }
}