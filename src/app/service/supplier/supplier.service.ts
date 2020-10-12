import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from '../../model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../model/product';
import { ProductTag } from '../../model/productTag';
import { Supplier } from '../../model/supplier';

const httpOptions = {
    headers: new HttpHeaders({
    })
};


@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    supplierAPI = 'https://5f7c0d1400bd74001690a2ed.mockapi.io/suppliers';

    constructor(private http: HttpClient) { }

    getSupplier(): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(this.supplierAPI);
    }
    deleteSupplier(upplierid: any): Observable<{}> {
        const url = this.supplierAPI + '/' + upplierid.toString();
        return this.http.delete(url, httpOptions);
    }
    updateSupplier(supplier: Supplier): Observable<Supplier> {
        const url = this.supplierAPI + '/' + supplier.supplier_id.toString();
        return this.http.put<Supplier>(url, supplier, httpOptions);
    }
    addSupplier(supplier: Supplier): Observable<Supplier> {
        return this.http.post<Supplier>(this.supplierAPI, supplier, httpOptions);
    }
}