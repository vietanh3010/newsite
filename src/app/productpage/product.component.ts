import { AfterViewInit, Component, OnInit, ValueProvider, ViewChild } from '@angular/core';
import { LoginServiceService } from '../service/login/login-service.service';
import { AdminService } from '../service/admin/admin.service';
import { UserService } from '../service/user/user.service';
import { ProductService } from '../service/product/product.service';
import { NeworderService } from '../service/neworder/neworder.service';
import { ExcelService } from '../service/excel/excel.service';
import { ProducttagService } from '../service/producttag/producttag.service';
import { SupplierService } from '../service/supplier/supplier.service';

import { Admin } from '../model/admin';
import { User } from '../model/user';
import { Product } from '../model/product';
import { Neworder } from '../model/neworder';
import { MyToast } from '../model/Mytoast';
import { ProductTag } from '../model/productTag';
import { Supplier } from '../model/supplier';

import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Md5 } from 'ts-md5';
import { string } from 'src/assets/plugins/jszip/jszip';
import { create } from 'domain';
import { filter } from 'src/assets/build/npm/Plugins';
import { data } from 'jquery';

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
    searchProduct;
    fileName = '';
    private currentAdminSubject: BehaviorSubject<Admin>;
    public currentAdmin: Observable<Admin>;

    constructor(
        private logoutService: LoginServiceService,
        private getAdminService: AdminService,
        private getUserService: UserService,
        private getProductService: ProductService,
        private getNeworderService: NeworderService,
        private routeLogout: Router,
        private getProductTagService: ProducttagService,
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
        this.getProductService.getProduct().subscribe((dataP: any[]) => this.allProduct = dataP);
    }

    onFileChange(evt: any): void {
        const target: DataTransfer = (evt.target) as DataTransfer;
        if (target.files.length !== 1) {
            this.make_error('warning', 'Cannot use multiple files.');
            throw new Error('Cannot use multiple files');
        }
        else if (target.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.make_error('danger', 'This is not an Excel xlsx file.');
        }
        else if (target.files[0].size > 41943040) {
            this.make_error('danger', 'File size cannot exceed 40MB.');
        }
        else {
            this.fileName = target.files[0].name;
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {

                const bstr: string = e.target.result;
                const data = this.getExcelService.importFromFile(bstr) as any[];
                var temp = {
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
                console.log(this.importExcelProduct[0]);
                if ((this.importExcelProduct[0].product_name).toString() === 'Name' &&
                    (this.importExcelProduct[0].product_price).toString() === 'Price' &&
                    (this.importExcelProduct[0].product_img).toString() === 'Image') {
                    this.importExcelProduct.splice(this.importExcelProduct.indexOf(this.importExcelProduct[0]), 1);
                    this.make_error('success', 'Import data successfully!');

                }
                else {
                    this.removeFile();
                    this.make_error('warning', 'Excel in incorrect format. Please check example file!');
                }


            };
            reader.readAsBinaryString(target.files[0]);
        }



    }
    removeFile(): void {
        this.importExcelProduct = [];
        this.fileName = '';
    }
    exportData(tableId: string): void {
        const dateNow = new Date().getTime();

        if (tableId === 'exportTable') {
            this.getExcelService.exportToFile('Product_' + dateNow, tableId);
        }
        else if (tableId === 'exampleTable') {
            this.getExcelService.exportToFile('Example_Excel', tableId);
        }
    }

    updateData(): void {
        console.log(this.importExcelProduct);
        const created = new Date();
        const updated = new Date();
        var existProductList = this.importExcelProduct.filter(a => this.allProduct.some(b => b.product_hash_id === a.product_hash_id)) as Product[]; // exist item found by hashid
        console.log(existProductList);
        for (var i = 0; i < existProductList.length; i++) {
            var index = this.allProduct.indexOf((this.allProduct.filter(a => a.product_hash_id === existProductList[i].product_hash_id) as Product[])[0]);
            this.allProduct[index].product_stock += existProductList[i].product_stock;

            if (this.allProduct[index].product_name !== existProductList[i].product_name) { this.allProduct[index].product_name = existProductList[i].product_name; } //update productname
            if (this.allProduct[index].product_price !== existProductList[i].product_price) { this.allProduct[index].product_price = existProductList[i].product_price; }
            if (this.allProduct[index].product_img !== existProductList[i].product_img) { this.allProduct[index].product_img = existProductList[i].product_img; }
            if (this.allProduct[index].product_bought !== existProductList[i].product_bought) { this.allProduct[index].product_bought = existProductList[i].product_bought; }
            if (this.allProduct[index].product_created_at !== existProductList[i].product_created_at) { this.allProduct[index].product_created_at = existProductList[i].product_created_at; }
            this.allProduct[index].product_updated_at = new Date();

            if (this.allProduct[index].product_prime_cost !== existProductList[i].product_prime_cost) { this.allProduct[index].product_prime_cost = existProductList[i].product_prime_cost; }
            if (this.allProduct[index].product_category !== existProductList[i].product_category) { this.allProduct[index].product_category = existProductList[i].product_category; }
            if (this.allProduct[index].product_weight !== existProductList[i].product_weight) { this.allProduct[index].product_weight = existProductList[i].product_weight; }
            if (this.allProduct[index].additional_info !== existProductList[i].additional_info) { this.allProduct[index].additional_info = existProductList[i].additional_info; }
            if (this.allProduct[index].product_barcode !== existProductList[i].product_barcode) { this.allProduct[index].product_barcode = existProductList[i].product_barcode; }
            if (this.allProduct[index].product_unit !== existProductList[i].product_unit) { this.allProduct[index].product_unit = existProductList[i].product_unit; }
            if (this.allProduct[index].product_brand !== existProductList[i].product_brand) { this.allProduct[index].product_brand = existProductList[i].product_brand; }

            var unkwTag = {
                tag_id: 'mytagid',
                tag_hash_id: (new Md5()).appendStr('Nhap hang' + existProductList[i].product_hash_id + created.toString()).end().toString(),
                tag_product_id: existProductList[i].product_hash_id,
                tag_name: 'Nhap hang',
                tag_quantity: existProductList[i].product_stock,
                tag_created_at: created,
                tag_updated_at: updated,
                tag_supplier_hid: '',
                tag_emp_created_hid: this.infoarr[0].admin_hash_id,
                tag_emp_updated_hid: this.infoarr[0].admin_hash_id,
                tag_branch_id: 'this branch',
                tag_info: '',
                tag_price: existProductList[i].product_price,
                tag_paid: 0,
                tag_user_id: '',
                tag_order_id: '',
                tag_discount_amount: 0,
            } as ProductTag;
            this.allProduct[index].product_tag.push(unkwTag);

            this.getProductService.updateProduct(this.allProduct[index]).subscribe();
            this.getProductTagService.addProductTag(unkwTag).subscribe();
        }

        // var newProductList = this.importExcelProduct.filter(a => existProductList.indexOf(a) < 0) as Product[]; //new item not existm

        var newProductList: Product[] = this.importExcelProduct.filter(a => existProductList.every(b => b.product_hash_id !== a.product_hash_id)) as Product[];
        console.log(newProductList);
        for (var i = 0; i < newProductList.length; i++) {
            console.log(newProductList[i]);

            if (newProductList[i].product_hash_id === '') {
                const md5Product = new Md5();
                const hash = md5Product.appendStr(newProductList[i].product_id + newProductList[i].product_name + created).end().toString();
                newProductList[i].product_hash_id = hash;
            }
            if (String(newProductList[i].product_stock) === '') { newProductList[i].product_stock = 0; }
            if (String(newProductList[i].product_price) === '') { newProductList[i].product_price = 0; }
            newProductList[i].product_created_at = created;
            newProductList[i].product_updated_at = updated;
            var unkwTag1 = {
                tag_id: 'mytagid',
                tag_hash_id: (new Md5()).appendStr('Nhap hang' + newProductList[i].product_hash_id + created.toString()).end().toString(),
                tag_product_id: newProductList[i].product_hash_id,
                tag_name: 'Nhap hang',
                tag_quantity: newProductList[i].product_stock,
                tag_created_at: created,
                tag_updated_at: updated,
                tag_supplier_hid: '',
                tag_emp_created_hid: this.infoarr[0].admin_hash_id,
                tag_emp_updated_hid: this.infoarr[0].admin_hash_id,
                tag_branch_id: 'this branch',
                tag_info: '',
                tag_price: newProductList[i].product_price,
                tag_paid: 0,
                tag_user_id: '',
                tag_order_id: '',
                tag_discount_amount: 0,
            } as ProductTag;

            newProductList[i].product_tag.push(unkwTag1);
            this.getProductService.addProduct(newProductList[i]).subscribe();
            this.getProductTagService.addProductTag(unkwTag1).subscribe();
        }
        //make a tag for each product in the imported

        this.make_error('Success', 'Updated stock ' + existProductList.length + ' products. Added ' + newProductList.length + ' new products.');
        this.removeFile();
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


    updateProduct(p: Product, pname: string, pprice: number, pprimecost: number, pcategory: string,
        pstock: number, pweight: number, pdescription: string, pbranch: string, pbarcode: number, punit: string, pbrand: string, pinfo: string): void {
        if (pname !== '') { p.product_name = pname; }
        if (String(pprice) !== '') { p.product_price = pprice; }
        if (String(pprimecost) !== '') { p.product_prime_cost = pprimecost; }
        if (pcategory !== '') { p.product_category = pcategory; }
        if (String(pstock) !== '') { p.product_stock = pstock; }
        if (String(pweight) !== '') { p.product_weight = pweight; }
        if (pdescription !== '') { p.product_description = pdescription; }
        if (pbranch !== '') { p.product_branch = pbranch; }
        if (String(pbarcode) !== '') { p.product_barcode = pbarcode; }
        if (punit !== '') { p.product_unit = punit; }
        if (pbrand !== '') { p.product_brand = pbrand; }
        if (pinfo !== '') { p.additional_info = pinfo; }
        p.product_updated_at = new Date();

        this.getProductService.updateProduct(p).subscribe();
        this.make_error('success', 'Product updated successfully.')
    }

    removeProduct(p: Product): void {
        this.getProductService.deleteProduct(p).subscribe();
        this.allProduct.splice(this.allProduct.indexOf(p), 1);
        this.make_error('info', 'Product deleted.');
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
