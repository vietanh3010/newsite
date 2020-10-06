import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from '../../model/user';
import { Product } from '../../model/product';
import { Admin } from '../../model/admin';
import { BehaviorSubject, Observable } from 'rxjs';


const httpOptions = {
    headers: new HttpHeaders({
    })
};
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    productAPI = 'https://5f632f38363f0000162d8476.mockapi.io/products';
    constructor(private http: HttpClient) { }
    getProduct(): Observable<Product[]> {
        return this.http.get<Product[]>(this.productAPI);
    }
    deleteProduct(id: any): Observable<{}> {
        const url = this.productAPI + '/' + id.toString();
        return this.http.delete(url, httpOptions);
    }
    updateProduct(product: Product): Observable<Product> {
        const url = this.productAPI + '/' + product.product_id.toString();
        return this.http.put<Product>(url, product, httpOptions);
    }
    addProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.productAPI, product, httpOptions);
    }
}
