import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
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


}
