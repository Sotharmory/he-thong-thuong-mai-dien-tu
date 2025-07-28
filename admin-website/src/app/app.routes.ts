import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProductCategories } from './pages/product-categories/product-categories';
import { Products } from './pages/products/products';
import { OrdersComponent } from './pages/orders/orders';
import { SupportRequests } from './pages/support-requests/support-requests';
import { CouponsComponent } from './pages/coupons/coupons';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'product-categories', component: ProductCategories },
  { path: 'products', component: Products },
  { path: 'orders', component: OrdersComponent },
  { path: 'support-requests', component: SupportRequests },
  { path: 'coupons', component: CouponsComponent },
  { path: '**', redirectTo: '/dashboard' }
];
