import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { SubCategoryDTO } from '../../dtos/category/sub-category.dto';
import { SubCategory } from '../../models/category/sub-category.model';


@Injectable({
    providedIn: 'root'
})
export class SubCategoryService {
    private apiUrl = `${environment.apiBaseUrl}/sub_categories`;

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    createSubCategory(data: SubCategoryDTO) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }
    getAllSubCategories(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
    getSubCategoryById(id: number): Observable<SubCategory> {
        return this.http.get<SubCategory>(`${this.apiUrl}/${id}`);
    }
    deleteSubCategoryById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateSubCategoryById(id: number, userData: SubCategoryDTO) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }
}