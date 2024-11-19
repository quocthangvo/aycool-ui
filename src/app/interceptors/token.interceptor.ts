import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from '../services/auth/token.service';
import { routes } from '../app.routes';
import { Router } from '@angular/router';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService, private router: Router) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        debugger
        const token = this.tokenService.getToken();
        // const remokeToken = this.tokenService.removeToken()
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        return next.handle(req);
        // return next.handle(req).pipe(
        //     catchError((e: HttpErrorResponse) => {
        //         if (e.status == 403) {
        //             remokeToken;
        //             this.router.navigateByUrl('');
        //         }
        //         const error = e.error.message || e.statusText;
        //         return throwError(() => error)
        //     })
        // );
    }

}
// tự động thêm token vào các yêu cầu HTTP.