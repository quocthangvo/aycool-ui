import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: any;
  productId: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.getProductById();
  }

  getProductById() {
    this.productId = +this.route.snapshot.paramMap.get('id')!;  // Lấy id từ tham số URL

    // Gọi API để lấy thông tin chi tiết sản phẩm
    this.productService.getProductById(this.productId).subscribe(
      (response) => {
        this.product = response.data;  // Lưu trữ thông tin sản phẩm nhận được từ API
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      }
    );
  }

  getUniqueColors(): string[] {
    if (this.product?.product_details) {
      // Create a set to store unique color names
      const colors = this.product.product_details.map((detail: any) => detail.color?.name);
      // Return unique colors only
      return Array.from(new Set(colors));
    }
    return [];
  }

  getUniqueSizes(): string[] {
    if (this.product?.product_details) {
      const sizes = this.product.product_details.map((detail: any) => detail.size?.name);
      return [...new Set(sizes)] as string[]; // Explicitly cast to string[]
    }
    return [];
  }

  quantity: number = 1; // Initial quantity
  maxQuantity: number = 99;
  selectedColor: string | null = null; // To store the selected color
  selectedSize: string | null = null; // To store the selected size

  increaseQuantity() {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  // Select size
  selectSize(size: string): void {
    this.selectedSize = size;
  }
}
