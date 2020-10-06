import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../../model/branch';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
    })
};

@Injectable({
    providedIn: 'root'
})
export class BranchService {
    branchAPI = 'https://5f7c0d1400bd74001690a2ed.mockapi.io/branches';

    constructor(private http: HttpClient) { }

    getBranch(): Observable<Branch[]> {
        return this.http.get<Branch[]>(this.branchAPI);
    }
    deleteBranch(branchid: any): Observable<{}> {
        const url = this.branchAPI + '/' + branchid.toString();
        return this.http.delete(url, httpOptions);
    }
    updateBranch(branch: Branch): Observable<Branch> {
        const url = this.branchAPI + '/' + branch.branch_id.toString();
        return this.http.put<Branch>(url, branch, httpOptions);
    }
    addBranch(branch: Branch): Observable<Branch> {
        return this.http.post<Branch>(this.branchAPI, branch, httpOptions);
    }
}
