import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import path from 'path';
import { RegisterComponent } from './pages/auth/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './auth.guard';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { CreateUserComponent } from './pages/user/create-user/create-user.component';
import { SubCategoryListComponent } from './pages/category/sub-category-list/sub-category-list.component';
import { ProductListComponent } from './pages/product/product-main/product-list/product-list.component';
import { CreateProductComponent } from './pages/product/product-main/create-product/create-product.component';
import { UpdateProductComponent } from './pages/product/product-main/update-product/update-product.component';
import { MaterialListComponent } from './pages/attribute/material/material-list/material-list.component';
import { SizeListComponent } from './pages/attribute/size/size-list/size-list.component';
import { ColorListComponent } from './pages/attribute/color/color-list/color-list.component';
import { OrderListComponent } from './pages/order/order-list/order-list.component';
import { UserLayoutComponent } from './layouts/user-ui/user-layout/user-layout.component';
import { HomeComponent } from './pages/user-page-ui/product/home/home.component';
import { PriceListComponent } from './pages/price/price-list/price-list.component';
import { CreatePriceComponent } from './pages/price/create-price/create-price.component';
import { ProductDetailComponent } from './pages/user-page-ui/product/product-detail/product-detail.component';

export const routes: Routes = [
    // {
    //     path: '***',
    //     redirectTo: '/vn',// chuyển hướng về login nếu không tìm thấy đường dẫn
    //     pathMatch: 'full'
    // },
    // {
    //     path: 'vn',
    //     component: UserLayoutComponent,
    // },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard], // Bảo vệ nếu đã đăng nhập
        data: { roles: ['ADMIN'] },
        children: [
            {
                path: 'user',
                component: UserListComponent
            },
            {
                path: 'create-user',
                component: CreateUserComponent
            },
            {
                path: 'sub-category',
                component: SubCategoryListComponent
            },
            {
                path: 'product',
                component: ProductListComponent
            },
            {
                path: 'create-product',
                component: CreateProductComponent
            },
            {
                path: 'update-product/:id',
                component: UpdateProductComponent
            },
            {
                path: 'material',
                component: MaterialListComponent
            },
            {
                path: 'size',
                component: SizeListComponent
            },
            {
                path: 'color',
                component: ColorListComponent
            },
            {
                path: 'order',
                component: OrderListComponent
            },
            {
                path: 'price',
                component: PriceListComponent
            },
            {
                path: 'create-price',
                component: CreatePriceComponent
            }
        ]
    },
    {
        path: 'vn',
        component: UserLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['USER'] },
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'product-detail/:id',
                component: ProductDetailComponent
            }
        ]
    },
    // {
    //     path: '**', // Đường dẫn không hợp lệ
    //     redirectTo: '/vn', // Chuyển hướng main nếu có token
    //     // pathMatch: 'full'

    // }


];
