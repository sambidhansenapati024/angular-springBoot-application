import { Component, OnInit } from '@angular/core';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { User } from '../user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'datatables.net';
import * as $ from 'jquery';
import { Product } from '../product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  user:User[];
  users:User=new User();
  platforms:any[]=[];
  selectedProduct:Product;
  loading: boolean = false;
  intervalid:any;
  showDateFields = false;
  searchName='';
  searchproductName='';
  searchorderFrom='';
  searchStock=null;
  searchStatus='';
  searchStartDate='';
  searchEndDate='';

  constructor(private productService: ProductService,
    private router:Router,private http:HttpClient,private jwtservice:JwtHelperService,private toster: ToastrService) { }

  ngOnInit(): void {
    localStorage.setItem("check","no");
    this.initializeDataTable();
    this.productService.getPlatform().subscribe(data=>{
      this.platforms=data.details[0];
    });
   this.intervalid= setInterval(()=>{
      if((localStorage.getItem("accesstoken")!=null) && (this.jwtservice.isTokenExpired(localStorage.getItem("accesstoken"))))  {
         alert('Your Session Expired!!please Login Again!!')
         localStorage.removeItem("accesstoken")
        this.router.navigateByUrl('log-in');
      }
    },500)
  }
  ngOnDestroy(){
    clearInterval(this.intervalid);
  }
  initializeDataTable(): void {
    const table = $('#myTable').DataTable({
      serverSide: true,
      processing: false,
      searching:false,
      ordering:false,
      lengthMenu:[5,10,15,20,25],
      ajax: (data: any, callback: any) => {
        this.http.get('http://localhost:2627/product-details/search', {
          params: {
            iDisplayStart:( data.start/data.length).toString(),
            iDisplayLength: data.length.toString(),
           searchParam:JSON.stringify({ userName: this.searchName,
            status:this.searchStatus,
            fromDate:this.searchStartDate,
            toDate:this.searchEndDate,
            productName:this.searchproductName,
            stock:this.searchStock,
            orderFrom:this.searchorderFrom

           })

          }
         
        }).subscribe((response: any) => {
          console.log(response);
          callback({
            draw: data.draw,
            recordsTotal: response.details[0].iTotalRecords,
            recordsFiltered: response.details[0].iTotalDisplayRecords,
            data: response.details[0].aaData,
          });
        });
      },
      columns: [
        { data:'productId' },
        { data: 'productName' },
        { data: 'orderFrom' },
        { data: 'userName' },
        { data: 'orderDate' },
        {data: 'price'},
        { data: 'stock' },
        { data: 'email'},
        { data: 'delevaryType'},
        {data:'dispatchDate'},
        {
          data: "status",
          // render: function (data) {
          //   if (data === "Processing") {
          //     return '<span style="color: green; font-weight: 500;">';
          //   } else if (data === "Out for Delivery") {
          //     return '<span style="color: red; font-weight: 500;">';
          //   } else {
          //     return data;
          //   }
          // }
       
        }
      ],
      rowCallback: (row: Node, data: any) => {
        $(row).off('click').on('click', () => {
          if ($(row).hasClass('selected')) {
            $(row).removeClass("selected");
            this.selectedProduct = null;
          } else {
            $("#myTable tr.selected").removeClass("selected");
 
            $(row).addClass('selected');
            this.selectedProduct = data; // Set the selected data
          }
          this.selectProduct(this.selectedProduct);
        });
      }
      
    })
  };

  selectProduct(product: Product) {
    this.selectedProduct = product;
    console.log(this.selectedProduct);
  }

  create(){
    this.router.navigate(['create-product']);
  }

  update(){

    if(this.selectedProduct==undefined){
      alert('Please select a Data!!')
    } else if(this.selectedProduct.status=='Out of Delivary'){
      this.toster.warning('This product is already out for delivary');
      this.selectedProduct===null;
    }else{
      localStorage.setItem("check","yes");
    this.router.navigate(['update-product',this.selectedProduct.productId,this.selectedProduct.email,this.selectedProduct.userName]);
  }
  }

  deleteEmp() {
    if (this.selectedProduct === undefined) {
      alert('Please select a row for delivery!!');
    } else if (this.selectedProduct.status === 'Out for Delivery') {
     this.toster.warning('This Product Already out for devivary');
    } else {
      const confirmDelete = window.confirm('Are you sure you want to mark this customer as out of delivery?');
  
      if (confirmDelete) {
        this.productService.deleteHotelDetails(this.selectedProduct).subscribe(response => {
          console.log(response);
          $('#myTable').DataTable().ajax.reload();
        }, error => {
          console.error('Error updating status:', error);
        });
      }
    }
  }
  
  onCancel(){

    this.searchName='';
    this.searchorderFrom='';
    this.searchEndDate='';
    this.searchStartDate='';
    this.searchStock=null;
    this.searchStatus='';
    this.showDateFields=false;
    $('#myTable').DataTable().draw();
  

  } 

  onEnter(){
    // this.showDateFields=false;

    $('#myTable').DataTable().draw();
  }

  refresh(){
   
      $('#myTable').DataTable().draw();
  }
  logOut() {
    this.loading = true; // Set loading to true
  
    // Simulate a delay for the loading screen
    setTimeout(() => {
      localStorage.removeItem("accesstoken");
      this.router.navigate(['log-in']);
       //this.toster.success("LogOut Successful");
      this.loading = false; // Reset loading state after delay
    }, 1000); // Adjust the delay time as needed (2000 ms = 2 seconds)
  }
  toggleDropDown() {
    this.showDateFields = !this.showDateFields;
  }
  onChange(){

  }
}
