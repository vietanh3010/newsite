import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { Order } from '../model/order';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../model/product';

const httpOptions = {
  headers: new HttpHeaders({
  })
};
@Injectable({
  providedIn: 'root'
})
export class OrderService {


  orderAPI = "https://5f632f38363f0000162d8476.mockapi.io/orders";


  constructor(private http : HttpClient) { }

  getOrder (): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderAPI)
  }
  deleteOrder (orderid: any): Observable<{}> {
    const url = this.orderAPI + "/"+ orderid.toString();
    return this.http.delete(url, httpOptions)
  }
  updateOrder (order: Order): Observable<Order> {
    const url = this.orderAPI + "/"+ order.order_id.toString();
    return this.http.put<Order>(url,  order, httpOptions)
  }
  addOrder (order: Order): Observable<Order> {
    return this.http.post<Order>(this.orderAPI,order,httpOptions)
  }
}
