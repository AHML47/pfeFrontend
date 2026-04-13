import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing/user-routing-module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  exports: [
    CommonModule
  ]
})
export class UserModule { }
