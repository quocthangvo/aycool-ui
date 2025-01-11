import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from '../../../../models/product/product.model';
import { ProductService } from '../../../../services/product/product.service';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { OrderDetailService } from '../../../../services/order/order-detail.service';
import { PurchaseService } from '../../../../services/warehouse/purchase.service';
import { WarehouseService } from '../../../../services/warehouse/warehouse.service';

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

  topProducts: any[] = [];

  purchase: any[] = [];

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private orderDetailService: OrderDetailService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadProductsByCategory(1);  // Load Áo Nam (Shirts)
    this.loadProductsByCategory(2);  // Load Quần Nam (Pants)
    this.loadProductsByCategory(3);  // Load Phụ Kiện (Accessories)
    this.topProduct();
    this.loadWarehouse();
  }

  loadWarehouse() {
    this.warehouseService.getAllWarehouseByProduct().subscribe((res: any) => {
      this.purchase = res.data;
    });
  }
  topProduct() {
    this.orderDetailService.getTopSellingProducts().subscribe((res: any) => {
      // Kiểm tra xem res.data có phải là mảng không, nếu không thì chuyển thành mảng
      // if (!Array.isArray(res.data)) {
      //   res.data = [res.data]; // Chuyển đối tượng thành mảng có một phần tử
      // }


      // Sau khi đảm bảo rằng res.data là mảng, gán cho topProducts
      // this.topProducts = res.data.map((product: any) => {
      //   return {
      //     ...product,
      //     imageUrl: product.image_url?.[0]?.imageUrl,  // Lấy URL ảnh đầu tiên
      //     price: product.price?.[0] || {}  // Lấy giá đầu tiên trong mảng price
      //   };
      // });
      // Gán thông tin sản phẩm và xử lý các thuộc tính imageUrl và price
      const products = Array.isArray(res.data) ? res.data : [res.data];

      this.topProducts = products.map((product: any) => {
        return {
          ...product,
          imageUrl: product.image_url?.[0]?.imageUrl || '',  // Lấy URL ảnh đầu tiên, nếu không có thì trả về chuỗi rỗng
          price: product.price?.[0] || {}  // Lấy giá đầu tiên trong mảng price, nếu không có thì trả về đối tượng rỗng
        };
      });

    });
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
