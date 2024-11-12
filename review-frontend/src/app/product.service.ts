import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:2627/product-details'
  private stsUrl='http://localhost:2627/product-details/status'
private logUrl='http://localhost:2627/product-details/getaccesstoken'
private platforlUrl='http://localhost:2627/product-details/platform'
private productUrl='http://localhost:2627/product-details/productDetails'

  constructor(private httpClient:HttpClient) { }

  createHotelDetails(product: Product): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}`, product);

  }

  updateHotelDetails( product: Product): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}`, product);
  }

  deleteHotelDetails(product:Product): Observable<any> {
    return this.httpClient.put(`${this.stsUrl}`,product);
  }

  getDetailsById(productId: number,email:string,userName:string):Observable<any>{
    return this.httpClient.get<Product>(`${this.baseUrl}/${productId}/${email}/${userName}`);
  }

  login(user:User):Observable<any>{
    return this.httpClient.post<any>(`${this.logUrl}`,user);

  }

  getPlatform():Observable<any>{
    return this.httpClient.get<any>(`${this.platforlUrl}`)
  }

  getProductNames():Observable<any>{
    return this.httpClient.get<any>(`${this.productUrl}`)
  }

}
