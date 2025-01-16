import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { ReviewDTO } from '../../dtos/review/review.dto';



@Injectable({
    providedIn: 'root'
})
export class WarehouseService {
    private apiUrl = `${environment.apiBaseUrl}/warehouse`;

    private apiConfig = {
        headers: this.createHeaders()
    }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    constructor(private http: HttpClient, private tokenService: TokenService) { }


    // search admin
    getAllWarehouse(page: number, limit: number, skuName: string = '',
        subCategoryId: number | undefined, materialId: number | undefined): Observable<any> {
        const params: any = { page: page.toString(), limit: limit.toString() };
        // Thêm tham số `skuName` nếu có
        if (skuName) {
            params.skuName = skuName;
        }
        if (subCategoryId !== undefined && subCategoryId !== null) {
            params.subCategoryId = subCategoryId.toString();
        }
        if (materialId !== undefined && materialId !== null) {
            params.materialId = materialId.toString();
        }
        const options = { headers: this.createHeaders(), params };

        return this.http.get(`${this.apiUrl}`, options);
    }
    //search trong user
    getAllWarehouseByProduct(page: number, limit: number, searchTerm: string = "", subCategoryId?: number): Observable<any> {
        const params: any = {
            page: page.toString(), limit: limit.toString(),
        };

        if (searchTerm) {
            params.searchTerm = searchTerm;
        }
        if (subCategoryId !== undefined && subCategoryId !== null) {
            params.subCategoryId = subCategoryId.toString();
        }

        const options = { headers: this.createHeaders(), params };
        return this.http.get(`${this.apiUrl}/grouped`, options);
    }

    getAll(page: number, limit: number, name: string = "", subCategoryId?: number): Observable<any> {
        const params: any = {
            page: page.toString(), limit: limit.toString(),
        };

        if (name) {
            params.searchTerm = name;
        }
        if (subCategoryId !== undefined && subCategoryId !== null) {
            params.subCategoryId = subCategoryId.toString();
        }

        const options = { headers: this.createHeaders(), params };
        return this.http.get(`${this.apiUrl}/products`, options);
    }


    // lấy sp theo subcategory
    getAllWarehouseBySubCategory(
        subCategoryId: number,
        colorIds: number[] | null,
        sizeIds: number[] | null,
        materialId: number | null,
        page: number,
        limit: number
    ): Observable<any> {
        // Tạo các tham số query một cách động
        const params: any = {
            subCategoryId: subCategoryId.toString(),
            page: page.toString(),
            limit: limit.toString(),
        };

        // Thêm các tham số tùy chọn nếu được cung cấp
        if (colorIds && colorIds.length > 0) {
            params.colorIds = colorIds.map((id) => id.toString());
        }

        if (sizeIds && sizeIds.length > 0) {
            params.sizeIds = sizeIds.map((id) => id.toString());
        }

        if (materialId !== null) {
            params.materialId = materialId.toString();
        }



        const options = { headers: this.createHeaders(), params };

        // Gửi yêu cầu HTTP GET
        return this.http.get(`${this.apiUrl}/grouped/sub-category`, options);
    }

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
        return this.http.get(`${this.apiUrl}/categoryId`, options);
    }
}