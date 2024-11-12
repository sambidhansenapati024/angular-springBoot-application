import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  product:Product=new Product();
  productId=null;
  email='';
  userName='';
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
  constructor(private route: ActivatedRoute, private productService:ProductService, private router: Router,private toster: ToastrService) { }

  ngOnInit(): void {
    if(localStorage.getItem("check")=="yes"){
      this.productService.getPlatform().subscribe(data=>{
        this.platforms=data.details[0];
      });

      this.productService.getProductNames().subscribe(data=>{
        this.productName=data.details[0];
      });

      this.productId = this.route.snapshot.params['productId'];
      this.email = this.route.snapshot.params['email'];
      this.userName = this.route.snapshot.params['userName'];

      this.productService.getDetailsById(this.productId,this.email,this.userName).subscribe(data => {
          this.product = data.details[0];
          console.log(this.product);
      }, error => console.log(error))

    }else{
      this.router.navigate(['list-product'])
    }
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
    this.productService.updateHotelDetails(this.product).subscribe(data => {
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

 

}
