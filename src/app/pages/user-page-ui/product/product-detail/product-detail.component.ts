import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CartService } from '../../../../services/order/cart.service';
import { EvaluateComponent } from "../evaluate/evaluate.component";
import { ReviewComponent } from '../review/review.component';



@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReviewComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: any = {
    product_images: [], // Đây là danh sách ảnh sản phẩm
    // Đây là danh sách chi tiết sản phẩm
  };
  productId: number = 0;
  cartItems: any[] = [];
  userId: number | null = null;

  selectedImage: string | null = null;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private cartService: CartService
  ) { }
  ngOnInit(): void {
    this.loadImage();
    if (this.product?.product_images?.length > 0) {
      this.selectedImage = 'http://localhost:8080/uploads/' + this.product.product_images[0].imageUrl;
    }

    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;  // Cập nhật giỏ hàng trên giao diện mỗi khi `cartSubject` thay đổi
    });

    this.loadCart();

    this.getProductById();
    this.loadCartItems();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userId = userInfo.id;
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
      // Lấy tất cả các màu sắc trong product_details
      const colors = this.product.product_details.map((detail: any) => detail.color?.name);
      // Trả về một mảng các màu sắc duy nhất
      return Array.from(new Set(colors));
    }
    return [];
  }


  getUniqueSizes(): string[] {
    if (this.product?.product_details) {
      // Lấy tất cả các size trong product_details
      const sizes = this.product.product_details.map((detail: any) => detail.size?.name);
      return [...new Set(sizes)] as string[]; // Trả về một mảng các màu sắc duy nhất
    }
    return [];
  }

  quantityAvailable: number | null = null; // Số lượng của sản phẩm theo lựa chọn

  quantity: number = 1; // Initial quantity
  maxQuantity: number = 99;
  selectedColor: string | null = null; // To store the selected color
  selectedSize: string | null = null; // To store the selected size

  isDisabled(): boolean {
    return !(this.selectedColor && this.selectedSize); // Trả về true nếu chưa chọn màu sắc hoặc kích thước
  }

  increaseQuantity() { // tăng số lượng
    if (this.quantityAvailable !== null && this.quantity < this.quantityAvailable) {  // Kiểm tra số lượng kho có đủ để tăng không
      this.quantity++;
    }
  }

  decreaseQuantity() { //giảm số lượng
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.updatePrice();
  }

  // Select size
  selectSize(size: string): void {
    this.selectedSize = size;
    this.updatePrice();
  }

  price: number = 120000; // Giá bán hoặc giá khuyến mãi
  promotionPrice: number | null = 150000; // Lưu giá khuyến mãi

  updatePrice() {
    if (this.selectedColor && this.selectedSize) {
      const selectedProductDetail = this.product.product_details.find(
        (detail: any) =>
          detail.color?.name === this.selectedColor && detail.size?.name === this.selectedSize
      );

      if (selectedProductDetail) {

        // Lấy số lượng còn lại từ kho (remainingQuantity)
        if (selectedProductDetail.warehouses && selectedProductDetail.warehouses.length > 0) {
          const warehouse = selectedProductDetail.warehouses[0]; // Giả định lấy warehouse đầu tiên
          this.quantityAvailable = warehouse.remainingQuantity; // Số lượng còn lại
        } else {
          this.quantityAvailable = 0; // Không có dữ liệu kho
        }

        // Sắp xếp danh sách giá theo createdAt giảm dần
        const sortedPrices = selectedProductDetail.prices.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Lấy giá mới nhất từ danh sách đã sắp xếp
        if (sortedPrices.length > 0) {
          const latestPrice = sortedPrices[0];
          this.promotionPrice = latestPrice.promotionPrice ?? null;
          this.price = latestPrice.sellingPrice;
        } else {
          this.promotionPrice = null;
        }
        // Lấy giá mới nhất từ danh sách đã sắp xếp
        // if (sortedPrices.length > 0) {
        //   const latestPrice = sortedPrices[0];
        //   this.promotionPrice = latestPrice.promotionPrice ?? null; // Giá khuyến mãi
        //   this.price = latestPrice.sellingPrice; // Giá bán
        // }
      }
    }
  }

  loadCartItems() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart); // Cập nhật giỏ hàng từ localStorage
    }
  }
  // addToCart() {
  //   if (!this.selectedColor || !this.selectedSize) {
  //     alert('Vui lòng chọn màu sắc và kích thước!');
  //     return;
  //   }

  //   const productDetail = this.product.product_details.find(
  //     (detail: any) =>
  //       detail.color?.name === this.selectedColor && detail.size?.name === this.selectedSize
  //   );

  //   if (!productDetail) {
  //     alert('Không tìm thấy sản phẩm với màu và kích thước đã chọn!');
  //     return;
  //   }

  //   const cartItem = {
  //     id: this.product.id,
  //     name: this.product.name,
  //     color: this.selectedColor,
  //     size: this.selectedSize,
  //     quantity: this.quantity,
  //     promotionPrice: productDetail.prices[0]?.promotionPrice ?? productDetail.prices[0]?.sellingPrice,
  //     sellingPrice: productDetail.prices[0]?.sellingPrice,
  //     image: productDetail.images?.[0] || 'default-image.jpg',
  //   };

  //   // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
  //   const existingItemIndex = this.cartItems.findIndex(
  //     (item: any) =>
  //       item.id === cartItem.id &&
  //       item.color === cartItem.color &&
  //       item.size === cartItem.size
  //   );

  //   if (existingItemIndex !== -1) {
  //     // Nếu sản phẩm đã tồn tại, tăng số lượng lên
  //     this.cartItems[existingItemIndex].quantity += cartItem.quantity;
  //   } else {
  //     // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ
  //     this.cartItems.push(cartItem);
  //   }

  //   // Lưu giỏ hàng vào localStorage và cập nhật lại giỏ hàng trong component
  //   localStorage.setItem('cart', JSON.stringify(this.cartItems));

  //   // Cập nhật trực tiếp giỏ hàng trong component
  //   // this.cartItems = [...this.cartItems];
  //   this.cartService.loadCartItems();

  //   this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm sản phẩm thành công' });

  // }


  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  addToCart() {
    if (!this.userId) {
      console.error('User not logged in');
      return;
    }

    // Kiểm tra xem người dùng đã chọn color và size chưa
    if (!this.selectedColor || !this.selectedSize) {
      alert('Vui lòng chọn màu sắc và kích thước!');
      return;
    }

    // Tìm kiếm productDetailId dựa trên color và size đã chọn
    const selectedProductDetail = this.product.product_details.find(
      (detail: any) =>
        detail.color?.name === this.selectedColor && detail.size?.name === this.selectedSize
    );

    if (!selectedProductDetail) {
      alert('Không tìm thấy sản phẩm với màu sắc và kích thước đã chọn!');
      return;
    }

    const productDetailId = selectedProductDetail.id; // Lấy id từ product_details
    const quantity = this.quantity;

    const data = {
      user_id: this.userId, // Sử dụng userId từ localStorage
      product_detail_id: productDetailId,
      quantity: quantity,
    };

    // Gọi CartService để thêm sản phẩm vào giỏ
    this.cartService.addToCart(data).subscribe(
      (response: any) => {
        console.log('Sản phẩm đã được thêm vào giỏ hàng:', response);

        this.cartService.updateCartSubject(response.data.items);  // Cập nhật giỏ hàng từ phản hồi API

        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm sản phẩm vào giỏ hàng thành công',
        });
      },
      (error: any) => {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể thêm sản phẩm vào giỏ hàng',
        });
      }
    );

  }

  loadCart(): void {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const userId = user.id;

      // Gọi API để lấy giỏ hàng
      this.cartService.getCart(userId).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.cartItems = res.data.items;  // Cập nhật giỏ hàng từ API
            this.cartService.updateCartSubject(this.cartItems);  // Cập nhật lại cartSubject để đồng bộ giỏ hàng
          }
        },
        error: (err: any) => {
          console.error('An error occurred:', err);
        }
      });
    } else {
      console.error('User information not found in localStorage.');
    }
  }
  loadImage(): void {
    if (this.product?.product_images?.length > 0) {
      this.selectedImage =
        'http://localhost:8080/uploads/' + this.product.product_images[0].imageUrl;
    }
  }
  selectImage(imageUrl: string): void {
    this.selectedImage = 'http://localhost:8080/uploads/' + imageUrl;
  }
}
