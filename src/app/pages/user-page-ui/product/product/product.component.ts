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

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private router: Router
  ) { }

  ngOnInit() {


    // Lấy danh sách sản phẩm từ API
    this.productService.getAllProducts(0, 10).subscribe((res) => {
      this.products = res.data.productResponseList;
    });
  }

  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/vn/product-detail', productId]).then(() => {
      // Scroll to the top of the page after navigation
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }


}
