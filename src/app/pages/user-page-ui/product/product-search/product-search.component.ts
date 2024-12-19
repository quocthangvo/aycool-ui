import { Component, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../services/category/category.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { SubCategoryService } from '../../../../services/category/sub-category.service';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [DropdownModule, CommonModule, PaginatorModule],
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
  rowsPerPage: number = 10; // Số đơn hàng mỗi trang
  currentPage: number = 0; // Trang hiện tại


  constructor(

    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private subCategoryService: SubCategoryService,
  ) {

  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.onSearch(this.currentPage, this.rowsPerPage);
    });

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe(); // Hủy đăng ký nếu có
  }
  onSearch(page: number, limit: number) {
    this.productService.getProductBySearchAndSubCategory(page, limit, this.searchTerm, this.selectedsubCategory?.id).subscribe(
      (response) => {
        console.log('Search Results:', response);
        const products = response.data.productResponseList;
        this.products = products;
        this.totalRecords = response.data.totalRecords; // Update the total records for pagination
        this.totalPages = response.data.totalPages; // Update the total pages
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


  onSubCategorySelect(subCategoryId: number): void {
    // Find the selected subcategory by its ID
    this.selectedsubCategory = this.subCategories.find(sub => sub.id === subCategoryId);

    // Update the URL with the selected subcategory name instead of id, and remove search
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sub_category_name: this.selectedsubCategory?.name,
        search: null,
      },
      queryParamsHandling: 'merge', // Merge with other query params (keeping any existing params)
    });

    // Trigger the search with the selected subcategory
    this.onSearch(this.currentPage, this.rowsPerPage);
  }

  //phan trang
  onPageChange(event: any): void {
    this.currentPage = event.page; // Cập nhật trang hiện tại
    this.rowsPerPage = event.rows; // Cập nhật số dòng mỗi trang
    this.onSearch(this.currentPage, this.rowsPerPage);
  }


}


