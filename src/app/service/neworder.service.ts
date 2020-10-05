import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../model/product';
import { Neworder } from '../model/neworder';


const httpOptions = {
    headers: new HttpHeaders({
    })
};

@Injectable({
    providedIn: 'root'
})
export class NeworderService {

    neworderAPI = 'https://5f632f38363f0000162d8476.mockapi.io/neworders';

    constructor(private http: HttpClient) { }

    getNeworder(): Observable<Neworder[]> {
        return this.http.get<Neworder[]>(this.neworderAPI);
    }
    deleteNeworder(neworderid: any): Observable<{}> {
        const url = this.neworderAPI + '/' + neworderid.toString();
        return this.http.delete(url, httpOptions);
    }
    updateNeworder(neworder: Neworder): Observable<Neworder> {
        const url = this.neworderAPI + '/' + neworder.order_id.toString();
        return this.http.put<Neworder>(url, neworder, httpOptions);
    }
    addNeworder(neworder: Neworder): Observable<Neworder> {
        return this.http.post<Neworder>(this.neworderAPI, neworder, httpOptions);
    }
}
