import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  url = "https://jsonplaceholder.typicode.com/todos/1";

  url2 = "https://5f632f38363f0000162d8476.mockapi.io/users";

  constructor(private http : HttpClient ) { }

  public getUser(){
    return this.http.get(this.url2);
  }
}
