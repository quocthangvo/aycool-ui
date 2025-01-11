import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from './services/auth/token.service';
import { AuthService } from './services/auth/auth.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router, private authService: AuthService) { }

    // canActivate(): boolean {
    //     if (this.tokenService.isTokenValid()) {
    //         return true;
    //     } else {
    //         // this.router.navigateByUrl('home'); // Chuyển hướng về login nếu không có token
    //         return false;
    //     }
    // }
    // canActivate(): boolean {
    //     if (this.tokenService.isTokenValid()) {
    //         const role = this.tokenService.getRole();
    //         if (role === 'ADMIN') {
    //             this.router.navigateByUrl('/admin'); // Điều hướng Admin về Dashboard
    //         } else if (role === 'USER') {
    //             this.router.navigateByUrl('/home'); // Điều hướng User về Home
    //         }
    //         return true;
    //     } else {
    //         this.router.navigateByUrl('/home'); // Không có token thì về trang chủ
    //         return false;
    //     }
    // }


    // canActivate(): boolean {
    //     if (this.tokenService.isTokenValid()) {
    //         const userRole = this.tokenService.getRole(); // Giả sử tokenService có phương thức này
    //         if (userRole === 'ADMIN') {
    //             this.router.navigateByUrl('admin'); // Chuyển hướng tới trang admin
    //             return false; // Ngăn không cho đi tiếp, chỉ chuyển hướng
    //         }
    //         return true; // Token hợp lệ, không phải admin, cho phép truy cập
    //     } else {
    //         this.router.navigateByUrl('home'); // Chuyển hướng về trang home nếu token không hợp lệ
    //         return false;
    //     }
    // }


    canActivate(): boolean {
        const token = this.tokenService.getToken(); // Lấy token từ TokenService

        if (token) {
            // Nếu có token, cho phép truy cập vào route
            return true;
        } else {
            // Nếu không có token, chuyển hướng về trang login
            // this.router.navigateByUrl('home');
            return false;
        }
    }

    // canActivate(
    //     route: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot
    // ): Observable<boolean> | Promise<boolean> | boolean {
    //     const token = this.tokenService.getToken();
    //     const userRole = this.tokenService.getRole(); // Lấy vai trò người dùng từ AuthService

    //     if (!token) {
    //         this.router.navigate(['/home']); // Nếu không có token, chuyển hướng đến trang home
    //         return false;
    //     }

    //     // // Kiểm tra nếu route yêu cầu quyền ADMIN mà người dùng không có quyền
    //     const requiredRoles = route.data['roles'];
    //     if (requiredRoles && !requiredRoles.includes(userRole)) {
    //         // If the user role does not match the required roles, redirect appropriately
    //         if (userRole === 'USER') {
    //             this.router.navigate(['/home']);
    //         } else if (userRole === 'ADMIN') {
    //             this.router.navigate(['/admin']);
    //         }
    //         return false;
    //     }
    //     // Kiểm tra nếu route yêu cầu quyền ADMIN và vai trò người dùng không phù hợp
    //     // const requiredRoles = route.data['roles'];
    //     // if (requiredRoles && !requiredRoles.includes(userRole)) {
    //     //     this.router.navigate(['/home']);
    //     //     return false;
    //     // }


    //     // if (route.data && route.data['roles'] && route.data['roles'].indexOf(userRole) === -1) {
    //     //     this.router.navigate(['/home']); // Nếu không phải ADMIN, chuyển hướng về trang chủ hoặc trang khác
    //     //     return false;
    //     // }

    //     return true;
    // }
}
