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

  totalRecords: number = 10; // Tổng số đơn hàng
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
      color: [null],
      size: [[]],  // Mảng trống cho kích thước
      material: [[]]  // Mảng trống cho chất liệu
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe(); // Hủy đăng ký nếu có
  }

  ngOnInit(): void {
    this.loadColors();
    this.loadSizes();
    this.loadMaterials();

    // Đăng ký sự thay đổi của subCategoryId trong URL
    this.sub = this.route.paramMap.subscribe((params) => {
      this.subCategoryId = +params.get('subCategoryId')!;
      console.log('Subcategory ID:', this.subCategoryId);
      this.loadProducts();  // Tải lại sản phẩm khi subCategoryId thay đổi
    });



    // Theo dõi sự thay đổi trong filter form và tải lại sản phẩm khi có thay đổi
    this.filterForm.valueChanges.subscribe(() => {
      this.loadProducts();
    });

    // Lấy tham số lọc từ URL nếu có
    // this.route.queryParamMap.subscribe(params => {
    //   const colorId = params.get('color_id');
    //   const sizeIds = params.get('size_ids') ? params.get('size_ids')?.split(',') : [];
    //   const materialIds = params.get('material_ids') ? params.get('material_ids')?.split(',') : [];

    //   // Cập nhật giá trị bộ lọc từ URL
    //   this.filterForm.patchValue({
    //     color: colorId,
    //     size: sizeIds,
    //     material: materialIds
    //   });

    //   // Tải lại sản phẩm với tham số lọc từ URL
    //   this.loadProducts();
    // });

  }




  // Chỉnh sửa phương thức loadProducts để không tải lại theo subCategoryId
  loadProducts() {
    if (!this.subCategoryId) return;



    // Cập nhật URL khi có thay đổi bộ lọc
    const colorId: number = this.filterForm.value.color;
    const sizeIds: number[] = this.filterForm.value.size || [];  // Đảm bảo sizeIds là một mảng số
    const materialIds: number[] = this.filterForm.value.material || [];  // Đảm bảo materialIds là mảng số

    // Lấy tên tương ứng với ID
    const colorName = this.colors.find(color => color.id === colorId)?.name || '';
    const sizeNames = sizeIds.map(sizeId => this.sizes.find(size => size.id === sizeId)?.name || '').join(',');
    const materialNames = materialIds.map(materialId => this.materials.find(material => material.id === materialId)?.name || '').join(',');

    // Cập nhật URL với tên thay vì ID
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        color_id: colorName || null,
        size_ids: sizeNames || null,
        material_ids: materialNames || null
      },
      queryParamsHandling: 'merge'  // Giữ lại các tham số khác trong URL
    });

    // Gọi API với ID (vì API vẫn cần ID để lọc)
    this.productService.getProductBySubCategory(
      this.currentPage,
      this.rowsPerPage,
      this.subCategoryId,
      colorId,
      sizeIds,
      materialIds
    ).subscribe(response => {
      this.products = response?.data?.productResponseList || [];
      this.category = this.products.length > 0 ? this.products[0].category : ''; // lấy category
      this.sub_category_name = this.products.length > 0 ? this.products[0].sub_category_name : ''; // lấy subcategory
      this.totalRecords = response?.data?.totalRecords || 0;  // Cập nhật tổng số sản phẩm
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
    this.loadProducts(); // Tải lại sản phẩm với trang mới
  }
  cancel() {
    // Reset lại các giá trị trong filterForm
    this.filterForm.patchValue({
      color: null,
      size: [],
      material: []
    });

    // Cập nhật URL, xóa các tham số bộ lọc
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        color_id: null,
        size_ids: null,
        material_ids: null
      },
      queryParamsHandling: 'merge'  // Giữ lại các tham số khác trong URL
    });

    // Tải lại sản phẩm với các bộ lọc đã bị xóa
    this.loadProducts();
  }


}
