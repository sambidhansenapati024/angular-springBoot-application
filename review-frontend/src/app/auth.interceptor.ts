import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token=localStorage.getItem("accesstoken");
    const loginUrl='http://localhost:2627/product-details/getaccesstoken';
    if(token && !request.url.includes(loginUrl)){
      const clone=request.clone({
        setHeaders:{
          Authorization : `Bearer ${token}`
        }
      });
      return next.handle(clone);
    }
    return next.handle(request);
  }
}
