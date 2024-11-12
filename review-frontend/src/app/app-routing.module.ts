import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {path:"log-in",component:LogInComponent},
  {path:"list-product",component:ProductListComponent,canActivate:[AuthGuard]},
  {path:"update-product/:productId/:email/:userName",component:ProductUpdateComponent,canActivate:[AuthGuard]},
  {path:"create-product",component:ProductCreateComponent,canActivate:[AuthGuard]},
  {path:"",redirectTo:"log-in",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
