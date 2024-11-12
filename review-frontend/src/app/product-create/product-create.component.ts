import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  product:Product=new Product();
  platforms:any[]=[];
  productName:any[]=[];
  validationStock='';
  validationUserName='';
  validationOrderFrom='';
  validationPrice='';
  validationProdId='';
  validationProductName='';
  validationDelvType='';
  validationEmail='';

  constructor(private productService: ProductService, private router: Router,private toster: ToastrService) { }

  ngOnInit(): void {
  this.productService.getPlatform().subscribe(data=>{
  this.platforms=data.details[0];
  });

  this.productService.getProductNames().subscribe(data=>{
    this.productName=data.details[0];
  })
  }
  removeValidator(){
  this.validationStock='';
  this.validationUserName='';
  this.validationOrderFrom='';
  this.validationPrice='';
  this.validationProdId='';
  this.validationProductName='';
  this.validationDelvType='';
  this.validationEmail='';

     }

   goToProductList() {
      this.router.navigate(['list-product']);
    }

    onSubmit() {
    this.saveEmployee();
  }

  saveEmployee() {
    this.productService.createHotelDetails(this.product).subscribe(data => {
      console.log(data);
      if(data.message == "Validation Failed"){
        data.details.forEach(element=>{
          const keys=Object.keys(element);
          const key =keys[0];
          const value = element[key];
          if(key == "delevaryType"){
            this.validationDelvType = value;
          }
          else if(key == "productName"){
            this.validationProductName = value;
          }
          else if(key == "productId"){
            this.validationProdId= value;
          }
          else if(key == "price"){
            this.validationPrice = value;
          }
          else if(key == "orderFrom"){
            this.validationOrderFrom = value;
           }
           else if(key == "userName"){
             this.validationUserName = value;
           }
           else if(key == "stock"){
             this.validationStock = value;
           }
           else if(key == "email"){
            this.validationStock = value;
          }
        });

      }else{
        this.toster.success("Data Added Sucessfully");
      this.goToProductList();
      }
    },
    error => console.log(error));
  }

  onProductNameChange(event: any) {
    const selectedProductName = event.target.value;
    const selectedProduct = this.productName.find(product => product.name === selectedProductName);
    if (selectedProduct) {
      this.product.price = selectedProduct.price; 
    }
  }

}
