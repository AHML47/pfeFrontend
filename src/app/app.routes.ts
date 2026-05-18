import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { animation: 'HomePage' },
    loadComponent: () => import('./user/home/home').then((m) => m.HomeComponent)
  },
  {
    path: 'products',
    data: { animation: 'ProductsPage' },
    loadComponent: () => import('./user/products/product-list/product-list').then((m) => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    data: { animation: 'ProductDetailsPage' },
    loadComponent: () => import('./user/products/product-details/product-details').then((m) => m.ProductDetailsComponent)
  },
  {
    path: 'cart',
    data: { animation: 'CartPage' },
    loadComponent: () => import('./user/cart/cart').then((m) => m.CartComponent)
  },
  {
    path: 'orders',
    data: { animation: 'OrdersPage' },
    loadComponent: () => import('./user/orders/orders').then((m) => m.OrdersComponent)
  },
  {
    path: 'login',
    data: { animation: 'LoginPage' },
    loadComponent: () => import('./user/login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    data: { animation: 'RegisterPage' },
    loadComponent: () => import('./user/register/register').then((m) => m.RegisterComponent)
  },
  {
    path: 'admin',
    data: { animation: 'AdminPage' },
    loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.AdminDashboardComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
