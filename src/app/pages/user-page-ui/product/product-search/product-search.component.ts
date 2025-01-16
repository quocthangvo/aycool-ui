import { Component, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../services/category/category.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { SubCategoryService } from '../../../../services/category/sub-category.service';
import { WarehouseService } from '../../../../services/warehouse/warehouse.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [DropdownModule, CommonModule, PaginatorModule, ButtonModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductSearchComponent {
  selectedCategory: any = null;
  categories: any[] = [];
  searchTerm: string = '';
  subCategories: any[] = [];
  selectedsubCategory: any = null;

  products: any[] = [];
  private sub: any;

  totalRecords: number = 0; // Tổng số đơn hàng
  totalPages: number = 0; // Tổng số trang
  rowsPerPage: number = 30; // Số đơn hàng mỗi trang
  currentPage: number = 0; // Trang hiện tại

  subCategoryId: number | undefined = undefined;

  constructor(

    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private subCategoryService: SubCategoryService,
    private warehouseService: WarehouseService
  ) {

  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.onSearch(this.currentPage, this.rowsPerPage, this.searchTerm, this.subCategoryId);
    });

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe(); // Hủy đăng ký nếu có
  }

  onSearch(page: number, limit: number,
    searchTerm: string | undefined, subCategoryId: number | undefined): void {

    this.warehouseService.getAllWarehouseByProduct(page, limit, searchTerm, subCategoryId).subscribe(
      (response) => {
        console.log('Search Results:', response);
        const products = response.data.warehouseGroupResponseList;
        this.products = products;

        // Kiểm tra nếu không có sản phẩm nào
        if (products.length === 0) {
          // Hiển thị thông báo hoặc thông báo cho người dùng rằng không có sản phẩm phù hợp
          console.log('Không có sản phẩm nào phù hợp với tìm kiếm.');
        }

        this.totalRecords = response.data.totalRecords;
        this.totalPages = response.data.totalPages;
      },
      (error) => {
        console.error('Search Error:', error);
      }
    );
  }




  loadCategories() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res.data;
    });
  }

  loadSubCategories(): void {
    this.subCategoryService.getAllSubCategories().subscribe((res: any) => {
      this.subCategories = res.data;
    });
  }


  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]); // Chuyển hướng đến trang product-detail với ID sản phẩm
  }


  // onSubCategorySelect(subCategoryId: number): void {
  //   // Find the selected subcategory by its ID
  //   this.selectedsubCategory = this.subCategories.find(sub => sub.id === subCategoryId);

  //   // Update the URL with the selected subcategory name instead of id, and remove search
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: {
  //       sub_category_name: this.selectedsubCategory?.name,
  //       search: null,
  //     },
  //     queryParamsHandling: 'merge', // Merge with other query params (keeping any existing params)
  //   });

  //   // Trigger the search with the selected subcategory
  //   this.onSearch(this.currentPage, this.rowsPerPage, this.searchTerm, this.subCategoryId);
  // }
  onSubCategorySelect(subCategoryId: number): void {
    if (subCategoryId !== undefined && subCategoryId !== null) {
      this.subCategoryId = subCategoryId;
      this.selectedsubCategory = this.subCategories.find(sub => sub.id === subCategoryId);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          sub_category_name: this.selectedsubCategory?.name,
        },
        queryParamsHandling: 'merge',
      });

      this.onSearch(this.currentPage, this.rowsPerPage, this.searchTerm, this.subCategoryId);
    }
  }






  //phan trang
  onPageChange(event: any): void {
    this.currentPage = event.page; // Cập nhật trang hiện tại
    this.rowsPerPage = event.rows; // Cập nhật số dòng mỗi trang
    this.onSearch(this.currentPage, this.rowsPerPage, this.searchTerm, this.subCategoryId);
  }
  clearFilters(): void {

    // this.searchTerm = '';      // Xóa từ khóa tìm kiếm
    this.selectedsubCategory = null;
    this.subCategoryId = undefined;  // Xóa danh mục con
    this.onSearch(this.currentPage, this.rowsPerPage, this.searchTerm, undefined);  // Thực hiện tìm kiếm không có điều kiện lọc

    this.router.navigate(['/product-search'], {
      queryParamsHandling: 'merge',  // Giữ nguyên các tham số URL khác
      queryParams: {
        sub_category_name: null,  // Xóa `sub_category_name` nếu có
      },
    });

  }


}


