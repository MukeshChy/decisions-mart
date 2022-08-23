import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsertProductComponent } from './insert-product/insert-product.component';

const routes: Routes = [
  {
    path: '',
    component: InsertProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
