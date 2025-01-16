import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TreeSelectModule } from 'primeng/treeselect';
import { WarehouseService } from '../../../../services/warehouse/warehouse.service';
import { SubCategoryService } from '../../../../services/category/sub-category.service';
import { MaterialService } from '../../../../services/attribute/material.service';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule,
    RouterLink, PaginatorModule, TreeSelectModule, ImageModule],
  providers: [ConfirmationService],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WarehouseListComponent {
  warehouseList: any[] = [];

  totalRecords: number = 0; // sluong trang
  rowsPerPage: number = 10;   // Số lượng sp hiện thị mỗi trang
  currentPage: number = 0; // Trang hiện tại bắt đầu từ

  searchName: string = ''; // Từ khóa tìm kiếm
  subCategories: Array<{ id: number, name: string }> = []; // Danh sách danh mục con
  subCategoryId: number | undefined = undefined; // Lựa chọn danh mục con

  materials: any[] = [];
  materialId: number | undefined = undefined;

  constructor(
    private warehouseService: WarehouseService,
    private confirmationService: ConfirmationService,
    private subCategoryService: SubCategoryService,
    private materialService: MaterialService
  ) {

  }

  ngOnInit() {
    this.loadWarehouses(this.totalRecords, this.rowsPerPage, this.searchName, this.subCategoryId, this.materialId);
    this.loadSubCategory();
    this.loadMaterial();
  }

  loadWarehouses(page: number, limit: number, skuName: string = '', subCategoryId?: number, materialId?: number) {
    this.warehouseService.getAllWarehouse(page, limit, skuName, subCategoryId, materialId).subscribe((res) => {
      this.warehouseList = res.data.warehouseResponseList;
      this.totalRecords = res.data.totalRecords;
    });
  }

  loadSubCategory() {
    this.subCategoryService.getAllSubCategories().subscribe((res) => {  // Lấy danh sách danh mục con
      this.subCategories = res.data;
    });
  }
  loadMaterial() {
    this.materialService.getAllMaterials().subscribe((res) => {  // chất liệu
      this.materials = res.data;
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadWarehouses(this.currentPage, this.rowsPerPage, this.searchName, this.subCategoryId, this.materialId);
  }

  onSearch() {
    this.currentPage = 0; // Reset về trang đầu tiên
    this.loadWarehouses(this.currentPage, this.rowsPerPage, this.searchName, this.subCategoryId, this.materialId);
  }
  clearSearch() {
    this.searchName = ''; // Đặt giá trị của searchName về rỗng
    this.subCategoryId = undefined; // Xóa bộ lọc danh mục con
    this.materialId = undefined; // Xóa bộ lọc chất liệu
    this.loadWarehouses(this.currentPage, this.rowsPerPage, this.searchName, this.subCategoryId, this.materialId);

  }
  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }
}
