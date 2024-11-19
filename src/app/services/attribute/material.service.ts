import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { Observable } from "rxjs";
import { Material } from "../../models/attribute/material.model";
import { MaterialDTO } from "../../dtos/attribute/material.dto";
import { TokenService } from "../auth/token.service";


@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    private apiUrl = `${environment.apiBaseUrl}/materials`

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }


    getAllMaterials() {
        return this.http.get(this.apiUrl)
    }
    getMaterialById(id: number): Observable<Material> {
        return this.http.get<Material>(`${this.apiUrl}/${id}`)
    }

    createMaterial(data: MaterialDTO) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }

    deleteMaterialById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateMaterialById(id: number, data: any): Observable<MaterialDTO> {
        return this.http.put<MaterialDTO>(`${this.apiUrl}/update/${id}`, data, { headers: this.getAuthHeaders() });
    }
}