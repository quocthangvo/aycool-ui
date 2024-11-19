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
    //         this.router.navigateByUrl('login'); // Chuyển hướng về login nếu không có token
    //         return false;
    //     }
    // }

    // canActivate(): boolean {
    //     const token = this.tokenService.getToken(); // Lấy token từ TokenService

    //     if (token) {
    //         // Nếu có token, cho phép truy cập vào route
    //         return true;
    //     } else {
    //         // Nếu không có token, chuyển hướng về trang login
    //         // this.router.navigateByUrl('login');
    //         return false;
    //     }
    // }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const token = this.tokenService.getToken();
        const userRole = this.tokenService.getRole(); // Lấy vai trò người dùng từ AuthService

        if (!token) {
            this.router.navigate(['/login']); // Nếu không có token, chuyển hướng đến trang login
            return false;
        }

        // Kiểm tra nếu route yêu cầu quyền ADMIN mà người dùng không có quyền
        const requiredRoles = route.data['roles'];
        // if (requiredRoles && !requiredRoles.includes(userRole)) {
        //     this.router.navigate(['/vn']); // Điều hướng nếu không có quyền
        if (route.data && route.data['roles'] && route.data['roles'].indexOf(userRole) === -1) {
            this.router.navigate(['/vn']); // Nếu không phải ADMIN, chuyển hướng về trang chủ hoặc trang khác
            return false;

        }

        return true;
    }
}
