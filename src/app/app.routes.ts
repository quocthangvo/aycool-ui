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
import { CartComponent } from './pages/user-page-ui/cart/cart/cart.component';
import { LoadingComponent } from './pages/home/loading/loading.component';
import { AddressComponent } from './pages/user-page-ui/address/address/address.component';
import { OrderComponent } from './pages/user-page-ui/order/order/order.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { AccountComponent } from './pages/user-page-ui/order/account/account.component';
import { SideBarComponent } from './pages/user-page-ui/order/side-bar/side-bar.component';
import { StatusComponent } from './pages/user-page-ui/order/order/status/status.component';
import { ProductFilterComponent } from './pages/user-page-ui/product/product-filter/product-filter.component';
import { ProductSearchComponent } from './pages/user-page-ui/product/product-search/product-search.component';
import { EvaluateComponent } from './pages/user-page-ui/product/evaluate/evaluate.component';
import { ReviewComponent } from './pages/user-page-ui/product/review/review.component';
import { CommentComponent } from './pages/user-page-ui/order/comment/comment.component';
import { CouponListComponent } from './pages/coupon/coupon-list/coupon-list.component';
import { CreateCouponComponent } from './pages/coupon/create-coupon/create-coupon.component';
import { UpdateCouponComponent } from './pages/coupon/update-coupon/update-coupon.component';
import { WarehouseListComponent } from './pages/admin-page-ui/warehouse/warehouse-list/warehouse-list.component';
import { CreateWarehouseComponent } from './pages/admin-page-ui/warehouse/create-warehouse/create-warehouse.component';
import { PurchaseListComponent } from './pages/admin-page-ui/purchase/purchase-list/purchase-list.component';
import { ProductChartComponent } from './pages/home/chart/product-chart/product-chart.component';
import { OrderChartComponent } from './pages/home/chart/order-chart/order-chart.component';
import { CategoryChartComponent } from './pages/home/chart/category-chart/category-chart.component';





export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full' // Đảm bảo chỉ chuyển hướng khi đường dẫn hoàn toàn trống.
    },

    {
        path: 'loading',
        component: LoadingComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'admin',
        component: MainLayoutComponent,
        canActivate: [AuthGuard], // Bảo vệ nếu đã đăng nhập
        // data: { roles: ['ADMIN'] },
        children: [
            {
                path: 'admin', // Nếu không chỉ định component hoặc redirect, sẽ xảy ra lỗi giao diện
                redirectTo: 'dashboard', // Điều hướng đến một component chính (ví dụ: Dashboard)
                // pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
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
            },
            {
                path: 'coupon',
                component: CouponListComponent
            },
            {
                path: 'create-coupon',
                component: CreateCouponComponent
            },
            {
                path: 'update-coupon/:id',
                component: UpdateCouponComponent
            },
            {
                path: 'warehouse',
                component: WarehouseListComponent
            },
            {
                path: 'create-warehouse',
                component: CreateWarehouseComponent
            },
            {
                path: 'purchase',
                component: PurchaseListComponent
            },
            {
                path: 'chart-product',
                component: ProductChartComponent
            },
            {
                path: 'chart-order',
                component: OrderChartComponent
            },
            {
                path: 'chart-category',
                component: CategoryChartComponent
            }

        ]
    },
    {
        path: '',
        component: UserLayoutComponent,
        canActivate: [AuthGuard],
        // data: { roles: ['USER'] },
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full' // Đảm bảo chỉ chuyển hướng khi đường dẫn hoàn toàn trống.
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'product-detail/:id',
                component: ProductDetailComponent
            },
            {
                path: 'cart',
                component: CartComponent
            },
            {
                path: 'address',
                component: AddressComponent
            },
            {
                path: 'order',
                component: OrderComponent
            },
            {
                path: 'account',
                component: AccountComponent
            },
            {
                path: 'profile',
                component: SideBarComponent
            },
            {
                path: 'status/:id',
                component: StatusComponent
            },
            {
                // khi lọc sản phẩm
                path: 'product-filter/:subCategoryId',
                component: ProductFilterComponent
            },
            {
                path: 'product-search',
                component: ProductSearchComponent
            },
            {
                path: 'review/:productDetailId',
                component: ReviewComponent
            },
            {
                path: 'comment/:orderId',
                component: CommentComponent,
            }


        ]
    },
    // {
    //     path: '**',
    //     redirectTo: 'home' // Chuyển hướng khi đường dẫn không tồn tại.
    // }



];
