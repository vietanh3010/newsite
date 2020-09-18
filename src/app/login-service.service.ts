import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  baseAPI = "https://5f632f38363f0000162d8476.mockapi.io/";

  userAPI = "https://5f632f38363f0000162d8476.mockapi.io/users";

  productAPI = "https://5f632f38363f0000162d8476.mockapi.io/products";

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http : HttpClient ) { 
                  this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
                  this.currentUser = this.currentUserSubject.asObservable();
  }

  //get user data
  getUser (): Observable<User[]> {
    return this.http.get<User[]>(this.userAPI)
  }

  deleteUser (id: any): Observable<{}> {
    //const url = `${this.userAPI}/id=${id}`;
    const url = this.userAPI + "/"+ id.toString();
    console.log(url);
    return this.http.delete(url, httpOptions)
  }

  updateUser (id: any): Observable<{}> {
    const url = this.userAPI + "/"+ id.toString();
    return this.http.put(url, id, httpOptions)
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  //store the logged email to localstorage
  storeLoginSession(session_id: string, session_name:string ,session_email: string, session_password: string, session_is_login:boolean, session_role:string){
    const tempUser = {
                    user_id : session_id,
                    user_name : session_name,
                    user_email : session_email, 
                    user_password : session_password, 
                    is_login : session_is_login,
                    user_role : session_role,
        }
      
    localStorage.setItem('currentUser', JSON.stringify(tempUser));
    this.currentUserSubject.next(tempUser);
    console.log(localStorage);
    console.log(this.currentUserValue);
  }

  //get product data
  //public getProduct(){
    //return this.http.get(this.productAPI);
 // }
  logout(){
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log(localStorage);
  }


}
