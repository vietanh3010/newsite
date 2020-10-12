import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from '../../model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../model/product';
import { ProductTag } from '../../model/productTag';

const httpOptions = {
    headers: new HttpHeaders({
    })
};


@Injectable({
    providedIn: 'root'
})
export class ProducttagService {

    producttagAPI = 'https://5f7c0d1400bd74001690a2ed.mockapi.io/productTag';

    constructor(private http: HttpClient) { }

    getProductTag(): Observable<ProductTag[]> {
        return this.http.get<ProductTag[]>(this.producttagAPI);
    }
    deleteProductTag(producttagid: any): Observable<{}> {
        const url = this.producttagAPI + '/' + producttagid.toString();
        return this.http.delete(url, httpOptions);
    }
    updateProductTag(producttag: ProductTag): Observable<ProductTag> {
        const url = this.producttagAPI + '/' + producttag.tag_id.toString();
        return this.http.put<ProductTag>(url, producttag, httpOptions);
    }
    addProductTag(producttag: ProductTag): Observable<ProductTag> {
        return this.http.post<ProductTag>(this.producttagAPI, producttag, httpOptions);
    }
}

