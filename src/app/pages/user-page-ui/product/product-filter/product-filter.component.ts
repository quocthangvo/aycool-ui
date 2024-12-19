import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ColorService } from '../../../../services/attribute/color.service';
import { SizeService } from '../../../../services/attribute/size.service';
import { MaterialService } from '../../../../services/attribute/material.service';
import { ProductService } from '../../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategoryService } from '../../../../services/category/sub-category.service';
import { Category } from '../../../../models/category/category.model';
import { CategoryService } from '../../../../services/category/category.service';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [FormsModule, CheckboxModule, DropdownModule, ReactiveFormsModule,
    CommonModule, ButtonModule, PaginatorModule, RadioButtonModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  colors: any[] = [];
  sizes: any[] = [];
  materials: any[] = [];

  categories: any[] = [];
  category: any = null;
  sub_category_name: any = null;

  subCategoryId: number | null = null;
  products: any[] = [];
  private sub: any;

  totalRecords: number = 0; // Tổng số đơn hàng
  totalPages: number = 0; // Tổng số trang
  rowsPerPage: number = 10; // Số đơn hàng mỗi trang
  currentPage: number = 0; // Trang hiện tại


  constructor(
    private fb: FormBuilder,
    private colorService: ColorService,
    private sizeService: SizeService,
    private materialService: MaterialService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
  ) {
    this.filterForm = this.fb.group({
      color: new FormControl(null), // Danh sách màu sắc
      size: new FormControl([]), // Danh sách kích thước
      material: new FormControl([]), // Danh sách chất liệu
    });
  }

  ngOnInit(): void {
    this.loadColors();
    this.loadSizes();
    this.loadMaterials();

    // Đăng ký sự thay đổi của subCategoryId trong URL
    this.sub = this.route.paramMap.subscribe((params) => {
      this.subCategoryId = +params.get('subCategoryId')!;
      console.log('Subcategory ID:', this.subCategoryId);
      this.loadProducts(null, [], []);  // Tải lại sản phẩm khi subCategoryId thay đổi
    });


  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe(); // Hủy đăng ký nếu có
  }


  // Chỉnh sửa phương thức loadProducts để không tải lại theo subCategoryId
  loadProducts(colorId: number | null = null, sizeId: number[] = [], materialId: number[] = []): void {
    if (!this.subCategoryId) return; // If subCategoryId is not valid, don't make the API call

    // API call with selected filter parameters
    this.productService.getProductBySubCategory(
      this.currentPage,
      this.rowsPerPage,
      this.subCategoryId,
      colorId,
      sizeId,
      materialId
    ).subscribe(response => {
      this.products = response?.data?.productResponseList || [];
      this.category = this.products.length > 0 ? this.products[0].category : ''; // lấy category
      this.sub_category_name = this.products.length > 0 ? this.products[0].sub_category_name : ''; // lấy subcategory
      // Lấy tất cả các subCategories từ các sản phẩm và loại bỏ danh mục trùng lặp
      // const allSubCategories = this.products.map(product => product.category.subCategories).flat();
      // this.categories = Array.from(new Set(allSubCategories.map(a => a.id)))
      //   .map(id => allSubCategories.find(a => a.id === id));
    });
  }


  loadCategories() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res.data;
    });
  }


  loadColors() {
    this.colorService.getAllColors().subscribe((res: any) => {
      this.colors = res.data;
    });
  }

  loadSizes() {
    this.sizeService.getAllSizes().subscribe((res: any) => {
      this.sizes = res.data;
    });
  }

  loadMaterials() {
    this.materialService.getAllMaterials().subscribe((res: any) => {
      this.materials = res.data;
    });
  }


  filterBySubCategory(subCategoryId: number): void {
    this.router.navigate(['/products', subCategoryId]); // Điều hướng với subCategoryId
  }


  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]); // Chuyển hướng đến trang product-detail với ID sản phẩm
  }

  //phan trang
  onPageChange(event: any): void {
    this.currentPage = event.page; // Cập nhật trang hiện tại
    this.rowsPerPage = event.rows; // Cập nhật số dòng mỗi trang
    this.loadProducts(null, [], []); // Tải lại sản phẩm với trang mới
  }
}
