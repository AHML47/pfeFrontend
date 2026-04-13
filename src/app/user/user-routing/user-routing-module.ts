import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../login/login').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../home/home').then(m => m.HomeComponent )
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('../cart/cart').then(m => m.CartComponent)
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('../orders/order-list/order-list').then(m => m. OrderListComponent )
  },
  {
    path: 'products',
    loadComponent: () =>
      import('../products/product-list/product-list').then(m => m.ProductListComponent)
  },
  {
    path: 'products/details/:id',
    loadComponent: () =>
      import('../products/product-details/product-details').then(m => m.ProductDetails )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }