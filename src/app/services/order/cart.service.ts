import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, switchMap, tap } from "rxjs";
import { environment } from "../../environments/environments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenService } from "../auth/token.service";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = `${environment.apiBaseUrl}/carts`

    private cartItemsSubject = new BehaviorSubject<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
    cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }


    loadCartItems() {
        const cartItems = this.getCartFromLocalStorage();
        this.cartItemsSubject.next(cartItems);
    }
    private getCartFromLocalStorage(): any[] {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }

    private saveCartToLocalStorage(cartItems: any[]): void {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // getCartItems(): any[] {
    //     return this.cartItemsSubject.value;
    // }

    // addToCart(cartItem: any) {
    //     const cartItems = this.cartItemsSubject.value;

    //     // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
    //     const existingItemIndex = cartItems.findIndex(
    //         (item: any) =>
    //             item.id === cartItem.id &&
    //             item.color === cartItem.color &&
    //             item.size === cartItem.size
    //     );

    //     if (existingItemIndex !== -1) {
    //         // Nếu sản phẩm đã tồn tại, tăng số lượng lên
    //         cartItems[existingItemIndex].quantity += cartItem.quantity;
    //     } else {
    //         // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ
    //         cartItems.push(cartItem);
    //     }

    //     // Lưu giỏ hàng vào localStorage và cập nhật lại giỏ hàng trong service
    //     localStorage.setItem('cart', JSON.stringify(cartItems));
    //     this.cartItemsSubject.next(cartItems); // Cập nhật giỏ hàng
    // }



    clearCart() {
        this.cartSubject.next([]); // Cập nhật giỏ hàng
        localStorage.removeItem('cart'); // Xóa giỏ hàng khỏi localStorage
    }



    private cartSubject = new BehaviorSubject<any[]>([]);  // Giỏ hàng ban đầu là mảng rỗng
    public cart$ = this.cartSubject.asObservable();// Dùng Observable để subscribe

    getCart(userId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/user/${userId}`, { headers: this.getAuthHeaders() });
    }

    addToCart(cartItemData: { user_id: number; product_detail_id: number; quantity: number }): Observable<any> {
        return this.http.post(`${this.apiUrl}/add`, cartItemData, { headers: this.getAuthHeaders() });  // Send the data to the backend
    }

    deleteCartItem(cartItemId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/items/${cartItemId}`, { headers: this.getAuthHeaders() });
    }


    updateCartSubject(cartItems: any[]): void {
        this.cartSubject.next(cartItems); // Cập nhật giỏ hàng
    }

    updateQuantity(cartItemId: number, quantity: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/update/${cartItemId}`, { quantity }, { headers: this.getAuthHeaders() });
    }





}