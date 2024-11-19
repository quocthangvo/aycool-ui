import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { Observable } from "rxjs";
import { Size } from "../../models/attribute/size.model";
import { SizeDTO } from "../../dtos/attribute/size.dto";
import { TokenService } from "../auth/token.service";


@Injectable({
    providedIn: 'root'
})
export class SizeService {
    private apiUrl = `${environment.apiBaseUrl}/sizes`

    constructor(private http: HttpClient, private tokenService: TokenService) { }
    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }
    getAllSizes() {
        return this.http.get(this.apiUrl)
    }
    getSizeById(id: number): Observable<Size> {
        return this.http.get<Size>(`${this.apiUrl}/${id}`)
    }

    createSize(data: SizeDTO) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }

    deleteSizeById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateSizeById(id: number, userData: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }
}