import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from '../../../../models/product/product.model';
import { ProductService } from '../../../../services/product/product.service';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  productId: number = 0;
  responsiveOptions: any[] | undefined;

  productShirts: any[] = [];  // Store products for Áo Nam
  productPants: any[] = [];   // Store products for Quần Nam
  productAccessories: any[] = []; // Store products for Phụ Kiện

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadProductsByCategory(1);  // Load Áo Nam (Shirts)
    this.loadProductsByCategory(2);  // Load Quần Nam (Pants)
    this.loadProductsByCategory(3);  // Load Phụ Kiện (Accessories)
  }

  loadProducts() {
    this.productService.getAllProduct(0, 10).subscribe((res: any) => {
      this.products = res.data.productResponseList;
    });
  }

  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]).then(() => {
      // Scroll to the top of the page after navigation
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }


  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  loadProductsByCategory(categoryId: number) {
    this.productService.getProductByCategory(0, 10, categoryId).subscribe((res: any) => {
      if (categoryId === 1) {
        this.productShirts = res.data.productResponseList; // Áo Nam
      } else if (categoryId === 2) {
        this.productPants = res.data.productResponseList; // Quần Nam
      } else if (categoryId === 3) {
        this.productAccessories = res.data.productResponseList; // Phụ Kiện
      }
    });
  }
}
