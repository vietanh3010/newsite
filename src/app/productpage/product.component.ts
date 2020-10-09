import { AfterViewInit, Component, OnInit, ValueProvider, ViewChild } from '@angular/core';
import { LoginServiceService } from '../service/login/login-service.service';
import { AdminService } from '../service/admin/admin.service';
import { UserService } from '../service/user/user.service';
import { ProductService } from '../service/product/product.service';
import { NeworderService } from '../service/neworder/neworder.service';
import { ExcelService } from '../service/excel/excel.service';

import { Admin } from '../model/admin';
import { User } from '../model/user';
import { Product } from '../model/product';
import { Neworder } from '../model/neworder';
import { MyToast } from '../model/Mytoast';

import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Md5 } from 'ts-md5';
import { string } from 'src/assets/plugins/jszip/jszip';
import { create } from 'domain';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    infoarr: Admin[] = [];
    err: MyToast[] = [];

    allProduct: Product[] = [];
    importExcelProduct: Product[] = [];

    productSort: boolean = undefined;
    chooseProduct = '';

    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;

    constructor(
        private logoutService: LoginServiceService,
        private getAdminService: AdminService,
        private getUserService: UserService,
        private getProductService: ProductService,
        private getNeworderService: NeworderService,
        private routeLogout: Router,
        private getExcelService: ExcelService,
    ) {
        this.currentAdminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('currentAdmin')));
        this.currentAdmin = this.currentAdminSubject.asObservable();
    }

    ngOnInit(): void {
        this.infoarr.push(JSON.parse(localStorage.getItem('currentAdmin')));

        this.getallProduct();
    }

    getallProduct(): void {
        this.getProductService.getProduct().subscribe((data: any[]) => this.allProduct = data);
    }

    onFileChange(evt: any): void {
        const target: DataTransfer = (evt.target) as DataTransfer;
        if (target.files.length !== 1) {
            throw new Error('Cannot use multiple files');
        }

        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {

            const bstr: string = e.target.result;
            const data = this.getExcelService.importFromFile(bstr) as any[];

            var temp = {
                product_id: '',
                product_name: '',
                product_price: null,
                product_img: '',
                product_stock: null,
                product_bought: null,
                product_created_at: null,
                product_updated_at: null,
                product_hash_id: null,
                product_prime_cost: null,
                product_category: '',
                product_weight: null,
                product_description: '',
                product_branch: '',
                product_tag: [],
                additional_info: '',
                product_barcode: null,
                product_unit: '',
                product_brand: '',

            } as Product;
            const header: string[] = Object.getOwnPropertyNames(temp);

            const importedData = data;
            this.importExcelProduct = importedData.map(arr => {
                const obj = {};
                for (let i = 0; i < header.length; i++) {
                    const k = header[i];
                    obj[k] = arr[i];
                }
                return obj as Product;
            })
            this.importExcelProduct.splice(this.importExcelProduct.indexOf(this.importExcelProduct[0]), 1);
            this.make_error('success', 'Import data successfully!');
        };
        reader.readAsBinaryString(target.files[0]);

    }

    exportData(tableId: string): void {
        this.getExcelService.exportToFile('Model_Product', tableId);
    }

    updateData(): void {
        console.log(this.importExcelProduct);
        for (var i = 0; i < this.importExcelProduct.length; i++) {
            for (var j = 0; j < this.allProduct.length; j++) {
                // found existed product-> update stock
                if (this.importExcelProduct[i].product_hash_id === this.allProduct[j].product_hash_id) {
                    this.allProduct[j].product_stock += this.importExcelProduct[i].product_stock;

                    if (this.importExcelProduct[i].product_id !== '') { this.allProduct[j].product_id = this.importExcelProduct[i].product_id; }
                    if (this.importExcelProduct[i].product_name !== '') { this.allProduct[j].product_name = this.importExcelProduct[i].product_name; }
                    if (this.importExcelProduct[i].product_price !== null) { this.allProduct[j].product_price = this.importExcelProduct[i].product_price; }
                    if (this.importExcelProduct[i].product_img !== '') { this.allProduct[j].product_img = this.importExcelProduct[i].product_img; }
                    if (this.importExcelProduct[i].product_bought !== null) { this.allProduct[j].product_bought = this.importExcelProduct[i].product_bought; }
                    if (this.importExcelProduct[i].product_created_at !== null) { this.allProduct[j].product_created_at = this.importExcelProduct[i].product_created_at; }

                    this.allProduct[j].product_updated_at = new Date();

                    if (this.importExcelProduct[i].product_prime_cost !== null) { this.allProduct[j].product_prime_cost = this.importExcelProduct[i].product_prime_cost; }
                    if (this.importExcelProduct[i].product_category !== '') { this.allProduct[j].product_category = this.importExcelProduct[i].product_category; }
                    if (this.importExcelProduct[i].product_weight !== null) { this.allProduct[j].product_weight = this.importExcelProduct[i].product_weight; }
                    if (this.importExcelProduct[i].product_description !== '') { this.allProduct[j].product_description = this.importExcelProduct[i].product_description; }
                    if (this.importExcelProduct[i].product_tag !== []) { this.allProduct[j].product_tag = this.importExcelProduct[i].product_tag; }
                    if (this.importExcelProduct[i].additional_info !== '') { this.allProduct[j].additional_info = this.importExcelProduct[i].additional_info; }
                    if (this.importExcelProduct[i].product_barcode !== null) { this.allProduct[j].product_barcode = this.importExcelProduct[i].product_barcode; }
                    if (this.importExcelProduct[i].product_unit !== '') { this.allProduct[j].product_unit = this.importExcelProduct[i].product_unit; }
                    if (this.importExcelProduct[i].product_brand !== '') { this.allProduct[j].product_brand = this.importExcelProduct[i].product_brand; }
                    this.getProductService.updateProduct(this.allProduct[j]).subscribe();
                }
                else {
                    const id = 'myPid';
                    const name = this.importExcelProduct[i].product_name;
                    const price = this.importExcelProduct[i].product_price;
                    const img = this.importExcelProduct[i].product_img;
                    const stock = this.importExcelProduct[i].product_stock;
                    const bought = this.importExcelProduct[i].product_bought;
                    if (this.importExcelProduct[i].product_created_at === null) {
                        var created = new Date();
                    }
                    else {
                        var created = this.importExcelProduct[i].product_created_at;
                    }
                    const updated = new Date();
                    const md5Product = new Md5();
                    const hash = md5Product.appendStr(id + name + created).end().toString();
                    const primeCost = this.importExcelProduct[i].product_prime_cost;
                    const category = this.importExcelProduct[i].product_category;
                    const weight = this.importExcelProduct[i].product_weight;
                    const desscription = this.importExcelProduct[i].product_description;
                    const branch = this.importExcelProduct[i].product_branch;
                    const tag = this.importExcelProduct[i].product_tag[0];
                    const info = this.importExcelProduct[i].additional_info;
                    const barcode = this.importExcelProduct[i].product_barcode;
                    const unit = this.importExcelProduct[i].product_unit;
                    const brand = this.importExcelProduct[i].product_brand;

                    const unknProduct: unknown = {
                        id, name, price, img, stock, bought, created, updated, hash, primeCost,
                        category, weight, desscription, branch, tag, info, barcode, unit, brand
                    };
                    const newPro: Product = unknProduct as Product;
                    this.getProductService.addProduct(newPro).subscribe();
                }
            }
        }
        this.make_error('Success', 'Updated stock successfully');
        this.importExcelProduct = [];
    }


    sortProduct(property: any): void {
        this.chooseProduct = property;
        if (this.chooseProduct === 'product_id' ||
            this.chooseProduct === 'product_price' ||
            this.chooseProduct === 'product_stock' ||
            this.chooseProduct === 'product_bought' ||
            this.chooseProduct === 'product_prime_cost' ||
            this.chooseProduct === 'product_weight' ||
            this.chooseProduct === 'product_barcode') {
            if (this.productSort) {
                this.allProduct.sort((a, b) => parseFloat(a[property]) < parseFloat(b[property]) ? -1 : 1);
                this.productSort = false;
            }
            else {
                this.allProduct.sort((a, b) => parseFloat(a[property]) > parseFloat(b[property]) ? -1 : 1);
                this.productSort = true;
            }
        }
        else {
            if (this.productSort) {
                this.allProduct.sort((a, b) => a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1);
                this.productSort = false;
            }
            else {
                this.allProduct.sort((a, b) => a[property].toLowerCase() > b[property].toLowerCase() ? -1 : 1);
                this.productSort = true;
            }
        }
    }
    toast_type(t: string): object {
        if (t === 'danger') {
            return {
                'callout': true,
                'callout-danger ': true,
                'color ': 'red',
            };
        }
        else if (t === 'success') {
            return {
                'callout': true,
                'callout-success': true,
                'color': 'green',
            };
        }
        else if (t === 'warning') {
            return {
                'callout': true,
                'callout-warning': true,

            };
        }
        else {
            return {
                'callout': true,
                'callout-info': true,
            };
        }
    }
    toast_color(t: string): object {
        if (t === 'danger') {
            return {
                'color': 'red',
            };
        }
        else if (t === 'success') {
            return {
                'color': 'green',
            };
        }
        else if (t === 'warning') {
            return {
                'color': '#D39E00',
            };
        }
        else {
            return {
                'color': '#0F6E7D',
            };
        }
    }

    make_error(t: string, e: string): void {
        this.err.push({
            type: t,
            message: e
        });
        this.toast_type(t);
        this.toast_color(t);
        setTimeout(() => {
            this.err.splice(this.err.indexOf(this.err[0]), 1);
        }, 5000);
    }

    dismiss_err(e: MyToast): void {
        this.err.splice(this.err.indexOf(e), 1);
    }

}
